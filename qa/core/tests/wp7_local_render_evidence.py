from pathlib import Path
from playwright.sync_api import sync_playwright
import base64

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Runtime_Evidence" / "WP7"
html = (ROOT / "index-standalone.html").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="styles.css">', "")
html = html.replace('<script src="dist/ink.compat.js"></script>', "")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "dist" / "ink.compat.js").read_text(encoding="utf-8")


def render_document(source_name: str, output_name: str) -> None:
    source = OUT / source_name
    if not source.exists():
        raise FileNotFoundError(source)
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium",
            args=["--no-sandbox", "--disable-gpu-sandbox"],
        )
        page = browser.new_page(viewport={"width": 1000, "height": 800})
        page.set_content(html, wait_until="domcontentloaded")
        page.add_style_tag(content=css)
        page.add_script_tag(content=js)
        page.wait_for_function("window.INK_APP?.flora?.completeHero")
        page.add_script_tag(path=str(source))
        page.evaluate(
            "INK_APP.replaceDocument(window.WP7_DOCUMENT);"
            "INK_APP.flora.adapter.maskCache.clear();"
            "INK_APP.switchWorkspace('layout',{fit:false,announce:false});"
            "INK_APP.fitArtboard({switchSpace:false});"
            "INK_APP.renderer.render();"
        )
        encoded = page.evaluate(
            """async () => {
              const canvas = await INK_APP.renderExportCanvas({
                scope:'artboard', ppi:72, includeBleed:false,
                cropMarks:false, background:true
              });
              return canvas.toDataURL('image/png');
            }"""
        )
        (OUT / output_name).write_bytes(base64.b64decode(encoded.split(",", 1)[1]))
        browser.close()


render_document("WP7_Before_Local_Edit.document.js", "12_local_edit_before.png")
render_document("WP7_After_Local_Edit.document.js", "13_local_edit_after.png")
print("PASS: local before/after documents rendered in separate Chromium processes")
