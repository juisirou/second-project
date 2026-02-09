from __future__ import annotations

import argparse
import re
from pathlib import Path


THREE_OR_MORE_DIGITS_RE = re.compile(r"\d{3,}")


def unique_target_path(target: Path) -> Path:
    """
    target が既に存在する場合、<stem>_<n><suffix> で衝突回避する。
    """
    if not target.exists():
        return target

    parent = target.parent
    stem = target.stem
    suffix = target.suffix
    n = 1
    while True:
        candidate = parent / f"{stem}_{n}{suffix}"
        if not candidate.exists():
            return candidate
        n += 1


def rename_in_same_folder(dry_run: bool = False) -> int:
    """
    このスクリプトと同じフォルダ内のファイルについて、
    ファイル名（拡張子を除く）に含まれる「連続した3桁以上の数字」をすべて削除してリネームする。
    """
    folder = Path(__file__).resolve().parent
    script_path = Path(__file__).resolve()

    changed = 0
    for p in folder.iterdir():
        # フォルダは対象外
        if not p.is_file():
            continue

        # 自分自身は対象外
        if p.resolve() == script_path:
            continue

        new_stem = THREE_OR_MORE_DIGITS_RE.sub("", p.stem)
        if new_stem == p.stem:
            continue

        # 全部消えて空になるケースを回避（最低1文字は残す）
        if new_stem == "":
            new_stem = "_"

        target = p.with_name(f"{new_stem}{p.suffix}")
        target = unique_target_path(target)

        if dry_run:
            print(f"[dry-run] {p.name} -> {target.name}")
        else:
            p.rename(target)
            print(f"{p.name} -> {target.name}")
        changed += 1

    return changed


def main() -> None:
    parser = argparse.ArgumentParser(
        description="同じフォルダ内のファイル名から、連続した3桁以上の数字をすべて削除してリネームします。"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="実際にはリネームせず、変更予定だけ表示します。",
    )
    args = parser.parse_args()

    count = rename_in_same_folder(dry_run=args.dry_run)
    if args.dry_run:
        print(f"変更予定: {count} 件")
    else:
        print(f"変更完了: {count} 件")


if __name__ == "__main__":
    main()
