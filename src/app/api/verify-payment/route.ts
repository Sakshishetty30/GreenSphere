import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import { sendOrderConfirmation } from '@/lib/smtp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderData, 
      mockMode 
    } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

    // Verify Signature if not in mock mode
    if (!mockMode) {
      const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: 'Payment verification failed: Invalid signature' }, { status: 400 });
      }
    }

    const db = await getDb();
    
    // Save Order to DB
    const orderId = razorpay_order_id || ("ORD_" + Date.now().toString());
    const totalAmount = orderData.totalCost;
    const addressStr = JSON.stringify(orderData.address);
    // orderData.user is optional, fallback to 1 or null if guest
    const userId = orderData.user?.id || 1; 

    await db.run(
      `INSERT INTO orders (id, user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?, ?)`,
      [orderId, userId, totalAmount, 'Processing', addressStr]
    );

    // Save Order Items
    if (orderData.cart && orderData.cart.length > 0) {
      for (const item of orderData.cart) {
        await db.run(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
          [orderId, item.product.id, item.product.name, item.quantity, item.product.price]
        );
      }
    }

    // Save Payment Details
    const paymentResult = await db.run(
      `INSERT INTO payments (order_id, method, amount, status) VALUES (?, ?, ?, ?)`,
      [orderId, orderData.paymentMethod || 'Razorpay', totalAmount, 'Success']
    );

    // Save Transaction Details
    await db.run(
      `INSERT INTO transactions (payment_id, razorpay_payment_id, razorpay_order_id, signature) VALUES (?, ?, ?, ?)`,
      [paymentResult.lastID, razorpay_payment_id || 'mock_pay_id', razorpay_order_id || 'mock_ord_id', razorpay_signature || 'mock_sig']
    );

    // Trigger Invoice & Email asynchronously (don't await strictly to prevent timeout if it takes long)
    // For this implementation, we'll await them to ensure they complete
    try {
      const invoiceUrl = `/api/generate-invoice?orderId=${orderId}`;
      if (orderData.address?.email) {
         await sendOrderConfirmation(orderData.address.email, orderId, totalAmount, orderData.cart);
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email", emailErr);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
