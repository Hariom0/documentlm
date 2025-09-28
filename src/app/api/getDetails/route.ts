import cohere from "@/config/cohereConfig";
import { NextRequest, NextResponse } from "next/server";

async function getSummary(inputData: string) {
	try {
		const response = await cohere.chat({
			messages: [
				{
					role: "system",
					content: `You are an expert educator and exam-setter.
                                Given some study notes, you will:
                                1. Produce a clear, exam-focused summary of the notes (short but comprehensive).
                                2. Create precise, student-ready MCQs directly from the notes (including numericals if present).
                                3. Provide the correct answer for each MCQ.DD
    
                                Respond ONLY as valid JSON following the given schema.`,
				},
				{
					role: "user",
					content: inputData,
				},
			],
			temperature: 0.3,
			model: "command-r-plus-08-2024",
			responseFormat: {
				type: "json_object",
				jsonSchema: {
					type: "object",
					properties: {
						summary: {
							type: "string",
							description: "A concise, exam-focused summary of the input notes.",
						},
						mcqs: {
							type: "array",
							description: "List of MCQs generated from the notes.",
							items: {
								type: "object",
								properties: {
									question: {
										type: "string",
										description: "The MCQ question text derived from the notes.",
									},
									options: {
										type: "array",
										items: {
											type: "string",
										},
										description: "Multiple choice options for the question.",
									},
									correctAnswer: {
										type: "string",
										description: "The correct answer text exactly matching one of the options.",
									},
									reference: {
										type: "string",
										description: "Optional: direct reference or section of notes where this question is derived from.",
									},
								},
								required: ["question", "options", "correctAnswer"],
							},
						},
					},
					required: ["summary", "mcqs"],
				},
			},
		});
		return JSON.stringify(response);
	} catch (error) {
		console.log(error);
		return NextResponse.json("Something went Wrong", { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	let inputData = await req.formData();
	let data = inputData.get("text")?.toString();

	if (data) {
		let outputJson = await getSummary(data);
		let response = NextResponse.json(outputJson, { status: 200 });

		return response;
	}
}
