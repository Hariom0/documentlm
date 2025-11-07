import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs, { readdir } from "fs";
import { extractDoc, extractPdf } from "@/utils/helper";
export const config = {
	api: {
		bodyParser: false,
	},
};

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
		let uploadedText: any;
		// Extract text from all files
		try {
			fs.readdir(uploadDir, (err, files) => {
				if (err) return console.log(err);
				if (files) {
					files.map((file: string) => {
						let extName = path.extname(file);
						if (extName == ".pdf") {
							uploadedText = extractPdf(file);
						} else if (extName == ".docx" || ".doc") {
							uploadedText = extractDoc(file);
						}
					});
				}
			});
		} catch (error) {
			console.log("Error Extracing text : ", error);
			return NextResponse.json({ error: "Error while extracing text", details: error }, { status: 500 });
		}

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
