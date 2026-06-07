import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const db = await getDb();
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    const payment = await db.get('SELECT * FROM payments WHERE order_id = ?', [orderId]);

    const doc = new (jsPDF as any)();

    // Invoice Header
    doc.setFontSize(22);
    doc.setTextColor(46, 125, 50); // GreenSphere Green
    doc.text('GreenSphere Invoice', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-GB')}`, 14, 35);
    doc.text(`Payment Status: ${payment?.status || 'Pending'}`, 14, 40);

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Billed To:', 14, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    let startY = 62;
    try {
      const address = JSON.parse(order.shipping_address);
      doc.text(`${address.fullName || 'Customer'}`, 14, startY);
      doc.text(`${address.email || ''}`, 14, startY + 5);
      doc.text(`${address.address || ''}, ${address.city || ''}`, 14, startY + 10);
      doc.text(`${address.state || ''} - ${address.zipCode || ''}`, 14, startY + 15);
      startY += 25;
    } catch (e) {
      doc.text('Customer Details Unavailable', 14, startY);
      startY += 15;
    }

    // Items Table
    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = items.map((item: any) => [
      item.product_name,
      item.quantity,
      `Rs. ${item.price.toLocaleString('en-IN')}`,
      `Rs. ${(item.quantity * item.price).toLocaleString('en-IN')}`
    ]);

    (doc as any).autoTable({
      startY: startY,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || startY + 20;

    // Totals
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Amount: Rs. ${order.total_amount.toLocaleString('en-IN')}`, 140, finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for shopping with GreenSphere!', 14, finalY + 30);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Invoice-${orderId}.pdf`,
      },
    });

  } catch (error: any) {
    console.error("Invoice Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
