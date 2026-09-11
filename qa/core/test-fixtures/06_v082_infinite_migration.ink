{
  "format": "INK",
  "formatVersion": 4,
  "appVersion": "0.8.2",
  "id": "fixture-legacy-infinite",
  "title": "06 Legacy Infinite Migration",
  "createdAt": "2026-07-24T00:00:00.000Z",
  "modifiedAt": "2026-07-24T00:00:00.000Z",
  "activePageId": "fixture-outside-page-1",
  "pages": [
    {
      "id": "fixture-outside-page-1",
      "name": "頁面 1",
      "artboard": {
        "mode": "infinite",
        "preset": "A4",
        "orientation": "portrait",
        "widthMm": 210,
        "heightMm": 297,
        "ppi": 300,
        "bleedMm": 3,
        "safeMarginMm": 10,
        "unit": "mm",
        "showBleed": true,
        "showSafeArea": true,
        "showCenter": true,
        "clipContent": true
      },
      "paper": {
        "type": "blank",
        "color": "#fffef9",
        "gridSize": 32,
        "absorbency": 0.58,
        "roughness": 0.42,
        "fiberStrength": 0.36,
        "fiberAngle": 0,
        "sizing": 0.28,
        "granulation": 0.32,
        "seed": 1337,
        "textureVisible": true
      },
      "camera": {
        "x": -120,
        "y": 80,
        "scale": 1.1,
        "rotation": 0.05
      },
      "layers": [
        {
          "id": "outside-main",
          "name": "主要內容",
          "visible": true,
          "locked": false,
          "opacity": 1,
          "objects": [
            {
              "id": "inside-card",
              "type": "shape",
              "shape": "rect",
              "matrix": [
                1,
                0,
                0,
                1,
                -250,
                -360
              ],
              "opacity": 1,
              "color": "#202020",
              "fillColor": "#fffef9",
              "fill": true,
              "size": 2,
              "x2": 500,
              "y2": 720,
              "w": 500,
              "h": 720
            },
            {
              "id": "inside-title",
              "type": "text",
              "matrix": [
                1,
                0,
                0,
                1,
                -130,
                -250
              ],
              "opacity": 1,
              "text": "版面內標題",
              "color": "#202020",
              "fontFamily": "Noto Sans TC",
              "fontSize": 34,
              "lineHeight": 1.3
            },
            {
              "id": "outside-swatch",
              "type": "shape",
              "shape": "ellipse",
              "matrix": [
                1,
                0,
                0,
                1,
                720,
                -120
              ],
              "opacity": 1,
              "color": "#2f8179",
              "fillColor": "#2f8179",
              "fill": true,
              "size": 2,
              "x2": 180,
              "y2": 180,
              "w": 180,
              "h": 180
            },
            {
              "id": "outside-note",
              "type": "text",
              "matrix": [
                1,
                0,
                0,
                1,
                700,
                100
              ],
              "opacity": 1,
              "text": "畫板外素材",
              "color": "#dedfe1",
              "fontFamily": "Noto Sans TC",
              "fontSize": 26,
              "lineHeight": 1.3
            }
          ]
        }
      ],
      "activeLayerId": "outside-main"
    }
  ],
  "recentColors": [
    "#202020",
    "#ffffff",
    "#b63c36",
    "#d18b2f",
    "#d7c64b",
    "#3d875d",
    "#2f718f",
    "#594f9a"
  ]
}
