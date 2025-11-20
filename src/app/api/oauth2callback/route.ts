import { NextRequest, NextResponse } from "next/server";
import { oauth2Client } from "@/config/oauthConfig";
import { google } from "googleapis";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/config/ironSession";
import { cookies } from "next/headers";
import { convertToGoogleFormRequests, readInputJson } from "@/utils/helper";


export async function GET(req: NextRequest) {
	try {
		// Iron session data
		const inputData: any = await readInputJson();

		if (!inputData || !inputData.data) {
			const origin = req.headers.get('origin') || req.nextUrl.origin;
			return NextResponse.redirect(`${origin}/dashboard?error=${encodeURIComponent("No form data found. Please try generating the form again.")}`);
		}

		const formData = inputData.data;
		
		// Form auth data
		const searchParams = req.nextUrl.searchParams;
		const code = searchParams.get("code");
		if (!code) {
			const origin = req.headers.get('origin') || req.nextUrl.origin;
			return NextResponse.redirect(`${origin}/dashboard?error=${encodeURIComponent("Missing authorization code. Please try again.")}`);
		}

		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		// Google Form
		const forms = google.forms({ version: "v1", auth: oauth2Client });

		const json: any = convertToGoogleFormRequests(formData);

		const createResp: any = await forms.forms.create({
			requestBody: {
				info: {
					title: json.title || "Untitled",
					documentTitle: json.documentTitle || json.title || "Form",
				},
			},
		});

		if (!createResp.data || !createResp.data.formId) {
			throw new Error("Failed to create Google Form");
		}

		const formId = createResp.data.formId;

		await forms.forms.batchUpdate({
			formId: formId,
			requestBody: {
				requests: json.requests,
			},
		});

		const formUrl = `https://docs.google.com/forms/d/${formId}/edit`;
		
		// Redirect back to dashboard with form info in query params
		const origin = req.headers.get('origin') || req.nextUrl.origin;
		const dashboardUrl = `${origin}/dashboard?formId=${formId}&formUrl=${encodeURIComponent(formUrl)}&success=true`;
		
		return NextResponse.redirect(dashboardUrl);
	} catch (error: any) {
		console.error("OAuth callback error:", error);
		const origin = req.headers.get('origin') || req.nextUrl.origin;
		const errorMessage = error.message || "An error occurred while creating the form. Please try again.";
		return NextResponse.redirect(`${origin}/dashboard?error=${encodeURIComponent(errorMessage)}`);
	}
}
