#!/bin/bash

set -e  # エラーが発生したらスクリプトを終了

cd "$(dirname "$0")"

bash ./scripts/copy_bp.sh
bash ./scripts/copy_rp.sh

read -p "Press Enter to continue..."
