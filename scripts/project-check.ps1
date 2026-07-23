$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$strictUtf8 = New-Object System.Text.UTF8Encoding($false, $true)
$textExtensions = @(".html", ".css", ".js", ".json", ".md", ".csv", ".ps1")
$errors = [System.Collections.Generic.List[string]]::new()

$files = Get-ChildItem -LiteralPath $projectRoot -Recurse -File | Where-Object {
    $_.FullName -notlike "*\.git\*" -and $textExtensions -contains $_.Extension.ToLowerInvariant()
}

foreach ($file in $files) {
    try {
        [void]$strictUtf8.GetString([System.IO.File]::ReadAllBytes($file.FullName))
    }
    catch {
        $errors.Add("Invalid UTF-8: $($file.FullName)")
    }
}

$htmlFiles = $files | Where-Object { $_.Extension -eq ".html" }
$seenTitles = @{}
$seenDescriptions = @{}
foreach ($htmlFile in $htmlFiles) {
    $html = [System.IO.File]::ReadAllText($htmlFile.FullName, $strictUtf8)

    $seoElements = @{
        "title" = [regex]::Matches($html, '<title>[^<]+</title>', 'IgnoreCase').Count
        "meta description" = [regex]::Matches($html, '<meta\s+[^>]*name=["'']description["''][^>]*content=["''][^"'']+["''][^>]*>', 'IgnoreCase').Count
        "h1" = [regex]::Matches($html, '<h1(?:\s|>)', 'IgnoreCase').Count
    }
    foreach ($element in $seoElements.GetEnumerator()) {
        if ($element.Value -ne 1) {
            $errors.Add("Expected exactly one $($element.Key): $($htmlFile.FullName)")
        }
    }

    $titleMatch = [regex]::Match($html, '<title>([^<]+)</title>', 'IgnoreCase')
    if ($titleMatch.Success) {
        $titleText = $titleMatch.Groups[1].Value.Trim()
        if ($seenTitles.ContainsKey($titleText)) {
            $errors.Add("Duplicate title: $($htmlFile.FullName) and $($seenTitles[$titleText])")
        }
        else {
            $seenTitles[$titleText] = $htmlFile.FullName
        }
    }

    $descriptionMatch = [regex]::Match($html, '<meta\s+[^>]*name=["'']description["''][^>]*content=["'']([^"'']+)["''][^>]*>', 'IgnoreCase')
    if ($descriptionMatch.Success) {
        $descriptionText = $descriptionMatch.Groups[1].Value.Trim()
        if ($seenDescriptions.ContainsKey($descriptionText)) {
            $errors.Add("Duplicate meta description: $($htmlFile.FullName) and $($seenDescriptions[$descriptionText])")
        }
        else {
            $seenDescriptions[$descriptionText] = $htmlFile.FullName
        }
    }

    $isNoIndex = [regex]::IsMatch($html, '<meta\s+[^>]*name=["'']robots["''][^>]*content=["''][^"'']*noindex', 'IgnoreCase')
    if ($html.Contains("現在準備中") -and -not $isNoIndex) {
        $errors.Add("Preparation page must be noindex: $($htmlFile.FullName)")
    }

    if (-not $isNoIndex) {
        $indexableSeoElements = @{
            "robots" = '<meta\s+[^>]*name=["'']robots["''][^>]*>'
            "theme-color" = '<meta\s+[^>]*name=["'']theme-color["''][^>]*>'
            "og:title" = '<meta\s+[^>]*property=["'']og:title["''][^>]*>'
            "og:description" = '<meta\s+[^>]*property=["'']og:description["''][^>]*>'
            "og:site_name" = '<meta\s+[^>]*property=["'']og:site_name["''][^>]*>'
            "twitter:card" = '<meta\s+[^>]*name=["'']twitter:card["''][^>]*>'
        }
        foreach ($element in $indexableSeoElements.GetEnumerator()) {
            if (-not [regex]::IsMatch($html, $element.Value, 'IgnoreCase')) {
                $errors.Add("Missing $($element.Key) on indexable page: $($htmlFile.FullName)")
            }
        }
    }

    if ($htmlFile.Name -ne "index.html") {
        $errors.Add("Public HTML must use a directory index URL: $($htmlFile.FullName)")
    }

    $matches = [regex]::Matches($html, '(?:href|src|data-csv)=["'']([^"''#]+)')

    foreach ($match in $matches) {
        $reference = $match.Groups[1].Value
        if ($reference -match '^(?:https?:|mailto:|tel:|javascript:)') {
            continue
        }

        if ($reference.StartsWith("/")) {
            $errors.Add("Root-absolute local URL is not GitHub Pages portable: $($htmlFile.FullName) -> $reference")
            continue
        }

        $cleanReference = ($reference -split '[?#]', 2)[0]
        $target = [System.IO.Path]::GetFullPath((Join-Path $htmlFile.DirectoryName $cleanReference))
        if (-not (Test-Path -LiteralPath $target)) {
            $errors.Add("Missing local reference: $($htmlFile.FullName) -> $reference")
        }
    }
}

function ConvertFrom-UnicodeJsonString {
    param([Parameter(Mandatory)] [string]$Value)
    return ('"' + $Value + '"' | ConvertFrom-Json)
}

$expectedLabHeaders = @(
    ConvertFrom-UnicodeJsonString '\u9805\u76ee'
    ConvertFrom-UnicodeJsonString '\u7565\u79f0'
    ConvertFrom-UnicodeJsonString '\u5206\u985e'
    ConvertFrom-UnicodeJsonString '\u53c2\u8003\u57fa\u6e96\u5024'
    ConvertFrom-UnicodeJsonString '\u5358\u4f4d'
    ConvertFrom-UnicodeJsonString '\u57fa\u6e96\u5024\u51fa\u5178'
    ConvertFrom-UnicodeJsonString '\u4e0a\u6607\u8981\u56e0'
    ConvertFrom-UnicodeJsonString '\u4f4e\u4e0b\u8981\u56e0'
    'Full name'
    ConvertFrom-UnicodeJsonString '\u8aac\u660e'
    ConvertFrom-UnicodeJsonString '\u89e3\u8aac\u51fa\u5178'
    ConvertFrom-UnicodeJsonString '\u89e3\u8aac\u51fa\u5178URL'
    ConvertFrom-UnicodeJsonString '\u770b\u8b77\u30dd\u30a4\u30f3\u30c8'
)
$expectedMedicationHeaders = @(
    ConvertFrom-UnicodeJsonString '\u85ac\u5264\u4e00\u822c\u540d'
    ConvertFrom-UnicodeJsonString '\u85ac\u5264\u5546\u54c1\u540d'
    ConvertFrom-UnicodeJsonString '\u52b9\u679c\u52b9\u80fd'
    'Tmax/hr'
    ConvertFrom-UnicodeJsonString '\u85ac\u52b9\u5206\u985e'
    ConvertFrom-UnicodeJsonString '\u52b9\u679c\u767a\u73fe\u6642\u9593'
    ConvertFrom-UnicodeJsonString '\u6ce8\u610f\u70b9'
)

function Test-CsvHeaders {
    param(
        [Parameter(Mandatory)] [string]$Path,
        [Parameter(Mandatory)] [string[]]$ExpectedHeaders
    )

    $firstLine = [System.IO.File]::ReadLines($Path, $strictUtf8) | Select-Object -First 1
    $actualHeaders = @($firstLine -split "," | ForEach-Object { $_.Trim('"', ' ') })
    $missingHeaders = $ExpectedHeaders | Where-Object { $_ -notin $actualHeaders }

    if ($missingHeaders.Count -gt 0) {
        $errors.Add("Missing CSV columns: $Path ($($missingHeaders -join ', '))")
    }
}

$labCsv = Join-Path $projectRoot "data\lab-values.csv"
Test-CsvHeaders -Path $labCsv -ExpectedHeaders $expectedLabHeaders

try {
    & (Join-Path $PSScriptRoot "update-lab-values-page.ps1") -Check | Out-Null
}
catch {
    $errors.Add($_.Exception.Message)
}

$medicationCsvFiles = Get-ChildItem -LiteralPath (Join-Path $projectRoot "data\medications") -Filter "*.csv" -File
foreach ($csvFile in $medicationCsvFiles) {
    Test-CsvHeaders -Path $csvFile.FullName -ExpectedHeaders $expectedMedicationHeaders
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Host "Project check passed." -ForegroundColor Green
Write-Host "HTML: $($htmlFiles.Count) files / CSV: $(1 + $medicationCsvFiles.Count) files / Broken links: 0"
