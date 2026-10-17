import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.ico': 'image/x-icon'
};

// ============================================================================
// LOBBY COOPERATIVO ONLINE (ATÉ 3 JOGADORES) - ARQUITETURA EM MEMÓRIA
// ============================================================================

export const rooms = new Map();

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

export function sanitizeRoom(room) {
  return {
    id: room.id,
    status: room.status,
    stageIndex: room.stageIndex,
    bossId: room.bossId,
    bossHp: room.bossHp,
    bossMaxHp: room.bossMaxHp,
    bossPhase: room.bossPhase,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      charId: p.charId,
      slot: p.slot,
      isHost: p.isHost,
      isReady: p.isReady,
      x: p.x,
      y: p.y,
      state: p.state,
      facingRight: p.facingRight,
      lives: p.lives
    }))
  };
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

// Limpeza de salas inativas (> 30 minutos)
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.lastActivity > 30 * 60 * 1000) {
      rooms.delete(code);
    }
  }
}, 5 * 60 * 1000);

export async function handleApiRequest(req, res, pathname) {
  const method = req.method.toUpperCase();
  const parts = pathname.split('/').filter(Boolean); // ['api', 'rooms', ...]

  if (parts[1] === 'rooms') {
    // 1. POST /api/rooms/create
    if (parts.length === 3 && parts[2] === 'create' && method === 'POST') {
      const { playerName = 'Jogador 1', charId = 'di5' } = await parseJsonBody(req);
      const roomId = generateRoomCode();
      const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
      const room = {
        id: roomId,
        status: 'lobby',
        createdAt: Date.now(),
        lastActivity: Date.now(),
        stageIndex: 0,
        bossId: 'sindico',
        bossHp: 1000,
        bossMaxHp: 1000,
        bossPhase: 'FASE 1',
        processedAttackIds: new Set(),
        players: [
          {
            id: playerId,
            name: playerName.slice(0, 16),
            charId,
            slot: 0,
            isHost: true,
            isReady: true,
            x: 100,
            y: 384,
            state: 'idle',
            facingRight: true,
            lives: 3,
            lastSeen: Date.now()
          }
        ]
      };
      rooms.set(roomId, room);
      return sendJson(res, 200, { success: true, roomId, playerId, slot: 0, room: sanitizeRoom(room) });
    }

    // 2. POST /api/rooms/join
    if (parts.length === 3 && parts[2] === 'join' && method === 'POST') {
      const { roomId, playerName = 'Jogador', charId = 'wendel' } = await parseJsonBody(req);
      const code = (roomId || '').toUpperCase().trim();
      const room = rooms.get(code);

      if (!room) {
        return sendJson(res, 404, { success: false, error: 'Código de sala inválido ou sala não encontrada.' });
      }
      if (room.status !== 'lobby') {
        return sendJson(res, 400, { success: false, error: 'A partida já foi iniciada nesta sala.' });
      }
      // Limite estrito de 3 jogadores por sala
      if (room.players.length >= 3) {
        return sendJson(res, 400, { success: false, error: 'Sala cheia (limite máximo de 3 jogadores atingido).' });
      }

      const playerId = 'p_' + Math.random().toString(36).substring(2, 9);
      const slot = room.players.length;
      const newPlayer = {
        id: playerId,
        name: playerName.slice(0, 16),
        charId,
        slot,
        isHost: false,
        isReady: false,
        x: 80 + slot * 40,
        y: 384,
        state: 'idle',
        facingRight: true,
        lives: 3,
        lastSeen: Date.now()
      };
      room.players.push(newPlayer);
      room.lastActivity = Date.now();
      return sendJson(res, 200, { success: true, roomId: code, playerId, slot, room: sanitizeRoom(room) });
    }

    // Rotas específicas de sala: /api/rooms/:roomId/...
    if (parts.length >= 3) {
      const roomId = parts[2].toUpperCase();
      const room = rooms.get(roomId);

      if (!room) {
        return sendJson(res, 404, { success: false, error: 'Sala não encontrada.' });
      }

      // 3. GET /api/rooms/:roomId/status
      if (parts.length === 4 && parts[3] === 'status' && method === 'GET') {
        return sendJson(res, 200, { success: true, room: sanitizeRoom(room) });
      }

      // 4. POST /api/rooms/:roomId/update
      if (parts.length === 4 && parts[3] === 'update' && method === 'POST') {
        const data = await parseJsonBody(req);
        const player = room.players.find(p => p.id === data.playerId);
        if (player) {
          if (data.charId) player.charId = data.charId;
          if (typeof data.isReady === 'boolean') player.isReady = data.isReady;
          if (typeof data.x === 'number') player.x = data.x;
          if (typeof data.y === 'number') player.y = data.y;
          if (data.state) player.state = data.state;
          if (typeof data.facingRight === 'boolean') player.facingRight = data.facingRight;
          if (typeof data.lives === 'number') player.lives = data.lives;
          player.lastSeen = Date.now();
        }
        room.lastActivity = Date.now();
        return sendJson(res, 200, { success: true, room: sanitizeRoom(room) });
      }

      // 5. POST /api/rooms/:roomId/start
      if (parts.length === 4 && parts[3] === 'start' && method === 'POST') {
        const { playerId } = await parseJsonBody(req);
        const host = room.players.find(p => p.id === playerId && p.isHost);
        if (!host) {
          return sendJson(res, 403, { success: false, error: 'Apenas o anfitrião da sala pode iniciar a batalha.' });
        }
        const notReady = room.players.find(p => !p.isReady);
        if (notReady) {
          return sendJson(res, 400, { success: false, error: 'Aguarde todos os participantes confirmarem que estão prontos.' });
        }
        room.status = 'in_game';
        room.lastActivity = Date.now();
        return sendJson(res, 200, { success: true, room: sanitizeRoom(room) });
      }

      // 6. POST /api/rooms/:roomId/boss_damage
      if (parts.length === 4 && parts[3] === 'boss_damage' && method === 'POST') {
        const { attackId, damage } = await parseJsonBody(req);
        if (attackId && !room.processedAttackIds.has(attackId)) {
          room.processedAttackIds.add(attackId);
          room.bossHp = Math.max(0, room.bossHp - (damage || 10));
          if (room.bossHp <= 0) {
            room.status = 'victory';
          }
        }
        room.lastActivity = Date.now();
        return sendJson(res, 200, { success: true, bossHp: room.bossHp, status: room.status });
      }

      // 7. POST /api/rooms/:roomId/leave
      if (parts.length === 4 && parts[3] === 'leave' && method === 'POST') {
        const { playerId } = await parseJsonBody(req);
        room.players = room.players.filter(p => p.id !== playerId);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          if (!room.players.some(p => p.isHost)) {
            room.players[0].isHost = true;
          }
        }
        return sendJson(res, 200, { success: true });
      }
    }
  }

  return sendJson(res, 404, { success: false, error: 'Rota de API não encontrada.' });
}

// ============================================================================
// SERVIDOR PRINCIPAL
// ============================================================================

export const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Intercepta rotas de API
  if (reqPath.startsWith('/api/')) {
    return handleApiRequest(req, res, reqPath);
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.normalize(path.join(__dirname, reqPath));

  // Proteção contra path traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[A Grande Família - Modo Chefão] Servidor ativo em: http://localhost:${PORT}`);
  });
}
