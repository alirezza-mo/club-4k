// server/socketServer.js
// CommonJS style (require) چون پروژه‌ی اصلیت همین سبک رو داشت.
// - Express برای health check endpoint اضافه شد
// - CORS با تابع معتبرساز
// - Logging کمتر در production
// - connection_error listener
// - graceful shutdown
// - نگهداری usersMap برای ارسال پیام به همه socketهای یک userId

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || process.env.SOCKET_PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

// مقدار ALLOWED_ORIGINS از env می‌آید (مثال: "https://app.vercel.app,http://localhost:3000")
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:3000'];

const app = express();

// یک endpoint ساده برای health-check
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// در صورت نیاز می‌توان payload logs یا صفحه ساده برگشت داد
app.get('/', (req, res) => {
  res.send('Socket server is running');
});

const server = http.createServer(app);

const io = new Server(server, {
  // CORS: از تابع استفاده می‌کنیم تا flexible و امن باشد
  cors: {
    origin: (origin, callback) => {
      // اگر origin وجود نداشته باشد (مثلاً ابزارهای داخلی) اجازه بده
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      const msg = `Origin ${origin} not allowed by CORS`;
      return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT || 60000),
  pingInterval: Number(process.env.SOCKET_PING_INTERVAL || 25000),
});

// map userId -> Set(socketId)
const usersMap = new Map();

io.on('connection', (socket) => {
  if (!isProd) console.log('Socket connected:', socket.id);

  // register user sockets
  socket.on('register', (userId) => {
    try {
      if (!userId) return;
      const set = usersMap.get(userId) || new Set();
      set.add(socket.id);
      usersMap.set(userId, set);
      if (!isProd) console.log(`Registered user ${userId} -> socket ${socket.id}`);
    } catch (err) {
      console.error('register handler error', err);
    }
  });

  // notify payload: { toUserId, type, data }
  socket.on('notify', (payload) => {
    try {
      const { toUserId, type, data } = payload || {};
      if (!toUserId) return;

      if (toUserId === '*') {
        // broadcast to everyone
        io.emit('notification', { type, data });
        if (!isProd) console.log('Broadcast notification', { type });
      } else {
        const targets = usersMap.get(toUserId);
        if (targets) {
          for (const sid of targets) {
            io.to(sid).emit('notification', { type, data });
          }
          if (!isProd) console.log(`Sent notification to user ${toUserId} on ${targets.size} sockets`);
        } else {
          if (!isProd) console.log(`No active sockets for user ${toUserId}`);
        }
      }
    } catch (err) {
      console.error('notify handler error', err);
    }
  });

  // optional: handle custom messages
  socket.on('message', (payload) => {
    if (!isProd) console.log('message from', socket.id, payload);
  });

  // disconnect: unregister socket id
  socket.on('disconnect', (reason) => {
    try {
      // remove socket id from any user set that contains it
      for (const [userId, set] of usersMap.entries()) {
        if (set.has(socket.id)) {
          set.delete(socket.id);
          if (set.size === 0) usersMap.delete(userId);
          else usersMap.set(userId, set);
          if (!isProd) console.log(`Unregistered socket ${socket.id} from user ${userId} (reason: ${reason})`);
          break; // socket id belongs to only one userId -> می‌تونیم break کنیم
        }
      }
    } catch (err) {
      console.error('disconnect handler error', err);
    }
  });
});

// connection error listener (محافظت در برابر خطاهای اتصال)
io.engine.on('connection_error', (err) => {
  console.error('Socket connection error:', err.message);
});

// graceful shutdown (برای Render و هر سرویس دیگر مفید است)
const shutdown = (sig) => {
  console.log(`⚠️ Received ${sig}. Shutting down gracefully...`);
  try {
    io.close(() => {
      console.log('Socket.io closed.');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    });

    // force exit after timeout
    setTimeout(() => {
      console.warn('Forcing shutdown.');
      process.exit(1);
    }, 5000);
  } catch (err) {
    console.error('Error during shutdown', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT} (env: ${NODE_ENV})`);
});

/**
 * NOTE:
 * If you later want to scale horizontally (multiple instances),
 * use @socket.io/redis-adapter and a Redis instance.
 *
 * Example (commented):
 *
 * const { createAdapter } = require('@socket.io/redis-adapter');
 * const { createClient } = require('redis'); // or ioredis
 * (async () => {
 *   const pubClient = createClient({ url: process.env.REDIS_URL });
 *   const subClient = pubClient.duplicate();
 *   await pubClient.connect();
 *   await subClient.connect();
 *   io.adapter(createAdapter(pubClient, subClient));
 * })();
 *
 */
