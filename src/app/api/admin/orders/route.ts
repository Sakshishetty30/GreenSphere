import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    
    // Fetch all orders with items
    const ordersData = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    
    const ordersWithItems = await Promise.all(ordersData.map(async (order: any) => {
      const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      const payment = await db.get('SELECT * FROM payments WHERE order_id = ?', [order.id]);
      
      let address = {};
      try {
        address = JSON.parse(order.shipping_address);
      } catch (e) {}

      return {
        id: order.id,
        date: order.created_at,
        total: order.total_amount,
        status: order.status,
        address: address,
        items: items,
        payment: payment
      };
    }));

    return NextResponse.json(ordersWithItems);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and Status are required' }, { status: 400 });
    }

    const db = await getDb();
    
    // Update order status
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    // If refunding/cancelling, update payment status too (for demo purposes)
    if (status === 'Cancelled' || status === 'Refunded') {
       await db.run('UPDATE payments SET status = ? WHERE order_id = ?', ['Refunded', orderId]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
