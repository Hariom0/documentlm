import { PDFParse } from "pdf-parse";

export async function extractPdf(filePath) {
    const parser = new PDFParse({ url: filePath });
    const result = await parser.getText();
    const checkedText = typeof result === "string" ? result : result.text;
    console.log(cleanText(checkedText))
}

export function cleanText(rawText) {
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

extractPdf("r8iUYjI5F1yhkmjhRuUIA9ol1Pe0jlGtuxsnLDLI")
