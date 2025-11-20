# 共通のパス定義
$BPDir = "./bedrock-server/development_behavior_packs/bp"
$RPDir = "./bedrock-server/development_resource_packs/rp"
$TemplatePath = "./world_resource_packs_template.json"

# ローカルリソースパックディレクトリ
if ($isWindows) {    
  $LocalRPDir = "$env:APPDATA\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs"
} else {
    $LocalRPDir = "$HOME/.local/share/packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs"
}

# コピー関数
function r_copy {
  Param(
    [string]$src,
    [string]$dest,
    [string]$excludeDir = [System.String]::Empty
  )

  # ターゲットディレクトリが存在しない場合は作成する
  if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest
  }

  if ($isWindows) {
    # Windows用: robocopyを使用
    robocopy $src $dest /MIR /NDL /NJH /NJS /NP /NS /NC /XD $excludeDir
  } else {
    # Linux用: rsyncを使用
    rsync -av --delete --exclude=$excludeDir $src/ $dest/
  }
}

function copy_rp_uuid {
  $manifest = Get-Content ./addons/resource/manifest.json -Raw -Encoding utf8 | ConvertFrom-Json
  $uuid = $manifest.header.uuid

  $world_resource_packs = Get-Content $TemplatePath -Raw | ConvertFrom-Json

  # 追加する要素
  $newElement = [PSCustomObject]@{
    pack_id = $uuid
    version = @(1,0,0)
  }

  # 配列として明示的に変換して要素を追加
  if ($world_resource_packs -is [System.Collections.IList]) {
    $world_resource_packs.Add($newElement)
  } else {
    $world_resource_packs = @($world_resource_packs) + $newElement
  }

  # JSONに変換して書き込み
  $output = ConvertTo-Json $world_resource_packs -Depth 3
  [System.IO.File]::WriteAllLines("$(Get-Location)/bedrock-server/worlds/Bedrock_level/world_resource_packs.json", $output)
}



function copy_rp {
  # rsyncまたはrobocopyでリソースパックをコピー
  r_copy './addons/resource' "$RPDir"

  if (Test-Path "$LocalRPDir") {
    r_copy './addons/resource' "$LocalRPDir/Laluna-RPG-RP"
  }

  copy_rp_uuid
}

function copy_bp {
  # rsyncまたはrobocopyでビヘイビアパックをコピー
  r_copy './addons/behavior' "$BPDir" "scripts"

  if (Test-Path "$BPDir/scripts") {
    Remove-Item "$BPDir/scripts" -Recurse -Force
  }

  # Node.jsでビルドを実行
  node ./scripts/build.mjs
}
