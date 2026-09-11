#!/usr/bin/env python3
"""Replay the MIT-licensed Tessagon SVG adaptor used by the Inkscape extension.

This does not load the extension into the user's profile.  It produces the same
SVG group through the extension's declared dependency, then the release script
passes that SVG through the installed Inkscape CLI for a host-version reference.
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "external-assets" / "vendor"))

from tessagon.adaptors.svg_adaptor import SvgAdaptor
from tessagon.types.floret_tessagon import FloretTessagon


def build_svg():
    tessagon = FloretTessagon(
        simple_2d=True,
        u_num=6,
        v_num=8,
        u_range=[0, 1],
        v_range=[0, 1],
        u_cyclic=False,
        v_cyclic=False,
        adaptor_class=SvgAdaptor,
        svg_root_tag=(
            '<svg xmlns="http://www.w3.org/2000/svg" '
            'width="800" height="1000" viewBox="0 0 800 1000">'
        ),
        svg_fill_colors=["#f7d7cf", "#d9828b", "#8e4058", "#5f7f54"],
        svg_stroke_color="#4f2736",
        svg_stroke_width="1.5px",
        color_pattern=1,
        multiplier_2d=760,
        translate_2d=[20, 120],
    )
    return tessagon.create_mesh()


def main():
    output = ROOT / "external-assets" / "library" / "vector" / "inkscape" / "reference-floret-tessagon.svg"
    output.write_text(build_svg(), encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()

