. ./scripts/pwsh/bds.ps1

$levelDatUrl = "https://drive.google.com/uc?id=1KrHezCIEdY92oPF3G0pELrwrJcbP5dQ0"

$bdsVersion = getBDSVersion ./version.json

if(!(Test-Path ./bedrock-server/worlds/Bedrock_level/level.dat)) {
  try {
    Write-Output "Downloading level.dat..."
    Invoke-WebRequest -Uri $levelDatUrl -OutFile "./bedrock-server/worlds/Bedrock_level/level.dat"
    Write-Output "Downloaded level.dat."
  } catch {
    Write-Output "URL: $levelDatUrl`nERROR: $($_.Exception.Message)."
    exit 1
  }
}
if(Test-Path ./temp) {
  Remove-Item ./temp -Recurse -Force
}

New-Item temp -ItemType Directory -Force > $null

if($isWindows) {
  downloadBDS $bdsVersion "./temp"
}else {
  downloadLinuxBDS $bdsVersion "./temp"
}
extractBDS "./temp/bedrock-server.zip" "./temp"

copyBDS "./bedrock-server" "./temp"

Remove-Item ./temp -Recurse -Force
