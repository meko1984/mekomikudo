param(
    [string]$CsvPath,
    [string]$HtmlPath,
    [switch]$Check
)

$ErrorActionPreference = "Stop"

function ConvertFrom-UnicodeJsonString {
    param([Parameter(Mandatory)] [string]$Value)
    return ('"' + $Value + '"' | ConvertFrom-Json)
}

$item = ConvertFrom-UnicodeJsonString '\u9805\u76ee'
$abbreviation = ConvertFrom-UnicodeJsonString '\u7565\u79f0'
$category = ConvertFrom-UnicodeJsonString '\u5206\u985e'
$referenceRange = ConvertFrom-UnicodeJsonString '\u53c2\u8003\u57fa\u6e96\u5024'
$unit = ConvertFrom-UnicodeJsonString '\u5358\u4f4d'
$referenceSource = ConvertFrom-UnicodeJsonString '\u57fa\u6e96\u5024\u51fa\u5178'
$increaseFactors = ConvertFrom-UnicodeJsonString '\u4e0a\u6607\u8981\u56e0'
$decreaseFactors = ConvertFrom-UnicodeJsonString '\u4f4e\u4e0b\u8981\u56e0'
$description = ConvertFrom-UnicodeJsonString '\u8aac\u660e'
$explanationSource = ConvertFrom-UnicodeJsonString '\u89e3\u8aac\u51fa\u5178'
$explanationSourceUrl = ConvertFrom-UnicodeJsonString '\u89e3\u8aac\u51fa\u5178URL'
$nursingPoint = ConvertFrom-UnicodeJsonString '\u770b\u8b77\u30dd\u30a4\u30f3\u30c8'
$labItems = ConvertFrom-UnicodeJsonString '\u691c\u67fb\u9805\u76ee'
$publishedItems = ConvertFrom-UnicodeJsonString '\u4ef6\u306e\u691c\u67fb\u9805\u76ee\u3092\u63b2\u8f09\u3057\u3066\u3044\u307e\u3059\u3002'
$resetConditions = ConvertFrom-UnicodeJsonString '\u6761\u4ef6\u3092\u30ea\u30bb\u30c3\u30c8'
$searchAllLabel = ConvertFrom-UnicodeJsonString '\u691c\u67fb\u5024\u3092\u307e\u3068\u3081\u3066\u691c\u7d22'
$searchAllPlaceholder = ConvertFrom-UnicodeJsonString '\u3059\u3079\u3066\u306e\u9805\u76ee\u3092\u307e\u3068\u3081\u3066\u691c\u7d22'
$columnFilters = ConvertFrom-UnicodeJsonString '\u9805\u76ee\u5225\u30d5\u30a3\u30eb\u30bf\u30fc'
$itemName = ConvertFrom-UnicodeJsonString '\u9805\u76ee\u540d'
$filterByItem = ConvertFrom-UnicodeJsonString '\u9805\u76ee\u540d\u3067\u7d5e\u308a\u8fbc\u307f'
$albuminExample = ConvertFrom-UnicodeJsonString '\u4f8b\uff1a\u30a2\u30eb\u30d6\u30df\u30f3'
$filterByAbbreviation = ConvertFrom-UnicodeJsonString '\u7565\u79f0\u3067\u7d5e\u308a\u8fbc\u307f'
$filterByCategory = ConvertFrom-UnicodeJsonString '\u5206\u985e\u3067\u7d5e\u308a\u8fbc\u307f'
$all = ConvertFrom-UnicodeJsonString '\u3059\u3079\u3066'

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
if (-not $CsvPath) { $CsvPath = Join-Path $projectRoot "data\lab-values.csv" }
if (-not $HtmlPath) { $HtmlPath = Join-Path $projectRoot "nursing\labs\index.html" }

$CsvPath = (Resolve-Path -LiteralPath $CsvPath).Path
$HtmlPath = (Resolve-Path -LiteralPath $HtmlPath).Path
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$startMarker = "<!-- LABS_STATIC_START -->"
$endMarker = "<!-- LABS_STATIC_END -->"
$requiredHeaders = @(
    $item, $abbreviation, $category, $referenceRange, $unit, $referenceSource,
    $increaseFactors, $decreaseFactors, 'Full name', $description,
    $explanationSource, $explanationSourceUrl, $nursingPoint
)
$tableColumns = @($item, $abbreviation, $category, $referenceRange, $unit)

$rows = @(Import-Csv -LiteralPath $CsvPath -Encoding UTF8)
if ($rows.Count -eq 0) { throw "The lab CSV has no data rows." }

$actualHeaders = @($rows[0].PSObject.Properties.Name)
$missingHeaders = @($requiredHeaders | Where-Object { $_ -notin $actualHeaders })
if ($missingHeaders.Count -gt 0) {
    throw "Missing lab CSV columns: $($missingHeaders -join ', ')"
}

function ConvertTo-HtmlText {
    param([AllowEmptyString()] [string]$Value)
    return [System.Net.WebUtility]::HtmlEncode($Value)
}

$staticRows = foreach ($row in $rows) {
    $cells = foreach ($column in $tableColumns) {
        "<td>$(ConvertTo-HtmlText ([string]$row.$column))</td>"
    }
    "            <tr>$($cells -join '')</tr>"
}

$jsonRows = @($rows | Select-Object -Property $requiredHeaders)
$json = $jsonRows | ConvertTo-Json -Depth 3 -Compress
$json = $json.Replace("&", "\u0026").Replace("<", "\u003c").Replace(">", "\u003e")

$rendered = @"
$startMarker
        <div class="database-panel labs-panel">
          <p class="labs-static-summary" data-labs-static-summary>$($rows.Count)$publishedItems</p>
          <div class="database-toolbar labs-toolbar" data-labs-toolbar hidden>
            <div class="labs-toolbar-heading">
              <strong data-labs-count aria-live="polite">$($rows.Count) $labItems</strong>
              <button class="labs-reset" type="button" data-labs-reset>$resetConditions</button>
            </div>
            <div class="database-controls labs-primary-controls">
              <input data-labs-search type="search" aria-label="$searchAllLabel" placeholder="$searchAllPlaceholder">
            </div>
            <div class="labs-column-filters" aria-label="$columnFilters">
              <label><span>$itemName</span><input data-labs-item type="search" aria-label="$filterByItem" placeholder="$albuminExample"></label>
              <label><span>$abbreviation</span><input data-labs-abbreviation type="search" aria-label="$filterByAbbreviation" placeholder="例：Alb"></label>
              <label><span>$category</span><select data-labs-category aria-label="$filterByCategory"><option value="">$all</option></select></label>
            </div>
          </div>
          <div class="database-table-wrap">
            <table class="database-table labs-table">
              <thead>
                <tr>
                  <th scope="col" aria-sort="none"><button type="button" data-sort="item" disabled>$item<span aria-hidden="true"></span></button></th>
                  <th scope="col" aria-sort="none"><button type="button" data-sort="abbreviation" disabled>$abbreviation<span aria-hidden="true"></span></button></th>
                  <th scope="col" aria-sort="none"><button type="button" data-sort="category" disabled>$category<span aria-hidden="true"></span></button></th>
                  <th scope="col" aria-sort="none"><button type="button" data-sort="referenceRange" disabled>$referenceRange<span aria-hidden="true"></span></button></th>
                  <th scope="col" aria-sort="none"><button type="button" data-sort="unit" disabled>$unit<span aria-hidden="true"></span></button></th>
                </tr>
              </thead>
              <tbody>
$($staticRows -join "`n")
              </tbody>
            </table>
          </div>
          <script type="application/json" data-labs-data>$json</script>
        </div>
        $endMarker
"@.TrimEnd("`r", "`n")

$page = [System.IO.File]::ReadAllText($HtmlPath, $utf8NoBom)
$start = $page.IndexOf($startMarker, [System.StringComparison]::Ordinal)
$end = $page.IndexOf($endMarker, [System.StringComparison]::Ordinal)
if ($start -lt 0 -or $end -lt $start) { throw "Static lab markers were not found." }
$end += $endMarker.Length

$current = $page.Substring($start, $end - $start)
if ($Check) {
    if ($current -cne $rendered) {
        throw "The lab HTML is out of date. Run Update-LabsPage.ps1."
    }
    Write-Host "Lab page is synchronized with CSV."
    exit 0
}

$updated = $page.Substring(0, $start) + $rendered + $page.Substring($end)
[System.IO.File]::WriteAllText($HtmlPath, $updated, $utf8NoBom)
Write-Host "Rendered $($rows.Count) lab items into $HtmlPath"
