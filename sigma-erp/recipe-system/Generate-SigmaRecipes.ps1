[CmdletBinding()]
param(
    [string]$Recipe,
    [switch]$Check
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$systemRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestPath = Join-Path $systemRoot 'recipe-manifest.json'
$manifest = Get-Content -Raw -Encoding UTF8 -LiteralPath $manifestPath | ConvertFrom-Json

function Normalize-Text {
    param([Parameter(Mandatory = $true)][string]$Text)

    return (($Text -replace "`r`n", "`n") -replace "`r", "`n").TrimEnd() + "`n"
}

function Get-SourceBlock {
    param(
        [Parameter(Mandatory = $true)][string]$BookPath,
        [Parameter(Mandatory = $true)][int]$Block
    )

    $lines = Get-Content -Encoding UTF8 -LiteralPath $BookPath
    $headingPattern = '^##\s+' + [regex]::Escape([string]$Block) + '(?:\.|\s)'
    $start = -1

    for ($index = 0; $index -lt $lines.Count; $index++) {
        if ($lines[$index] -match $headingPattern) {
            $start = $index
            break
        }
    }

    if ($start -lt 0) {
        throw "Block $Block was not found in $BookPath."
    }

    $end = $lines.Count
    for ($index = $start + 1; $index -lt $lines.Count; $index++) {
        if ($lines[$index] -match '^##\s+') {
            $end = $index
            break
        }
    }

    $text = Normalize-Text (($lines[$start..($end - 1)]) -join "`n")
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
        $hashBytes = $sha.ComputeHash($bytes)
        $hash = ([System.BitConverter]::ToString($hashBytes)).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }

    return [pscustomobject]@{
        Heading = $lines[$start]
        Hash = $hash
    }
}

$recipes = @($manifest.recipes)
if ($Recipe) {
    $recipes = @($recipes | Where-Object { $_.id -eq $Recipe })
    if ($recipes.Count -ne 1) {
        throw "Recipe '$Recipe' was not found in $manifestPath."
    }
}

$failed = $false
foreach ($recipeDefinition in $recipes) {
    $templatePath = Join-Path $systemRoot $recipeDefinition.template
    $outputPath = Join-Path $systemRoot $recipeDefinition.output
    $template = Get-Content -Raw -Encoding UTF8 -LiteralPath $templatePath

    if ($template.Contains([char]0x2026) -or $template.Contains('...')) {
        throw "Recipe template '$templatePath' contains an ellipsis. Use a complete instruction or a named placeholder."
    }

    $fingerprints = foreach ($source in $recipeDefinition.sources) {
        $bookDefinition = $manifest.books.($source.book)
        if ($null -eq $bookDefinition) {
            throw "Recipe '$($recipeDefinition.id)' references unknown book '$($source.book)'."
        }

        $bookPath = [System.IO.Path]::GetFullPath((Join-Path $systemRoot $bookDefinition.path))
        $block = Get-SourceBlock -BookPath $bookPath -Block ([int]$source.block)
        "- $($source.book).$($source.block): $($block.Heading) | sha256:$($block.Hash)"
    }

    $references = foreach ($reference in $recipeDefinition.approvedReferences) {
        '- `' + $reference + '`'
    }

    $body = $template.Replace(
        '{{SOURCE_FINGERPRINTS}}',
        ($fingerprints -join "`n")
    ).Replace(
        '{{APPROVED_REFERENCES}}',
        ($references -join "`n")
    )

    $header = @"
<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: $($recipeDefinition.id) | Status: $($recipeDefinition.status) -->
<!-- Source: recipe-manifest.json + $($recipeDefinition.template) -->

"@
    $expected = Normalize-Text ($header + $body)

    if ($Check) {
        if (-not (Test-Path -LiteralPath $outputPath)) {
            Write-Error "Missing generated recipe: $outputPath" -ErrorAction Continue
            $failed = $true
            continue
        }

        $actual = Normalize-Text (Get-Content -Raw -Encoding UTF8 -LiteralPath $outputPath)
        if ($actual -ne $expected) {
            Write-Error "Generated recipe is stale: $outputPath" -ErrorAction Continue
            $failed = $true
        }
        else {
            Write-Output "OK $($recipeDefinition.id)"
        }
        continue
    }

    $outputDirectory = Split-Path -Parent $outputPath
    if (-not (Test-Path -LiteralPath $outputDirectory)) {
        New-Item -ItemType Directory -Path $outputDirectory | Out-Null
    }

    $utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($outputPath, $expected, $utf8WithoutBom)
    Write-Output "Generated $($recipeDefinition.id) -> $outputPath"
}

if ($failed) {
    exit 1
}
