#!/usr/bin/env python3
"""
把 src/ 裡的原始碼重新打包成可部署的 index.html。

用法：
    python3 build.py

流程：
    src/app.js       → 注入 src/template.html 的 @@APP_JS@@ 位置
    src/template.html→ JSON 編碼後放進 vendor/loader.html 的 @@TEMPLATE@@
    vendor/assets.json(runtime + 字型) 放進 @@MANIFEST@@
    → 輸出 index.html

平常只要改 src/app.js(遊戲數值、獎勵、段位、文字邏輯)
或 src/template.html(版面、顏色、排版),再跑一次 build.py 就好。
vendor/ 底下是框架與字型,不需要編輯。
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).parent

app_js   = (ROOT / "src" / "app.js").read_text(encoding="utf-8")
template = (ROOT / "src" / "template.html").read_text(encoding="utf-8")
loader   = (ROOT / "vendor" / "loader.html").read_text(encoding="utf-8")
manifest = (ROOT / "vendor" / "assets.json").read_text(encoding="utf-8").strip()

# 1) 把 app 邏輯注入版面模板
if "@@APP_JS@@" not in template:
    raise SystemExit("錯誤：src/template.html 找不到 @@APP_JS@@ 標記")
template = template.replace("@@APP_JS@@", app_js)

# 2) 模板需以 JSON 字串嵌入 <script> 內;把 </ 逸出成 <\/,
#    避免模板內的 </script> 提前關閉外層 script 標籤。
template_json = json.dumps(template, ensure_ascii=False).replace("</", "<\\/")

# 3) 組裝出最終的 index.html
out = loader.replace("@@MANIFEST@@", manifest).replace("@@TEMPLATE@@", template_json)
(ROOT / "index.html").write_text(out, encoding="utf-8")

print(f"已產生 index.html（{len(out):,} bytes）")
