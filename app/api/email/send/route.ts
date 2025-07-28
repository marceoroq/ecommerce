import { Resend } from "resend";

import { EmailTemplate } from "@/components/shared/email/email-template";
import { SENDER_EMAIL } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: `Acme <${SENDER_EMAIL}>`,
      to: [""], // Add here the email address where you want to send
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
