import { NextRequest, NextResponse } from "next/server";
import { oauth2Client, SCOPES } from "@/config/oauthConfig";
import { cookies } from "next/headers";
import { getIronSession } from 'iron-session';
import { sessionOptions } from "@/config/ironSession";
import { saveInputJson } from "@/utils/helper";


export async function POST(req: NextRequest) {
	const inputJson = await req.json();

  const result = await saveInputJson(inputJson);

	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
		prompt: "consent",
	});
	return NextResponse.json({url});
}
