#!/bin/bash

set -e  # エラーが発生したらスクリプトを終了

pwsh -NoProfile -ExecutionPolicy Bypass -Command "&{ . ./scripts/pwsh/copy.ps1; copy_rp }"