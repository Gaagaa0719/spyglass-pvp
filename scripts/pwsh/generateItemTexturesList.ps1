function downloadVanillaData {
  param (
    [string]$tempPath
  )

  $url = "https://github.com/Mojang/bedrock-samples/archive/refs/heads/main.zip"
  $file = "$tempPath/vanilla_data.zip"

  try {
    Write-Output "Downloading $file from $url..."
    
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($url, $file)

    Write-Output "Downloaded $file."
  } catch {
    Write-Output "URL: $url`nERROR: $($_.Exception.Message)."
    exit 1
  }
}



function extractVanillaData {
  param (
    [string]$zip,
    [string]$path
  )

  Write-Output "Extracting $zip to $path..."
  Add-Type -Assembly "System.IO.Compression.Filesystem"
  [System.IO.Compression.ZipFile]::ExtractToDirectory((Resolve-Path $zip), (Resolve-Path $path))
  Write-Output "Extracted."
}

if(Test-Path ./temp) {
  Remove-Item ./temp -Recurse -Force
}

New-Item temp -ItemType Directory -Force > $null
downloadVanillaData "./temp"
extractVanillaData "./temp/vanilla_data.zip" "./temp"

node generateItemTexturesList.js

Remove-Item ./temp -Recurse -Force