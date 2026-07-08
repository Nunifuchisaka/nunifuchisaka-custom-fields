$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$packageJson = Get-Content -LiteralPath (Join-Path $root 'package.json') -Raw | ConvertFrom-Json
$slug = $packageJson.name
$version = $packageJson.version
$releaseDir = Join-Path $root 'releases'
$workDir = Join-Path $releaseDir $slug
$zipPath = Join-Path $releaseDir "$slug-$version.zip"

New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
if (Test-Path -LiteralPath $workDir) {
  Remove-Item -LiteralPath $workDir -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Force -Path $workDir | Out-Null
Copy-Item -Path (Join-Path $root 'dist\*') -Destination $workDir -Recurse
Compress-Archive -Path $workDir -DestinationPath $zipPath
Remove-Item -LiteralPath $workDir -Recurse -Force
Write-Host "Created $zipPath"
