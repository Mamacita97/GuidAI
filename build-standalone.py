#!/usr/bin/env python
"""
build-standalone.py
将 index.html 中所有模块化占位符替换为对应 .html 片段的内容，
生成可以在 file:// 协议下正常打开的自包含 HTML。
"""

import os, re

BASE = os.path.dirname(os.path.abspath(__file__))

# 读入 index.html
with open(os.path.join(BASE, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

# 找到所有 placeholders
# 模式: <div id="xxx-placeholder"></div>
placeholders = re.findall(r'<div id="([^"]+-placeholder)"></div>', html)
print(f"找到 {len(placeholders)} 个占位符")

replacements = 0
for ph_id in placeholders:
    # page-homepage-placeholder -> page-homepage.html
    name = ph_id.replace('-placeholder', '')
    frag_file = os.path.join(BASE, name + '.html')
    if not os.path.exists(frag_file):
        print(f"  [跳过] 文件不存在: {frag_file}")
        continue
    with open(frag_file, 'r', encoding='utf-8') as f:
        content = f.read()
    placeholder_tag = f'<div id="{ph_id}"></div>'
    if placeholder_tag in html:
        html = html.replace(placeholder_tag, content, 1)
        replacements += 1
        print(f"  [替换] {ph_id} <- {name}.html ({len(content)} 字节)")
    else:
        print(f"  [跳过] 未在 index.html 中找到: {placeholder_tag}")

print(f"\n共替换 {replacements} 个占位符")

# 模板已内置直接 script.js 加载，无需再替换加载器
# 保留此注释作为占位，以兼容旧版模板

# 写回
with open(os.path.join(BASE, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n完成！index.html 已更新，可在 file:// 协议下直接打开")
