from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen.canvas import Canvas

root = Path(__file__).resolve().parent.parent
source = root / "benchmarks" / "A-vector-flower" / "artwork-A-final.png"
target = root / "benchmarks" / "A-vector-flower" / "artwork-A.pdf"
image = ImageReader(str(source))
width, height = image.getSize()
page_width, page_height = A4
scale = min(page_width / width, page_height / height)
draw_width, draw_height = width * scale, height * scale
pdf = Canvas(str(target), pagesize=A4, pageCompression=1)
pdf.setTitle("INK Benchmark A - Editable Vector Flower")
pdf.setAuthor("INK 1.0.0")
pdf.drawImage(image, (page_width - draw_width) / 2, (page_height - draw_height) / 2,
              draw_width, draw_height, preserveAspectRatio=True, mask="auto")
pdf.showPage()
pdf.save()
