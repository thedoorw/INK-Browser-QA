#!/usr/bin/env python3
from pathlib import Path
import runpy
script=Path(__file__).resolve().parents[1]/'visual'/'run_browser_visual_test.py'
runpy.run_path(str(script),run_name='__main__')
