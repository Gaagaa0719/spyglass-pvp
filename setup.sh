#!/bin/bash

set -e  # エラーが発生したらスクリプトを終了

npm update
bash ./scripts/installBDS.sh
bash ./copy.sh

read -p "Press Enter to continue..."
