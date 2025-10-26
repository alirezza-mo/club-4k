import { NextResponse } from 'next/server';

// نگهداری کانکشن‌های فعال
const clients = new Map();

export async function GET(req) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  };

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const userId = req.nextUrl.searchParams.get('userId');

  if (userId) {
    clients.set(userId, writer);
  }

  // پاکسازی کانکشن قطع شده
  req.signal.addEventListener('abort', () => {
    clients.delete(userId);
  });

  return new NextResponse(stream.readable, { headers });
}

export async function POST(req) {
  try {
    const { message, toUserId } = await req.json();

    if (toUserId === '*') {
      // ارسال به همه کاربران
      for (const writer of clients.values()) {
        writer.write(`data: ${JSON.stringify(message)}\n\n`);
      }
    } else if (clients.has(toUserId)) {
      // ارسال به کاربر خاص
      const writer = clients.get(toUserId);
      writer.write(`data: ${JSON.stringify(message)}\n\n`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}