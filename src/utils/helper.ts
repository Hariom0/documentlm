import cohere from "@/app/config/cohereConfig";
import { PDFParse } from "pdf-parse";
import wordExtractor from "word-extractor";
import path from "path";
import { readdir, unlink } from "fs/promises";

export type McqItem = {
  question: string;
  options: string[];
  correctAnswer: string;
  reference?: string;
};

export type SummaryResult = {
  summary: string;
  mcqs: McqItem[];
};

export async function getSummary(inputData: string): Promise<SummaryResult> {
  const response = await cohere.chat({
    model: "command-r-plus-08-2024",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are an expert educator and exam-setter. Given some study notes, respond ONLY as valid JSON following this schema: { summary: string, mcqs: { question: string, options: string[], correctAnswer: string, reference?: string }[] }",
      },
      {
        role: "user",
        content: inputData,
      },
    ],
    responseFormat: {
      type: "json_object",
      jsonSchema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          mcqs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correctAnswer: { type: "string" },
                reference: { type: "string" },
              },
              required: ["question", "options", "correctAnswer"],
            },
          },
        },
        required: ["summary", "mcqs"],
      },
    },
  });

  // Cohere returns JSON as a string in the message content
 /*
 EARLIER USED, GIVES AN ERROR-- CHANGED TO extract text from message content
  const content = response?.message?.content?.[0]?.text ?? "";
*/

  const content =
    response?.message?.content
      ?.filter((c: any) => c.type === "text")
      ?.map((c: any) => c.text)
      ?.join(" ") ?? "";

  try {
    const parsed = JSON.parse(content);
    return parsed as SummaryResult;
  } catch (err) {
    console.error("Failed to parse Cohere response:", err, content);
    return { summary: content || "", mcqs: [] };
  }
}


export async function extractPdf(filePath : string) {
	const parser = new PDFParse({ url: filePath });
	const result = await parser.getText();
	const checkedText = typeof result === "string" ? result : result.text;
	return (cleanText(checkedText))
}

export async function extractDoc(filePath: string) {
	const extractor = new wordExtractor();
	const ex = await extractor.extract(filePath);
	return cleanText(ex.getBody())
}

export function cleanText(rawText: string) {
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}
export async function extractUploads(uploadDir: string){
		const files = await readdir(uploadDir);
		let uploadedText = "";

		for (const file of files) {
			const extName = path.extname(file).toLowerCase();
			const filePath = path.join(uploadDir, file);

			if (extName === ".pdf") {
				uploadedText += await extractPdf(filePath);
				await unlink(filePath)
			} else if (extName === ".docx" || extName === ".doc") {
				uploadedText += await extractDoc(filePath);
				await unlink(filePath)
			}
		}

		return uploadedText;
}