const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || process.env.SOCKET_PORT || 4001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ['http://localhost:3000', 'https://your-vercel-app.vercel.app'];

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// map of userId => set of socketIds
const usersMap = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('register', (userId) => {
    if (!userId) return;
    const set = usersMap.get(userId) || new Set();
    set.add(socket.id);
    usersMap.set(userId, set);
    console.log(`Registered user ${userId} -> socket ${socket.id}`);
  });

  // backend (or any client) can emit a notify event: { toUserId, type, data }
  socket.on('notify', (payload) => {
    try {
      const { toUserId, type, data } = payload || {};
      if (!toUserId) return;
      
      if (toUserId === '*') {
        // Broadcast to all connected sockets
        io.emit('notification', { type, data });
      } else {
        // Send to specific user's sockets
        const targets = usersMap.get(toUserId);
        if (targets) {
          for (const sid of targets) {
            io.to(sid).emit('notification', { type, data });
          }
        }
      }
    } catch (err) {
      console.error('notify handler error', err);
    }
  });

  socket.on('disconnect', () => {
    // remove socket id from all user sets
    for (const [userId, set] of usersMap.entries()) {
      if (set.has(socket.id)) {
        set.delete(socket.id);
        if (set.size === 0) usersMap.delete(userId);
        else usersMap.set(userId, set);
        console.log(`Unregistered socket ${socket.id} from user ${userId}`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});
