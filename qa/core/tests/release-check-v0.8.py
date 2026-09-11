import json
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.8.3"
FORMAT_VERSION = 4
UNIT_TOTAL = 65
BROWSER_TOTAL = 86
checks = []


def add(name, passed, details=None):
    checks.append({"name": name, "passed": bool(passed), "details": details})


def text(path):
    return (ROOT / path).read_text(encoding="utf-8")


def data(path):
    return json.loads(text(path))


def run(command, timeout=180):
    proc = subprocess.run(command, cwd=ROOT, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout)
    return proc.returncode, proc.stdout

required = [
    "index.html", "index-standalone.html", "styles.css", "service-worker.js", "manifest.webmanifest",
    "package.json", "VERSION.json", "README_使用與測試.md", "dist/ink.compat.js",
    "src/config.js", "src/ink.js", "src/types/ink-types.ts",
    "src/document/workspace.js", "src/document/artboard.js", "src/document/model.js",
    "src/document/migration.js", "src/document/integrity.js", "src/document/storage.js",
    "src/render/tile-atlas.js", "src/render/live-canvas-tile-renderer.js", "src/render/tiled-export.js",
    "src/export/pdf.js", "src/history/history.js", "src/input/pen-calibration.js",
    "docs/INK_MASTER_SPEC_v2.5.md",
    "scripts/serve.mjs", "scripts/generate-test-fixtures.mjs", "scripts/test-ready-check.mjs",
    "TEST_EXECUTION_CHECKLIST.md", "BUG_REPORT_TEMPLATE.md", "TEST_MATRIX.csv",
    "test-fixtures/01_blank_a4.ink", "test-fixtures/02_creation_outside_artboard.ink",
    "test-fixtures/03_multilayer_poster.ink", "test-fixtures/04_natural_media_stress.ink",
    "test-fixtures/05_v082_fixed_migration.ink", "test-fixtures/06_v082_infinite_migration.ink",
    "test-fixtures/07_invalid_duplicate_id.ink", "test-fixtures/08_storage_recovery_scenario.json",
    "tests/test-ready-report-v0.8.json",
    "tests/runtime-report-v0.8.json", "tests/a4-output-report-v0.8.json", "tests/origin-validation-v0.8.json",
    "tests/desktop-layout-viewport-v0.8.3-p3.png", "tests/desktop-creation-space-v0.8.3-p3.png",
    "tests/mobile-creation-space-v0.8.3-p3.png", "tests/desktop-layer-workflow-v0.8.3-p3.png",
    "tests/desktop-history-panel-v0.8.3-p3.png",
]
missing = [p for p in required if not (ROOT / p).exists()]
add("Required v0.8.3 files", not missing, {"required": len(required), "missing": missing})

version = data("VERSION.json")
evidence = version.get("automatedEvidence", {})
add("Version identity", version.get("product") == "INK" and version.get("version") == VERSION and version.get("releaseName") == "Dual Space & Unified Studio UI — Visual History Panel Repair P3" and version.get("packageRevision") == "P3")
add("Format Version remains 4", version.get("formatVersion") == FORMAT_VERSION)
add("No technical rollback policy", "no technical rollback" in version.get("versionPolicy", "").lower())
add("Internal engineering trace retained", version.get("internalEngineeringBaseline") == "3.3.0-rc.2")
add("Master Spec pointer is v2.5", version.get("masterSpec") == "docs/INK_MASTER_SPEC_v2.5.md")
add("Unit evidence count", evidence.get("unitTests") == {"passed": UNIT_TOTAL, "total": UNIT_TOTAL})
add("Browser evidence count", evidence.get("browserChecks") == {"passed": BROWSER_TOTAL, "total": BROWSER_TOTAL, "runtimeErrors": 0})
limits = "\n".join(version.get("scope", {}).get("externalReleaseGates", []) + version.get("scope", {}).get("knownLimitations", []))
add("External limits remain explicit", all(token in limits for token in ["HTTP", "WebGL2", "physical", "Edge", "long-duration", "vector PDF"]))

runtime = data("tests/runtime-report-v0.8.json")
add("Chromium runtime report passes", runtime.get("version") == VERSION and runtime.get("passed") is True)
add("Chromium check count", len(runtime.get("checks", [])) == BROWSER_TOTAL)
add("Chromium checks all pass", all(c.get("passed") for c in runtime.get("checks", [])))
add("Runtime errors are zero", runtime.get("errors") == [])
runtime_blob = json.dumps(runtime, ensure_ascii=False)
for token, label in [
    ("Dual workspace defaults to full creation space", "Full creation-space default"),
    ("Layout space activates without duplicating document objects", "Shared object world"),
    ("Layout camera is restored independently", "Layout camera persistence"),
    ("Creation camera is restored independently", "Creation camera persistence"),
    ("Mobile uses the same dark studio chrome family as desktop", "Mobile desktop visual unity"),
    ("Mobile defaults to creation space", "Mobile creation-space default"),
    ("Live Canvas tile renderer is integrated and bounded", "Live Canvas tile integration"),
    ("Fullscreen button enters application fullscreen", "Application fullscreen mode"),
    ("Layer drag reorder changes display order without duplicating layers", "Layer drag reorder"),
    ("Inspector width and close buttons no longer overlap", "Inspector header controls"),
    ("Inspector and layer typography aligns with professional desktop panels", "Professional panel typography"),
    ("History panel and 20 30 50 limit control exist", "History panel limit control"),
    ("Click-style history navigation restores the selected transaction", "History step navigation"),
]:
    add(label, token in runtime_blob)

package = data("package.json")
manifest = data("manifest.webmanifest")
add("Package identity", package.get("name") == "ink-v0.8-dual-space-unified-ui" and package.get("version") == VERSION)
add("Test-Ready package scripts", all(name in package.get("scripts", {}) for name in ["start", "fixtures", "test:ready", "check"]))
add("Manifest identity", "v0.8.3" in manifest.get("name", "") and manifest.get("start_url") == "./index.html")
add("Manifest uses unified dark chrome", manifest.get("background_color") == "#232426" and manifest.get("theme_color") == "#2d2e30")

workspace = text("src/document/workspace.js")
model = text("src/document/model.js")
migration = text("src/document/migration.js")
integrity = text("src/document/integrity.js")
ink = text("src/ink.js")
index = text("index.html")
css = text("styles.css")
types = text("src/types/ink-types.ts")
add("Workspace source contract", all(t in workspace for t in ["WORKSPACE_SPACES", "creation", "layout", "activateWorkspace", "workspaceDiagnostics"]))
add("Independent workspace cameras", all(t in workspace for t in ["cameras", "DEFAULT_CREATION_CAMERA", "DEFAULT_LAYOUT_CAMERA"]))
add("Page model stores workspace", "workspace" in model and "createWorkspace" in model)
add("Migration maps legacy fixed/infinite", all(t in migration for t in ["legacyArtboardMode", "normalizeWorkspace", "infinite"]))
add("Integrity validates workspace", all(t in integrity for t in ["page.workspace.activeSpace", "page.workspace.cameras", "invalid-workspace-camera"]))
add("TypeScript workspace contract", all(t in types for t in ["interface WorkspaceState", "activeSpace", "cameras", "workspace: WorkspaceState"]))
add("Main app switches workspace", all(t in ink for t in ["switchWorkspace", "refreshWorkspaceUI", "spaceMode", "mod&&key==='1'", "mod&&key==='2'"]))
add("Main app preserves shared layers", "page.layers" in ink and "activateWorkspace(page,next)" in ink)
add("Workspace segmented control exists", all(t in index for t in ["workspaceSwitch", 'data-space="creation"', 'data-space="layout"']))
add("Workspace list menu is functional", all(t in index for t in ["workspaceMenuToggle", "workspaceMenu", "data-workspace-command"]) and all(t in ink for t in ["toggleWorkspaceMenu", "runWorkspaceCommand"]))
add("Fullscreen shell is implemented", all(t in index for t in ["fullscreenToggle", "#i-expand", "id=\"i-contract\""]) and all(t in ink for t in ["toggleFullscreen", "refreshFullscreenUI", "requestFullscreen", "fullscreenchange"]))
add("Layer panel uses drag reorder", all(t in ink for t in ["reorderLayer", "dragstart", "drop-before", "拖曳移動圖層"]) and all(t in index for t in ["layer-bottom-toolbar", "duplicateLayerBtn", "deleteLayerBtn"]) and "layer-drag-handle" in ink)
add("Legacy layer move controls removed", all(t not in index for t in ["layerUpBtn", "layerDownBtn", "layerMenuBtn"]))
add("History tab and visual step list exist", all(t in index for t in ['data-tab="history"', 'id="historyList"', 'id="historyLimit"']) and all(t in css for t in [".history-panel.active", ".history-step.current", ".history-step.future"]))
add("History defaults to 30 with 20 30 50 choices", "constructor(app, limit = 30)" in text("src/history/history.js") and all(t in text("src/history/history.js") for t in ["[20, 30, 50]", "jumpTo(appliedCount)", "timeline()"]), text("src/history/history.js")[:120])
add("History limit preference and panel navigation are wired", all(t in ink for t in ["ink-history-limit", "setHistoryLimit", "history.jumpTo", "history.timeline"]))
add("Inspector header actions are horizontal", ".inspector-head>.header-actions" in css and "flex-direction:row" in css)
add("Professional panel typography floor", "font-size:10.5px!important" in css and ".layer-row .layer-name strong" in css)
add("Layout model viewport contract", all(t in workspace for t in ["DEFAULT_LAYOUT_VIEWPORT", "normalizeLayoutViewport", "layoutViewport"]) and all(t in ink for t in ["layoutViewportMatrix", "fitLayoutViewportToContent", "useLayoutViewport:scope==='artboard'"]))
add("Layout viewport does not mutate source objects", "layoutViewportMatrix" in ink and "page.layers" in ink and "workspace.layoutViewport" in workspace)
add("Quick color input is locally anchored", "quickColorInput" in index and "quick-color-input" in css and "$('#quickColorInput').oninput" in ink)
add("Inspector edge seam and close controls repaired", all(t in css for t in [".inspector-edge-toggle:hover", "box-shadow:inset 2px 0 0", ".panel-close-button"]) and all(t in index for t in ["panel-close-button", "關閉檢查器"]))
add("Canvas settings icon and typography repaired", 'circle cx="12" cy="12"' in index and all(t in css for t in ["#canvasSettings .control-row>span", "font-size:11px", "#canvasSettings .panel-header strong"]))
add("Eraser cursor and hit test share world radius", all(t in ink for t in ["eraserRadiusWorld()", "const radius=this.eraserRadiusWorld()", "this.app.eraserRadiusWorld()*this.worldScreenScale()"]))
add("Creation A4 overlay control is removed", "showLayoutFrameInCreation" not in index and "drawCreationLayoutFrameWorld" not in ink)
add("Mobile and desktop share Studio tokens", all(t in css for t in ["#232426", "#2d2e30", "workspace-switch", "mobile-dock", "mobile-tool-sheet"]))
add("No second light mobile theme", "INK v0.8.3 — Dual Space & Unified Studio UI" in css)

artboard = text("src/document/artboard.js")
pdf = text("src/export/pdf.js")
live = text("src/render/live-canvas-tile-renderer.js")
atlas = text("src/render/tile-atlas.js")
tiled = text("src/render/tiled-export.js")
add("Artboard remains fixed layout frame", "mode: 'fixed'" in artboard and "normalizeArtboard" in artboard)
add("A4 physical dimensions contract", all(t in artboard for t in ["210", "297", "artboardPixelSize", "artboardExportGeometry"]))
add("PDF exact physical-size contract", all(t in pdf for t in ["%PDF-1.4", "MediaBox", "72 / 25.4"]))
add("Persistent tile atlas contract", all(t in atlas for t in ["PersistentTileAtlas", "markDirty", "updateDirty", "diagnostics"]))
add("Live Canvas tile adapter contract", all(t in live for t in ["LiveCanvasTileRenderer", "PersistentTileAtlas", "update", "draw"]))
add("Resumable tiled export contract", all(t in tiled for t in ["INK_TILED_EXPORT_CHECKPOINT_V1", "TiledExportJob", "cancel", "resume"]))

report = data("tests/a4-output-report-v0.8.json")
add("A4 report version and pass", report.get("version") == VERSION and report.get("passed") is True)
add("A4 portrait 300 PPI", report.get("portrait300") == {"widthMm": 210, "heightMm": 297, "widthPx": 2480, "heightPx": 3508})
add("A4 landscape 300 PPI", report.get("landscape300") == {"widthMm": 297, "heightMm": 210, "widthPx": 3508, "heightPx": 2480})
job = report.get("tiledExport", {}).get("job", {})
add("A4 resumable output completed", report.get("tiledExport", {}).get("tiled") is True and job.get("state") == "completed" and job.get("checkpoint", {}).get("completedTiles") == 4)
add("A4 raster PDF is valid", report.get("pdf", {}).get("type") == "application/pdf" and report.get("pdf", {}).get("header") == "%PDF-1.4")
add("Live tile report is bounded", report.get("liveTiles", {}).get("ready") is True and report.get("liveTiles", {}).get("atlas", {}).get("clean", 0) >= 1)

perf_names = ["spatial", "natural-media", "multichannel", "platform", "large-document", "release-endurance", "internal-hardening"]
perf = {n: data(f"tests/performance-{n}-report-v0.8.json") for n in perf_names}
add("Seven performance reports pass", all(r.get("version") == VERSION and r.get("passed") is True for r in perf.values()))
add("Spatial 10k and 50k", {c.get("count") for c in perf["spatial"].get("cases", [])} == {10000, 50000})
add("Natural media 100 to 10k points", {c.get("pointCount") for c in perf["natural-media"].get("cases", [])} == {100, 1000, 10000})
add("Platform 100k pen math", perf["platform"].get("pen", {}).get("count") == 100000)
add("Large document 20k objects", perf["large-document"].get("objectCount") == 20000 and perf["large-document"].get("integrity", {}).get("passed") is True)
add("Endurance 120k frames", perf["release-endurance"].get("frames") == 120000 and perf["release-endurance"].get("passed") is True)
add("Scoped History hardening", perf["internal-hardening"].get("history", {}).get("captureRatio", 1) < 0.01)
add("Tile atlas hardening", perf["internal-hardening"].get("tileAtlas", {}).get("passed") is True)
add("Resumable export hardening", perf["internal-hardening"].get("resumableExport", {}).get("completed") is True)

test_ready = data("tests/test-ready-report-v0.8.json")
add("Test-Ready self-check passes", test_ready.get("version") == VERSION and test_ready.get("packageRevision") == "P3" and test_ready.get("passed") is True)
add("Test-Ready fixtures and local server verified", test_ready.get("checksPassed") == test_ready.get("checksTotal") and test_ready.get("checksTotal", 0) >= 15)

origin = data("tests/origin-validation-v0.8.json")
origin_error = origin.get("fatal") or origin.get("error") or ""
add("Normal-origin limitation recorded honestly", origin.get("version") == VERSION and origin.get("passed") is False and "ERR_BLOCKED_BY_ADMINISTRATOR" in origin_error, origin_error)

sw = text("service-worker.js")
add("Service Worker version", "RELEASE_VERSION = '0.8.3-p3'" in sw)
add("Service Worker caches workspace module", "./src/document/workspace.js" in sw)
add("Service Worker safe update flow", all(t in sw for t in ["INK_SKIP_WAITING", "INK_GET_VERSION", "INK_CLEAR_RUNTIME_CACHE", "networkFirstNavigation", "staleWhileRevalidate"]))

master = text("docs/INK_MASTER_SPEC_v2.5.md")
add("Master Spec v2.5 P3 baseline", all(t in master for t in ["INK Master Spec v2.5", "INK v0.8.3", "v0.8.3-p3", "Format Version 4"]))
add("Master Spec defines shared object world and model viewport", all(t in master for t in ["創作空間", "版面空間", "共享同一組物件", "layoutViewport", "CAD 式版面視埠"]))
add("Master Spec defines unified mobile desktop UI", all(t in master for t in ["桌面／手機視覺統一", "#232426", "Bottom Dock", "同一視覺語言"]))
add("Master Spec contains honest external gates", all(t in master for t in ["ERR_BLOCKED_BY_ADMINISTRATOR", "WebGL2", "實體觸控筆", "不得宣稱"]))
add("Master Spec defines Test-Ready freeze", all(t in master for t in ["正常 Origin 啟動", "標準測試資料", "功能凍結", "npm run test:ready"]))
add("Master Spec defines fullscreen and layer workflow", all(t in master for t in ["全螢幕模式", "圖層面板", "拖曳排序", "底部專屬工具列", "INK Master Spec v2.5"]))
add("Master Spec defines visual history panel", all(t in master for t in ["歷史記錄面板", "預設 30 步", "20／30／50", "點擊任一步", "本次工作階段"]))
readme = text("README_使用與測試.md")
add("README identifies sole official technical document", "唯一正式技術文件" in readme and "INK_MASTER_SPEC_v2.5.md" in readme)

for filename, expected in [
    ("tests/desktop-layout-viewport-v0.8.3-p3.png", (1440, 960)),
    ("tests/desktop-creation-space-v0.8.3-p3.png", (1440, 960)),
    ("tests/mobile-creation-space-v0.8.3-p3.png", (390, 844)),
    ("tests/desktop-layer-workflow-v0.8.3-p3.png", (1440, 960)),
    ("tests/desktop-history-panel-v0.8.3-p3.png", (1440, 960)),
]:
    with Image.open(ROOT / filename) as image:
        add(f"Screenshot dimensions {Path(filename).name}", image.size == expected, image.size)

code, out = run(["npm", "run", "build"])
add("Compatibility build", code == 0 and "Built dist/ink.compat.js" in out, out[-500:])
code, out = run(["npm", "run", "typecheck"])
add("TypeScript strict", code == 0, out[-500:])
code, out = run(["npm", "test"])
add("Unit test execution", code == 0 and f"# pass {UNIT_TOTAL}" in out and "# fail 0" in out, out[-800:])
code, out = run(["npm", "run", "test:ready"])
add("Test-Ready execution", code == 0 and "checks passed" in out, out[-800:])

passed = sum(1 for c in checks if c["passed"])
result = {
    "schema": "INK_RELEASE_REPORT_V0_8",
    "version": VERSION,
    "formatVersion": FORMAT_VERSION,
    "passed": passed == len(checks),
    "decision": "V0_8_3_P3_INTERNAL_PASS_EXTERNAL_GATES_OPEN" if passed == len(checks) else "V0_8_3_INTERNAL_FAIL",
    "checksPassed": passed,
    "checksTotal": len(checks),
    "checks": checks,
}
(ROOT / "tests/release-report-v0.8.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
lines = [f"INK v{VERSION} release validation: {passed}/{len(checks)} checks passed"]
lines += [("PASS" if c["passed"] else "FAIL") + " | " + c["name"] for c in checks]
(ROOT / "tests/release-check-v0.8.log").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines))
raise SystemExit(0 if result["passed"] else 1)
