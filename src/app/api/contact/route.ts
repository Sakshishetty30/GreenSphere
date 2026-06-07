import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail } from "@/lib/smtp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Backend Validation
    if (!name || name.length < 3) {
      return NextResponse.json({ error: "Name must be at least 3 characters" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Message must contain at least 10 characters" }, { status: 400 });
    }

    // Insert into DB
    const db = await getDb();
    await db.run(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );

    // Send Admin Email
    const adminEmailHtml = `
      <h2>New Contact Inquiry - ${subject}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #ccc;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `;
    
    try {
      await sendEmail("support@greensphere.com", `New Contact Inquiry - ${subject}`, adminEmailHtml);
    } catch (e) {
      console.error("Failed to send admin email:", e);
      // We do not fail the request if the admin email fails, but it's noted in logs
    }

    // Send User Auto-Reply
    const userEmailHtml = `
      <h2>Thank You for Contacting GreenSphere 🌱</h2>
      <p>Hello ${name},</p>
      <p>Thank you for contacting GreenSphere.</p>
      <p>We have received your message and our support team will get back to you shortly.</p>
      <p><strong>Your Inquiry:</strong> ${subject}</p>
      <br>
      <p>Best Regards,</p>
      <p>GreenSphere Support Team</p>
    `;
    
    try {
      await sendEmail(email, "Thank You for Contacting GreenSphere 🌱", userEmailHtml);
    } catch (e) {
      console.error("Failed to send user auto-reply:", e);
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
