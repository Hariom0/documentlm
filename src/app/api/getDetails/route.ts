import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs, { readdir } from "fs";
import { extractDoc, extractPdf } from "@/utils/helper";
import { GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = "/path/to/pdf.worker.min.js";
export const config = {
	api: {
		bodyParser: false,
	},
};

export async function extractUploads(uploadDir: string) {
	try {
		const files: any = await fs.readdir(uploadDir, () => {});
		let uploadedText = "";

		for (const file of files) {
			const extName = path.extname(file).toLowerCase();
			const filePath = path.join(uploadDir, file);

			if (extName === ".pdf") {
				uploadedText += await extractPdf(filePath);
			} else if (extName === ".docx" || extName === ".doc") {
				uploadedText += await extractDoc(filePath);
			}
		}

		console.log("All extracted text:", uploadedText);
		return uploadedText;
	} catch (error: any) {
		console.error("Error extracting text:", error);
		return {
			error: "Error while extracting text",
			details: error.message,
		};
	}
}
export async function POST(req: NextRequest) {
	try {
		// Extract form data
		const formData = await req.formData();
		const files = formData.getAll("files") as File[];

		if (!files || files.length === 0) {
			return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
		}

		// Upload directory inside /public
		const uploadDir = path.join(process.cwd(), "public", "uploads");
		await mkdir(uploadDir, { recursive: true });

		// Save each file
		const uploadedFiles: string[] = [];

		for (const file of files) {
			const buffer = Buffer.from(await file.arrayBuffer());
			const uniqueName = `${Date.now()}-${file.name}`;
			const filePath = path.join(uploadDir, uniqueName);
			await writeFile(filePath, buffer);

			const fileUrl = `/uploads/${uniqueName}`;
			uploadedFiles.push(fileUrl);
		}

		// Extract file path from upload dir
		let uploadedText = await extractPdf(uploadDir);
		return NextResponse.json(
			{
				msg: "Files uploaded successfully",
				uploadedText,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Error uploading files", details: error.message }, { status: 500 });
	}
}
