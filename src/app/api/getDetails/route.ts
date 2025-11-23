import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "fs/promises";
import path from "path";
import { extractUploads, getSummary } from "@/utils/helper";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req: NextRequest) {
	try {
		// Handle File Upload

		const formData = await req.formData();
		const files = formData.getAll("files") as File[];
		const inputText = formData.get("text")

		if ((!files || files.length === 0 ) && !inputText) {
			return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
		}

		let uploadDir;
		let uploadedText;

		if(files){
			uploadDir = path.join(process.cwd(), "public", "uploads");
			await mkdir(uploadDir, { recursive: true });
	
			for (const file of files) {
				const buffer = Buffer.from(await file.arrayBuffer());
				const uniqueName = `${Date.now()}-${file.name}`;
				const filePath = path.join(uploadDir, uniqueName);
				await writeFile(filePath, buffer);
			}
			uploadedText = await extractUploads(uploadDir);
		}

		// Extract File content
		uploadedText! += inputText;

		// Get Summary Json 
		const outputJson = await getSummary(uploadedText!) 
		
		return NextResponse.json(
			{
				msg: "Files uploaded and text extracted successfully",
				outputJson,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("File error:", error);
		return NextResponse.json({ error: "Error while handling files", details: error.message }, { status: 500 });
	}
}
