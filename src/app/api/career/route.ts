import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface ResumeRequest {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  experience?: string;
  resume: File;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const data: ResumeRequest = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      telephone: formData.get("telephone")?.toString() || "",
      experience: formData.get("experienceLevel")?.toString() || undefined,
      resume: formData.get("resume") as File,
    };

    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.telephone ||
      !data.resume
    ) {
      return NextResponse.json(
        { message: "All fields are required.", success: false },
        { status: 400 },
      );
    }

    const toEmail = process.env.NEXT_PUBLIC_EMAIL_TO;
    const fromEmail = process.env.NEXT_PUBLIC_EMAIL_FROM;
    const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;

    if (!toEmail || !fromEmail || !apiKey) {
      return NextResponse.json(
        {
          message: "BREVO_API_KEY, CV_EMAIL_TO or EMAIL_FROM environment variables are missing.",
          success: false,
        },
        { status: 500 },
      );
    }

    const MAX_FILE_SIZE = 4 * 1024 * 1024;

    if (data.resume.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size must be less than 5MB.", success: false },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await data.resume.arrayBuffer());

    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: fromEmail, name: "HR - Website Careers" },
        to: [{ email: toEmail }],
        replyTo: { email: data.email },
        subject: `New Resume from ${data.firstName} ${data.lastName}`,
        htmlContent: `
          <h2>New Job Application</h2>
          <p><strong>First Name:</strong> ${data.firstName}</p>
          <p><strong>Last Name:</strong> ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telephone:</strong> ${data.telephone}</p>
          ${
            data.experience
              ? `<p><strong>Experience:</strong> ${data.experience}</p>`
              : ""
          }
        `,
        attachment: [
          {
            name: data.resume.name,
            content: buffer.toString("base64"),
          },
        ],
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
      },
    );

    return NextResponse.json(
      {
        message: "Resume sent successfully!",
        success: true,
        response: res.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Brevo Error:", error);
    return NextResponse.json(
      { message: "Failed to send resume.", success: false },
      { status: 500 },
    );
  }
}
