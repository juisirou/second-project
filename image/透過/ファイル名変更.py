import os

BASE_DIR = "C:\Users\user\Desktop\ポートフォリオ\チップ販売サイト\透過"

# 対象拡張子（必要なら増やす）
TARGET_EXTS = (".png", ".webp", ".jpg", ".jpeg")

for folder_name in os.listdir(BASE_DIR):
    folder_path = os.path.join(BASE_DIR, folder_name)

    if not os.path.isdir(folder_path):
        continue

    files = sorted([
        f for f in os.listdir(folder_path)
        if f.lower().endswith(TARGET_EXTS)
    ])

    for i, filename in enumerate(files, start=1):
        ext = os.path.splitext(filename)[1]
        new_name = f"{folder_name}_{i:02d}{ext}"

        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, new_name)

        os.rename(old_path, new_path)

    print(f"{folder_name}: {len(files)} files renamed")

print("すべて完了")

