#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 UTF-8 片段重建 index.html，修复整页乱码。"""

import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

PLACEHOLDER_ORDER = [
    "header",
    "page-3dgs",
    "page-about",
    "page-announcement-detail",
    "page-announcements",
    "page-api",
    "page-app-detail",
    "page-apps",
    "page-article-detail",
    "page-article-list",
    "page-audio",
    "page-chat",
    "page-comic-detail",
    "page-design-detail",
    "page-help",
    "page-homepage",
    "page-image",
    "page-inspiration",
    "page-mcp-docs",
    "page-model-hub",
    "page-music-detail",
    "page-my-favs",
    "page-my-works",
    "page-myassets",
    "page-notifications",
    "page-profile",
    "page-series-detail",
    "page-skills",
    "page-transactions",
    "page-video",
    "page-vision-detail",
    "page-wallet",
    "page-work-detail",
    "page-footer",
]


def fix_gbk_mojibake(s: str) -> str:
    """UTF-8 被误读为 GBK 再存回 UTF-8 时的逆向修复。"""
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
    """修复 emoji 截断导致的 ?/div> 等错误闭合标签。"""
    return re.sub(
        r"\?/(div|span|button|p|h[1-6]|section|a|label|input|textarea|ul|li|nav|header|footer|main|aside|tr|td|th|thead|tbody|table|form|select|option|svg|path|g|article|figure|figcaption|blockquote|pre|code|em|strong|small|i|b|u|ol|dl|dt|dd)>",
        r"</\1>",
        html,
        flags=re.I,
    )


def read_fragment(name: str) -> str:
    path = os.path.join(BASE, name + ".html")
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    with open(path, "r", encoding="utf-8") as f:
        return f.read().strip() + "\n\n"


def extract_index_block(src: str, start_marker: str, end_marker: str | None) -> str:
    i = src.find(start_marker)
    if i < 0:
        return ""
    j = src.find(end_marker, i) if end_marker else len(src)
    if j < 0:
        j = len(src)
    return src[i:j]


def build_index_extra(corrupt: str) -> str:
    """从旧 index 提取仅存在于主文件中的块，并修复编码与标签。"""
    blocks = []

    profile_bind = extract_index_block(
        corrupt,
        '<div id="profile-bind-drawer"',
        '<div class="modal-overlay" id="profile-bind-appeal-modal"',
    )
    if profile_bind:
        blocks.append(
            repair_broken_close_tags(fix_gbk_mojibake(profile_bind.strip()))
            + "\n\n"
        )

    tail_start = corrupt.find('<div id="myworks-preview-modal"')
    if tail_start >= 0:
        tail = corrupt[tail_start:]
        if "</html>" in tail:
            tail = tail[: tail.rfind("</html>")]
        tail = re.sub(
            r'<section id="page-myassets-mobile"[\s\S]*?</section><!-- end page-myassets-mobile -->',
            "",
            tail,
        )
        tail = re.sub(
            r"<script>[\s\S]*?function mobToggleManage[\s\S]*?</script>\s*",
            "",
            tail,
            count=1,
        )
        tail = re.sub(
            r'<div id="insp-detail-modal"[\s\S]*$',
            "",
            tail,
        )
        tail = repair_broken_close_tags(fix_gbk_mojibake(tail.strip()))
        blocks.append(tail + "\n\n")

    insp_path = os.path.join(BASE, "insp-detail-modal.html")
    if os.path.exists(insp_path):
        with open(insp_path, "r", encoding="utf-8") as f:
            blocks.append(f.read().strip() + "\n\n")

    blocks.append(
        '<section id="page-myassets-mobile" class="page-section" '
        'style="display:none;" aria-hidden="true"></section>\n'
        "<!-- 移动端「我的产品」由 script.js 通过 iframe 加载 page-myassets-mobile.html -->\n\n"
    )

    return "".join(blocks)


def build_head() -> str:
    return """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>GUID.AI - 一站式AI创作平台</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="toast" id="toast"></div>

<div id="app-root">
"""


def build_tail() -> str:
    return """
  <script src="script.js"></script>
<script>
  if (typeof applyAuthSessionOnLoad === 'function') applyAuthSessionOnLoad();
  else if (typeof showPage === 'function') showPage('homepage');
</script>

</body>
</html>
"""


def main():
    corrupt_path = os.path.join(BASE, "index.html")
    backup_path = os.path.join(BASE, "index.html.corrupt.bak")

    with open(corrupt_path, "r", encoding="utf-8") as f:
        corrupt = f.read()

    if not os.path.exists(backup_path):
        with open(backup_path, "w", encoding="utf-8") as f:
            f.write(corrupt)
        print(f"已备份: {backup_path}")

    extra_path = os.path.join(BASE, "index-extra.html")
    if not os.path.exists(extra_path):
        extra = build_index_extra(corrupt)
        with open(extra_path, "w", encoding="utf-8") as f:
            f.write(extra)
        print(f"已生成: {extra_path} ({len(extra)} 字节)")

    profile_bind = ""
    with open(extra_path, "r", encoding="utf-8") as f:
        index_extra = f.read()
    m = re.search(
        r"(<div id=\"profile-bind-drawer\"[\s\S]*?)(?=<div id=\"myworks-preview-modal\"|$)",
        index_extra,
    )
    if m:
        profile_bind = m.group(1).strip() + "\n\n"
        index_extra = re.sub(
            r"<div id=\"profile-bind-drawer\"[\s\S]*?(?=<div id=\"myworks-preview-modal\")",
            "",
            index_extra,
            count=1,
        )

    parts = [build_head()]

    for name in PLACEHOLDER_ORDER:
        frag = read_fragment(name)
        if name == "page-footer" and profile_bind:
            frag = frag.replace(
                '<div class="modal-overlay" id="profile-bind-appeal-modal">',
                profile_bind + '<div class="modal-overlay" id="profile-bind-appeal-modal">',
                1,
            )
        parts.append(f"  <!-- {name}-placeholder -->\n")
        parts.append(frag)
        print(f"  + {name}.html")

    parts.append(index_extra)
    parts.append(build_tail())

    out = "".join(parts)
    out_path = os.path.join(BASE, "index.html")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(out)

    checks = ["灵感", "发布灵感", "充值", "一站式", "✨", "登录"]
    print("\n校验:")
    for k in checks:
        print(f"  {k}: {'OK' if k in out else '缺失'}")
    broken = len(re.findall(r"\?/div>", out))
    print(f"  残留 ?/div>: {broken}")
    print(f"\n完成: {out_path} ({len(out)} 字节)")


if __name__ == "__main__":
    main()
