param(
  [Parameter(Mandatory=$true)][string]$ArchivePath,
  [Parameter(Mandatory=$true)][string]$DestinationPath,
  [int]$ExpectedFileCount = 0,
  [switch]$DeleteArchive
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Get-Location).Path
$archiveFull = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $ArchivePath))
$destFull = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $DestinationPath))

if (-not $archiveFull.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Archive path escapes repository root: $ArchivePath"
}
if (-not $destFull.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Destination path escapes repository root: $DestinationPath"
}
if (-not (Test-Path -LiteralPath $archiveFull -PathType Leaf)) {
  throw "Archive not found: $ArchivePath"
}
if ([System.IO.Path]::GetExtension($archiveFull).ToLowerInvariant() -ne '.zip') {
  throw "Only .zip archives are supported: $ArchivePath"
}

$tempRoot = Join-Path $env:TEMP ("ink-unpack-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tempRoot | Out-Null

try {
  Expand-Archive -LiteralPath $archiveFull -DestinationPath $tempRoot -Force

  $files = Get-ChildItem -LiteralPath $tempRoot -Recurse -File
  $actualCount = @($files).Count
  if ($ExpectedFileCount -gt 0 -and $actualCount -ne $ExpectedFileCount) {
    throw "File-count mismatch. Expected $ExpectedFileCount, got $actualCount."
  }

  New-Item -ItemType Directory -Path $destFull -Force | Out-Null

  foreach ($file in $files) {
    $relative = $file.FullName.Substring($tempRoot.Length).TrimStart('\','/')
    $target = Join-Path $destFull $relative
    $targetDir = Split-Path -Parent $target
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination $target -Force
  }

  $written = Get-ChildItem -LiteralPath $destFull -Recurse -File
  Write-Host "Archive: $ArchivePath"
  Write-Host "Destination: $DestinationPath"
  Write-Host "Files extracted: $actualCount"
  Write-Host "Files now under destination: $(@($written).Count)"

  if ($DeleteArchive) {
    Remove-Item -LiteralPath $archiveFull -Force
    Write-Host "Deleted staging archive: $ArchivePath"
  }
}
finally {
  if (Test-Path -LiteralPath $tempRoot) {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force
  }
}
