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
$supportedSchemaVersion = 3

if ([int]$manifest.schemaVersion -ne $supportedSchemaVersion) {
    throw "Unsupported recipe manifest schemaVersion '$($manifest.schemaVersion)'. Expected $supportedSchemaVersion."
}

$allRecipes = @($manifest.recipes)
$duplicateRecipeIds = @($allRecipes | Group-Object id | Where-Object { $_.Count -gt 1 })
if ($duplicateRecipeIds.Count -gt 0) {
    throw "Duplicate recipe id(s): $($duplicateRecipeIds.Name -join ', ')."
}

$duplicateOutputs = @($allRecipes | Group-Object output | Where-Object { $_.Count -gt 1 })
if ($duplicateOutputs.Count -gt 0) {
    throw "Duplicate recipe output path(s): $($duplicateOutputs.Name -join ', ')."
}

foreach ($bookProperty in $manifest.books.PSObject.Properties) {
    $bookPath = [System.IO.Path]::GetFullPath((Join-Path $systemRoot $bookProperty.Value.path))
    if (-not (Test-Path -LiteralPath $bookPath)) {
        throw "Canonical book '$($bookProperty.Name)' was not found at $bookPath."
    }
}

foreach ($recipeDefinition in $allRecipes) {
    $duplicateSources = @(
        $recipeDefinition.sources |
            ForEach-Object { "$($_.book):$($_.block)" } |
            Group-Object |
            Where-Object { $_.Count -gt 1 }
    )
    if ($duplicateSources.Count -gt 0) {
        throw "Recipe '$($recipeDefinition.id)' has duplicate source dependency/dependencies: $($duplicateSources.Name -join ', ')."
    }

    $duplicateReferences = @(
        $recipeDefinition.approvedReferences |
            Group-Object |
            Where-Object { $_.Count -gt 1 }
    )
    if ($duplicateReferences.Count -gt 0) {
        throw "Recipe '$($recipeDefinition.id)' has duplicate approved reference(s): $($duplicateReferences.Name -join ', ')."
    }
}

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
    if ($Block -eq 0) {
        $start = 0
        $end = $lines.Count
        for ($index = 0; $index -lt $lines.Count; $index++) {
            if ($lines[$index] -match '^##\s+') {
                $end = $index
                break
            }
        }
        $heading = "$($lines[0]) - preamble"
    }
    else {
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
        $heading = $lines[$start]
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
        Heading = $heading
        Hash = $hash
    }
}

$recipes = $allRecipes
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
