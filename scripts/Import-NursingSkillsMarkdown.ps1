param(
    [Parameter(Mandatory = $true)]
    [string]$ZipPath,

    [string]$CatalogPath,

    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$slugMap = [ordered]@{
    '膀胱留置カテーテル' = 'urinary-catheter'
    '中心静脈カテーテル（CVC）' = 'central-venous-catheter'
    '洗髪' = 'hair-washing'
    '手浴・足浴' = 'hand-foot-bath'
    '陰部洗浄' = 'perineal-care'
    '清拭' = 'bed-bath'
    'ネーザルハイフロー（NHF）' = 'nasal-high-flow'
    '人工呼吸器' = 'mechanical-ventilation'
    '便処置（浣腸・坐薬・摘便）' = 'bowel-care'
    'NPPV（非侵襲的陽圧換気療法）' = 'nppv'
    '吸入' = 'inhalation'
    '導尿・残尿測定' = 'straight-catheterization'
    '直腸内与薬（坐薬）' = 'rectal-medication'
    '輸液管理' = 'infusion-management'
    '経管栄養' = 'enteral-nutrition'
    '心電図' = 'ecg'
    '透析' = 'dialysis'
    '包帯法' = 'bandaging'
    '注射' = 'injection'
    'ドップラー' = 'doppler'
    '吸引' = 'suction'
    '口腔ケア' = 'oral-care'
    '酸素療法' = 'oxygen-therapy'
    'IN-OUTバランス' = 'fluid-balance'
    'DIBキャップ' = 'dib-cap'
    'KT介入・嚥下評価(KTBC)' = 'ktbc'
    '末梢静脈路確保（ルートキープ）' = 'peripheral-iv'
    '胃管' = 'gastric-tube'
    '採血' = 'blood-draw'
    '輸血' = 'blood-transfusion'
    '胸腔ドレーン 胸腔穿刺' = 'chest-drain'
    '検体検査' = 'specimen-collection'
    '動脈血ライン（Aライン）' = 'arterial-line'
    '嚥下間接機能訓練' = 'swallowing-exercises'
    '急変時対応' = 'emergency-response'
    'エンゼルケア（死後の処置）' = 'postmortem-care'
    '血液培養採取' = 'blood-culture'
    '心膜穿刺 心膜ドレナージ' = 'pericardial-drainage'
}

$catalogTitleAliases = @{
    '胸腔ドレーン 胸腔穿刺' = '胸腔ドレーン/胸腔穿刺'
    '心膜穿刺 心膜ドレナージ' = '心膜穿刺/心膜ドレナージ'
}

function Convert-ToBaseTitle {
    param([string]$FileName)

    $name = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
    return ($name -replace '\s+[0-9a-f]{32}$', '').Trim()
}

function Test-SensitiveLine {
    param([string]$Line)

    $patterns = @(
        '^\s*ステータス\s*:',
        '(?i)(HCU|ICU|病棟|ナースステーション|ステーション|汚物室|処置室|器材庫|倉庫|ストック|棚|主任机|号室|配膳用?EV|エレベーター)',
        '(職場資料|院内資料|研修資料|救急カート点検表|夜間コードブルー|指示受け確認|院内マニュアル)',
        '\[(物品場所|電子カルテ)\]\(',
        '(違う。修正必要|要修正|未確認|確認必要|かな[？?]|分[？?]|関連図つける)',
        '(?i)(\.pdf(?:\.crdownload)?|\.csv|\.xlsx?|\.docx?|\.pptx?|[0-9a-f]{32}\.md|^\s*!\[\[)',
        '(カルテ右|カルテ「測定値」|ベッドサイド記録紙|デスクトップ「|Ba留置時のカルテ|出棺後のカルテ処理|指示簿|患者メモ)'
    )

    foreach ($pattern in $patterns) {
        if ($Line -match $pattern) {
            return $true
        }
    }
    return $false
}

function Convert-SafeMarkdown {
    param(
        [string[]]$Lines,
        [hashtable]$Counters
    )

    $result = [System.Collections.Generic.List[string]]::new()
    $skipSensitiveSection = $false
    $sensitiveSectionLevel = 0

    foreach ($rawLine in $Lines) {
        $line = $rawLine

        if ($line -match '^(#{1,6})\s+(.+)$') {
            $level = $Matches[1].Length
            $heading = $Matches[2]

            if ($heading -match '(物品場所|電子カルテ|院内|職場資料|研修資料|救急カート|夜間コードブルー|指示受け|コスト|死亡から出棺までの流れ|出棺後のカルテ処理|エコキャス交換)') {
                $skipSensitiveSection = $true
                $sensitiveSectionLevel = $level
                $Counters.SensitiveSections++
                continue
            }

            if ($skipSensitiveSection -and $level -le $sensitiveSectionLevel) {
                $skipSensitiveSection = $false
            }
        }

        if ($skipSensitiveSection) {
            $Counters.SensitiveLines++
            continue
        }

        if ($line -match '^\s*分類\s*:') {
            $Counters.NotionProperties++
            continue
        }

        if ($line -match '^\s*ステータス\s*:') {
            $Counters.StatusLines++
            continue
        }

        if (Test-SensitiveLine -Line $line) {
            $Counters.SensitiveLines++
            continue
        }

        $before = $line
        $line = [regex]::Replace(
            $line,
            '!\[([^\]]*)\]\((?!https?://)[^)]+\)',
            ''
        )
        $line = [regex]::Replace(
            $line,
            '(?i)<img\b[^>]*\bsrc=["''](?!https?://)[^"'']+["''][^>]*>',
            ''
        )
        if ($line -ne $before) {
            $Counters.MissingAssets++
        }

        $before = $line
        $line = [regex]::Replace(
            $line,
            '\[([^\]]+)\]\((?!https?://|#)[^)]+\)',
            '$1'
        )
        if ($line -ne $before) {
            $Counters.LocalLinks++
        }

        if ($line -match '^\s*$' -and $result.Count -gt 0 -and $result[$result.Count - 1] -match '^\s*$') {
            continue
        }

        $result.Add($line.TrimEnd())
    }

    while ($result.Count -gt 0 -and $result[0] -match '^\s*$') {
        $result.RemoveAt(0)
    }
    while ($result.Count -gt 0 -and $result[$result.Count - 1] -match '^\s*$') {
        $result.RemoveAt($result.Count - 1)
    }

    return $result.ToArray()
}

if (-not (Test-Path -LiteralPath $ZipPath -PathType Leaf)) {
    throw "ZIP not found: $ZipPath"
}
if ([string]::IsNullOrWhiteSpace($CatalogPath)) {
    $CatalogPath = Join-Path $PSScriptRoot '..\data\nursing-skills.csv'
}
if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path $PSScriptRoot '..\content\nursing-skills-drafts'
}
if (-not (Test-Path -LiteralPath $CatalogPath -PathType Leaf)) {
    throw "Catalog not found: $CatalogPath"
}

$catalog = Import-Csv -LiteralPath $CatalogPath
$catalogByTitle = @{}
foreach ($row in $catalog) {
    $catalogByTitle[$row.手技] = $row
}

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if (-not $resolvedOutput.StartsWith($workspaceRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Output path must be inside the workspace: $resolvedOutput"
}

if (Test-Path -LiteralPath $resolvedOutput) {
    throw "Output already exists. Review or remove it before re-importing: $resolvedOutput"
}
New-Item -ItemType Directory -Path $resolvedOutput | Out-Null

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $ZipPath))
$reportRows = [System.Collections.Generic.List[object]]::new()
$created = [System.Collections.Generic.List[object]]::new()

try {
    foreach ($entry in ($archive.Entries | Where-Object { $_.FullName -match '\.md$' } | Sort-Object FullName)) {
        $title = Convert-ToBaseTitle -FileName $entry.Name
        if (-not $slugMap.Contains($title)) {
            throw "No slug mapping for: $title"
        }
        $catalogTitle = if ($catalogTitleAliases.ContainsKey($title)) { $catalogTitleAliases[$title] } else { $title }
        if (-not $catalogByTitle.ContainsKey($catalogTitle)) {
            throw "No catalog row for: $title"
        }

        $reader = [System.IO.StreamReader]::new($entry.Open(), [System.Text.Encoding]::UTF8, $true)
        try {
            $source = $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
        }

        $counters = @{
            StatusLines = 0
            NotionProperties = 0
            SensitiveLines = 0
            SensitiveSections = 0
            MissingAssets = 0
            LocalLinks = 0
        }
        $bodyLines = Convert-SafeMarkdown -Lines ($source -split "\r?\n") -Counters $counters
        $row = $catalogByTitle[$catalogTitle]
        $slug = $slugMap[$title]

        if ($bodyLines.Count -gt 0 -and $bodyLines[0] -match '^#\s+') {
            $bodyLines = $bodyLines[1..($bodyLines.Count - 1)]
            while ($bodyLines.Count -gt 0 -and $bodyLines[0] -match '^\s*$') {
                $bodyLines = $bodyLines[1..($bodyLines.Count - 1)]
            }
        }

        $safeTitle = $title.Replace('"', '\"')
        $safeCategory = ([string]$row.分類).Replace('"', '\"')
        $safeSummary = ([string]$row.概要).Replace('"', '\"')
        $header = @(
            '---'
            "title: `"$safeTitle`""
            "category: `"$safeCategory`""
            "summary: `"$safeSummary`""
            'publication_status: "review-required"'
            '---'
            ''
            "# $title"
            ''
            '> 公開前レビュー用の下書きです。施設固有情報と個人の実施状況を除去しています。公開前に、最新の公的資料・添付文書・所属施設の手順を確認し、医療従事者による内容監修を行ってください。'
            ''
        )

        $outputFile = Join-Path $resolvedOutput "$slug.md"
        $content = ($header + $bodyLines) -join "`n"
        [System.IO.File]::WriteAllText($outputFile, ($content.TrimEnd() + "`n"), [System.Text.UTF8Encoding]::new($false))

        $created.Add([pscustomobject]@{
            Title = $title
            Category = $row.分類
            Summary = $row.概要
            File = "$slug.md"
        })
        $reportRows.Add([pscustomobject]@{
            File = "$slug.md"
            Status = $counters.StatusLines
            Properties = $counters.NotionProperties
            SensitiveLines = $counters.SensitiveLines
            SensitiveSections = $counters.SensitiveSections
            MissingAssets = $counters.MissingAssets
            LocalLinks = $counters.LocalLinks
        })
    }
}
finally {
    $archive.Dispose()
}

$readme = [System.Collections.Generic.List[string]]::new()
$readme.Add('# 看護技術コンテンツ（公開前下書き）')
$readme.Add('')
$readme.Add('Notionエクスポートを公開用に整理した下書きです。元データは変更していません。')
$readme.Add('')
$readme.Add('## 取り扱い')
$readme.Add('')
$readme.Add('- 個人の実施ステータス、院内の部署・部屋・保管場所、内部資料への参照を除去済みです。')
$readme.Add('- ZIPに画像・PDF本体がなかったため、ローカル添付リンクは除去しています。')
$readme.Add('- 医療内容の正確性・最新性は未監修です。そのまま公開しないでください。')
$readme.Add('- 公開時は、根拠となる公的資料・ガイドライン・添付文書を確認してください。')
$readme.Add('')
$readme.Add('## ファイル一覧')
$readme.Add('')
$readme.Add('| 技術名 | 分類 | ファイル |')
$readme.Add('|---|---|---|')
foreach ($item in ($created | Sort-Object Category, Title)) {
    $readme.Add("| $($item.Title) | $($item.Category) | [$($item.File)](./$($item.File)) |")
}
[System.IO.File]::WriteAllText((Join-Path $resolvedOutput 'README.md'), (($readme -join "`n") + "`n"), [System.Text.UTF8Encoding]::new($false))

$totals = @{
    Status = ($reportRows | Measure-Object Status -Sum).Sum
    Properties = ($reportRows | Measure-Object Properties -Sum).Sum
    SensitiveLines = ($reportRows | Measure-Object SensitiveLines -Sum).Sum
    SensitiveSections = ($reportRows | Measure-Object SensitiveSections -Sum).Sum
    MissingAssets = ($reportRows | Measure-Object MissingAssets -Sum).Sum
    LocalLinks = ($reportRows | Measure-Object LocalLinks -Sum).Sum
}
$zipHash = (Get-FileHash -LiteralPath $ZipPath -Algorithm SHA256).Hash
$report = [System.Collections.Generic.List[string]]::new()
$report.Add('# サニタイズ結果')
$report.Add('')
$report.Add("- 元ZIP SHA-256: ``$zipHash``")
$report.Add("- 処理したMarkdown: $($created.Count)件")
$report.Add("- 個人の実施ステータス除去: $($totals.Status)行")
$report.Add("- その他Notionプロパティ除去: $($totals.Properties)行")
$report.Add("- 院内・固有情報を含む行の除去: $($totals.SensitiveLines)行")
$report.Add("- 院内・固有情報を含む節の除去: $($totals.SensitiveSections)節")
$report.Add("- ZIPに実体がない添付参照の除去: $($totals.MissingAssets)件")
$report.Add("- ローカルページリンクのプレーンテキスト化: $($totals.LocalLinks)件")
$report.Add('')
$report.Add('レポートには、除去対象だった固有情報そのものは再掲していません。自動処理後の目視確認と医療内容の監修が必要です。')
$report.Add('')
$report.Add('## ファイル別集計')
$report.Add('')
$report.Add('| ファイル | ステータス | Notion属性 | 固有情報行 | 固有情報節 | 添付参照 | ローカルリンク |')
$report.Add('|---|---:|---:|---:|---:|---:|---:|')
foreach ($item in $reportRows) {
    $report.Add("| $($item.File) | $($item.Status) | $($item.Properties) | $($item.SensitiveLines) | $($item.SensitiveSections) | $($item.MissingAssets) | $($item.LocalLinks) |")
}
[System.IO.File]::WriteAllText((Join-Path $resolvedOutput 'SANITIZATION_REPORT.md'), (($report -join "`n") + "`n"), [System.Text.UTF8Encoding]::new($false))

Write-Output "Created $($created.Count) sanitized drafts in $resolvedOutput"
Write-Output "Removed: status=$($totals.Status), notion-properties=$($totals.Properties), sensitive-lines=$($totals.SensitiveLines), sensitive-sections=$($totals.SensitiveSections), missing-assets=$($totals.MissingAssets), local-links=$($totals.LocalLinks)"
