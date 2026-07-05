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
import base64
import gzip
import json
import pathlib

ROOT = pathlib.Path(__file__).parent
RUNTIME_UUID = "b645423f-39af-4708-ab22-59ebc51bb268"

app_js   = (ROOT / "src" / "app.js").read_text(encoding="utf-8")
template = (ROOT / "src" / "template.html").read_text(encoding="utf-8")
loader   = (ROOT / "vendor" / "loader.html").read_text(encoding="utf-8")
assets   = json.loads((ROOT / "vendor" / "assets.json").read_text(encoding="utf-8"))

# 0) 從 vendor/runtime.js 重新產生 runtime 資產(runtime.js 為真實來源;
#    這樣改 runtime.js 的 CDN 路徑等設定才會生效)。字型資產維持不變。
runtime_src = (ROOT / "vendor" / "runtime.js").read_text(encoding="utf-8").encode("utf-8")
assets[RUNTIME_UUID] = {
    "mime": "text/javascript",
    "compressed": True,
    "data": base64.b64encode(gzip.compress(runtime_src)).decode("ascii"),
}
manifest = json.dumps(assets, ensure_ascii=False)

# 0.5) 版本戳記:日期 · 建置編號(git commit 數),每次 build 自動變動
import datetime, subprocess
try:
    _count = subprocess.check_output(["git", "rev-list", "--count", "HEAD"]).decode().strip()
except Exception:
    _count = "0"
build_id = datetime.date.today().strftime("%Y.%m.%d") + " · b" + _count
app_js = app_js.replace("@@BUILD@@", build_id)

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

# 3.5) 版本端點:輕量 version.json 供前端輪詢比對(多裝置版本漂移偵測)
try:
    _n = int(_count)
except Exception:
    _n = 0
(ROOT / "version.json").write_text(json.dumps({"n": _n, "v": build_id}, ensure_ascii=False), encoding="utf-8")

print(f"已產生 index.html（{len(out):,} bytes）+ version.json（b{_count}）")
