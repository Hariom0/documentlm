import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  cookieName: "myapp_session",
  password: process.env.SESSION_SECRET!,
};

