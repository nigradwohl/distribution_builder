# pdf_encryption.py

from PyPDF2 import PdfReader, PdfWriter

from pdfme import build_pdf
# https://pdfme.readthedocs.io/en/latest/tutorial.html

document = dict()

document['style'] = {
    'margin_bottom': 15,
    'text_align': 'j'
}

document['formats'] = {
    'url': {'c': 'blue', 'u': 1},
    'title': {'b': 1, 's': 13}
}

document['sections'] = []
section1 = {}
document['sections'].append(section1)

section1['content'] = content1 = []

content1.append({
    '.': 'A Title', 'style': 'title', 'label': 'title1',
    'outline': {'level': 1, 'text': 'A different title 1'}
})

content1.append(
    ['This is a paragraph with a ', {'.b;c:green': 'bold green part'}, ', a ',
    {'.': 'link', 'style': 'url', 'uri': 'https://some.url.com'},
    ', a footnote', {'footnote': 'description of the footnote'},
    ' and a reference to ',
    {'.': 'Title 2.', 'style': 'url', 'ref': 'title2'}]
)

with open('document.pdf', 'wb') as f:
    build_pdf(document, f)


reader = PdfReader("document.pdf")
writer = PdfWriter()

# Add all pages to the writer
for page in reader.pages:
    writer.add_page(page)

writer.encrypt("YOUR-PASSWORD-HERE")


with open('document.pdf', 'wb') as f:
    writer.write(f)