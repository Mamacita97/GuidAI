#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pathlib

base = pathlib.Path(__file__).resolve().parent
index = (base / "index.html").read_text(encoding="utf-8")
blocks = (base / "profile-bind-blocks.html").read_text(encoding="utf-8")
start = index.find(
    "<!-- ===== 交易详情弹窗 ===== -->\n<div id=\"profile-bind-drawer\""
)
end = index.find('<div class="modal-overlay" id="tx-detail-modal">')
if start < 0 or end < 0:
    raise SystemExit(f"markers not found start={start} end={end}")
index = (
    index[:start]
    + blocks
    + "\n<!-- ===== 交易详情弹窗 ===== -->\n\n"
    + index[end:]
)
(base / "index.html").write_text(index, encoding="utf-8")
print("OK")
