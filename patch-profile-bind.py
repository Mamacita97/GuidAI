#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pathlib
import re

BASE = pathlib.Path(__file__).resolve().parent


def fix_gbk_mojibake(s: str) -> str:
    b = bytearray()
    for c in s:
        if c == "\u20ac":
            b.append(0x80)
        else:
            try:
                b.extend(c.encode("gbk"))
            except UnicodeEncodeError:
                b.extend(c.encode("utf-8"))
    return b.decode("utf-8", errors="replace")


def repair_broken_close_tags(html: str) -> str:
    return re.sub(
        r"\?/(div|span|button|p|h[1-6]|section|a|label|input|textarea|ul|li|nav|header|footer|main|aside)>",
        r"</\1>",
        html,
        flags=re.I,
    )


def main():
    corrupt = (BASE / "index.html.corrupt.bak").read_text(encoding="utf-8")
    i1 = corrupt.find("profile-bind-appeal-modal")
    i2 = corrupt.find("tx-detail-modal")
    drawer = corrupt[
        corrupt.rfind("<div", 0, corrupt.find("profile-bind-drawer")) : corrupt.rfind(
            "<div", 0, i1
        )
    ]
    appeal = corrupt[corrupt.rfind("<div", 0, i1) : corrupt.rfind("<div", 0, i2)]
    blocks = (
        repair_broken_close_tags(fix_gbk_mojibake(drawer)).strip()
        + "\n\n"
        + repair_broken_close_tags(fix_gbk_mojibake(appeal)).strip()
        + "\n"
    )
    (BASE / "profile-bind-blocks.html").write_text(blocks, encoding="utf-8")

    index = (BASE / "index.html").read_text(encoding="utf-8")
    marker = '<div class="modal-overlay" id="tx-detail-modal">'
    if "profile-bind-drawer" not in index and marker in index:
        index = index.replace(marker, blocks + "\n" + marker, 1)
        (BASE / "index.html").write_text(index, encoding="utf-8")
        print("已插入 profile-bind 到 index.html")
    else:
        print("profile-bind 已存在或找不到插入点")


if __name__ == "__main__":
    main()
