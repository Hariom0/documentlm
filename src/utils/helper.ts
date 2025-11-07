import cohere from "@/config/cohereConfig";
import { PDFParse } from "pdf-parse";
import wordExtractor from "word-extractor";

type McqItem = {
	question: string;
	options: string[];
	correctAnswer: string;
	reference?: string;
};

export type SummaryResult = {
	summary: string;
	mcqs: McqItem[];
};

// export async function getSummary(inputData: string): Promise<SummaryResult> {
//     const response = await cohere.chat({
//         messages: [
//             {
//                 role: "system",
//                 content:
//                     "You are an expert educator and exam-setter. Given some study notes, respond ONLY as valid JSON following the schema.",
//             },
//             {
//                 role: "user",
//                 content: inputData,
//             },
//         ],
//         temperature: 0.3,
//         model: "command-r-plus-08-2024",
//         responseFormat: {
//             type: "json_object",
//             jsonSchema: {
//                 type: "object",
//                 properties: {
//                     summary: { type: "string" },
//                     mcqs: {
//                         type: "array",
//                         items: {
//                             type: "object",
//                             properties: {
//                                 question: { type: "string" },
//                                 options: { type: "array", items: { type: "string" } },
//                                 correctAnswer: { type: "string" },
//                                 reference: { type: "string" },
//                             },
//                             required: ["question", "options", "correctAnswer"],
//                         },
//                     },
//                 },
//                 required: ["summary", "mcqs"],
//             },
//         },
//     });

//     // With json_object response, cohere returns JSON string in message content
//     const content = response?.message?.content?.[0]?.text ?? "";
//     let parsed: SummaryResult;
//     try {
//         parsed = JSON.parse(content);
//     } catch {
//         // Fallback minimal shape
//         parsed = { summary: content || "", mcqs: [] };
//     }
//     return parsed;
// }

export async function extractPdf(filePath: string) {
	const parser = new PDFParse({ url: filePath });
	const result = await parser.getText();
	return cleanText(String(result))
}

export async function extractDoc(filePath: string) {
	const extractor = new wordExtractor();
	const ex = await extractor.extract(filePath);
	return cleanText(String(ex.getBody()))

}

export function cleanText(rawText: string) {
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}
