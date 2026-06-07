import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const messages = await db.all(`SELECT * FROM contact_messages ORDER BY created_at DESC`);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const db = await getDb();
    await db.run(`UPDATE contact_messages SET status = ? WHERE id = ?`, [status, id]);
    
    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Update message status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const db = await getDb();
    await db.run(`DELETE FROM contact_messages WHERE id = ?`, [id]);
    
    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
