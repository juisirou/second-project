@echo off
chcp 65001 > nul

echo ==============================
echo 画像リネーム処理を開始します
echo ==============================

REM このbat自身のあるフォルダに移動
cd /d %~dp0

python rename_by_folder.py

echo.
echo ==============================
echo 完了しました
echo ==============================
pause
