from pdfrw import PdfReader, PdfWriter, PdfDict, PdfObject

def fill_offer_letter(letter_content: str, output_path="pdf_store/generated/Offer_letter.pdf"):
    
    TEMPLATE_PATH = "pdf_store/templates/Offer_letter.pdf"
    template_pdf = PdfReader(TEMPLATE_PATH)
    
    if template_pdf.Root.AcroForm:
        template_pdf.Root.AcroForm.update(PdfDict(NeedAppearances=PdfObject("true")))

    for page in template_pdf.pages:
        annotations = page.get("/Annots")
        if annotations:
            for annotation in annotations:
                if annotation.get("/T") and annotation.get("/Subtype") == "/Widget":
                    key = annotation["/T"][1:-1]  # Remove brackets
                    if key == "letterBody":
                        annotation.update(PdfDict(V=f"{letter_content}"))

    PdfWriter(output_path, trailer=template_pdf).write()
    return output_path
