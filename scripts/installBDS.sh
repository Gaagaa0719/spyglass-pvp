#!/bin/bash

set -e  # エラーが発生したらスクリプトを終了

pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/pwsh/installBDS.ps1
