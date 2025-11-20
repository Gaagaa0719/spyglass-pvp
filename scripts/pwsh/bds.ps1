$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function getBDSVersion {
  param (
    [string]$jsonPath
  )

  $text = Get-Content $jsonPath -Raw -Encoding utf8
  $text = $text -replace '(?m)(?<=^([^"]|"[^"]*")*)//.*' -replace '(?ms)/\*.*?\*/'
  $text = $text.Trim()
  return ConvertFrom-Json $text
}

function downloadLinuxBDS {
  param (
    [string]$version,
    [string]$tempPath
  )

  $url = "https://www.minecraft.net/bedrockdedicatedserver/bin-linux/bedrock-server-$version.zip"
  $file = "$tempPath/bedrock-server.zip"

  try {
    Write-Output "Downloading $file from $url..."
    Invoke-WebRequest -Uri $url -OutFile $file
    Write-Output "Downloaded $file."
  } catch {
    Write-Output "URL: $url`nERROR: $($_.Exception.Message)."
    exit 1
  }
}

function downloadBDS {
  param (
    [string]$version,
    [string]$tempPath
  )

  $url = "https://www.minecraft.net/bedrockdedicatedserver/bin-win/bedrock-server-$version.zip"
  $file = "$tempPath/bedrock-server.zip"

  try {
    Write-Output "Downloading $file from $url..."
    Invoke-WebRequest -Uri $url -OutFile $file
    Write-Output "Downloaded $file."
  } catch {
    Write-Output "URL: $url`nERROR: $($_.Exception.Message)."
    exit 1
  }
}

function extractBDS {
  param (
    [string]$zip,
    [string]$path
  )

  Write-Output "Extracting $zip to $path..."
  Add-Type -Assembly "System.IO.Compression.Filesystem"
  [System.IO.Compression.ZipFile]::ExtractToDirectory((Resolve-Path $zip), (Resolve-Path $path))
  Write-Output "Extracted."
}

function copyBDS {
  Param(
    [string]$path,
    [string]$tempPath
  )

  Write-Output "Copying BDS to $path..."

  $CopyFiles = @(
    "behavior_packs",
    "definitions",
    "resource_packs",
    "bedrock_server.exe"
  )

  
  if(!$isWindows) {
    $CopyFiles = @(
      "behavior_packs",
      "definitions",
      "resource_packs",
      "bedrock_server"
    )
  }

  foreach ($file in $CopyFiles) {
    if (Test-Path "./$path/$file") {
      Remove-Item "./$path/$file" -Recurse -Force
    }

    Copy-Item -Path "$tempPath/$file" -Destination "./$path/" -Recurse -Force
  }

  $CopyIfMissingFiles = @(
    "permissions.json",
    "allowlist.json"
  )

  foreach ($file in $CopyIfMissingFiles) {
    if (!(Test-Path "./$path/$file")) {
      Copy-Item -Path "$tempPath/$file" -Destination "./$path/" -Recurse -Force
    }
  }

  Write-Output "Copied."
}
