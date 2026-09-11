from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Runtime_Evidence" / "WP7R"
LOGS = OUT / "logs"
OUT.mkdir(parents=True, exist_ok=True)
LOGS.mkdir(parents=True, exist_ok=True)
PLAN = json.loads((OUT / "A4_Hero_Recovered_Plan.json").read_text(encoding="utf-8"))
NODE = json.loads((OUT / "node-transaction-evidence.json").read_text(encoding="utf-8"))

html = (ROOT / "index-standalone.html").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="styles.css">', "")
html = html.replace('<script src="dist/ink.compat.js"></script>', "")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "dist" / "ink.compat.js").read_text(encoding="utf-8")
messages = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path="/usr/bin/chromium",
        args=["--no-sandbox", "--disable-gpu-sandbox"],
    )
    page = browser.new_page(viewport={"width": 1500, "height": 1120})
    page.on("console", lambda message: messages.append({"type": message.type, "text": message.text}))
    page.on("pageerror", lambda error: messages.append({"type": "pageerror", "text": str(error)}))
    page.set_content(html, wait_until="domcontentloaded")
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.wait_for_function("window.INK_APP?.flora?.completeHero")
    page.evaluate(
        "INK_TEST.fresh();INK_TEST.setRenderMode('canvas2d');"
        "INK_APP.switchWorkspace('layout',{fit:false,announce:false});"
        "INK_APP.fitArtboard({switchSpace:false});"
    )
    compiled = page.evaluate("plan => INK_APP.flora.completeHero.compile(plan)", PLAN)
    executed = page.evaluate("plan => INK_APP.flora.completeHero.execute(plan)", PLAN)
    if not executed.get("ok"):
        raise RuntimeError(json.dumps(executed, ensure_ascii=False))
    png = page.evaluate(
        """async () => {
          const canvas = await INK_APP.renderExportCanvas({
            scope:'artboard', ppi:72, includeBleed:false,
            cropMarks:false, background:true
          });
          return { data:canvas.toDataURL('image/png'), width:canvas.width, height:canvas.height };
        }"""
    )
    payload = base64.b64decode(png["data"].split(",", 1)[1])
    refined = OUT / "01_wp7r_recovered_complete.png"
    refined.write_bytes(payload)
    (OUT / "Benchmark_C3R_Recovered_A4_Hero.png").write_bytes(payload)

    async_export = """async () => {
      INK_APP.switchWorkspace('layout',{fit:false,announce:false});
      INK_APP.fitArtboard({switchSpace:false});
      const canvas = await INK_APP.renderExportCanvas({scope:'artboard',ppi:72,includeBleed:false,cropMarks:false,background:true});
      return {data:canvas.toDataURL('image/png'),width:canvas.width,height:canvas.height};
    }"""
    for source_name, target_name in [
        ("WP7R_Before_Local_Edit.ink.json", "02_before_local_recompile.png"),
        ("WP7R_After_Local_Edit.ink.json", "03_after_local_recompile.png"),
    ]:
        serialized = (OUT / source_name).read_text(encoding="utf-8")
        page.evaluate("serialized => INK_APP.flora.reloadDocument(serialized)", serialized)
        page.evaluate("INK_APP.refreshAll();INK_APP.renderer.render();")
        rendered = page.evaluate(async_export)
        (OUT / target_name).write_bytes(base64.b64decode(rendered["data"].split(",",1)[1]))
    browser.close()

errors = [item for item in messages if item["type"] in {"error", "pageerror"}]
runtime = {
    "schema": "INK_FLORA_WP7R_BROWSER_RUNTIME_V1",
    "imageModelUsed": False,
    "specificSpeciesUsed": False,
    "benchmarkTraced": False,
    "plan": PLAN,
    "compiled": {
        "ok": compiled.get("ok"),
        "planHash": compiled.get("planHash"),
        "structureHash": compiled.get("structureHash"),
        "compileHash": compiled.get("compileHash"),
        "preview": compiled.get("preview"),
        "checks": compiled.get("checks"),
    },
    "execute": executed,
    "local": NODE["local"],
    "manual": {"preserved": NODE["local"]["manualPreserved"]},
    "export": {"width": png["width"], "height": png["height"], "bytes": len(payload)},
    "console": messages,
    "consoleErrors": errors,
}
(OUT / "runtime-log.json").write_text(json.dumps(runtime, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(OUT / "runtime-complete.flag").write_text("PASS\n" if not errors else "FAIL\n", encoding="utf-8")
summary = {
    "ok": not errors,
    "recipes": executed.get("recipeCount"),
    "actions": executed.get("actionCount"),
    "strokes": executed.get("strokeCount"),
    "export": runtime["export"],
    "runtimeErrors": len(errors),
}
(LOGS / "browser-runtime-evidence.log").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
print(json.dumps(summary, indent=2))
