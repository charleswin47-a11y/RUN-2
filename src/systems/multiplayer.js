/**
 * A Grande Família Game - Modo Chefão
 * Sistema de Lobby Online e Sincronização Co-Op (Até 3 Jogadores)
 */

export class MultiplayerSystem {
  constructor() {
    this.roomId = null;
    this.playerId = null;
    this.slot = 0;
    this.isHost = false;
    this.isReady = false;
    this.room = null;
    this.pollInterval = null;
    this.inBattle = false;
    this.onRoomUpdate = null;
    this.onMatchStart = null;
    this.onBossDamage = null;
    this.reportedAttacks = new Set();
  }

  get isConnected() {
    return !!this.roomId && !!this.playerId;
  }

  async createRoom(playerName, charId) {
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, charId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro ao criar sala');

      this.roomId = data.roomId;
      this.playerId = data.playerId;
      this.slot = data.slot;
      this.isHost = true;
      this.isReady = true;
      this.room = data.room;

      this.startPolling(400);
      return data;
    } catch (err) {
      console.error('[Multiplayer] Falha ao criar sala:', err);
      throw err;
    }
  }

  async joinRoom(roomId, playerName, charId) {
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerName, charId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erro ao entrar na sala');

      this.roomId = data.roomId;
      this.playerId = data.playerId;
      this.slot = data.slot;
      this.isHost = false;
      this.isReady = false;
      this.room = data.room;

      this.startPolling(400);
      return data;
    } catch (err) {
      console.error('[Multiplayer] Falha ao entrar na sala:', err);
      throw err;
    }
  }

  startPolling(intervalMs = 400) {
    this.stopPolling();
    this.pollInterval = setInterval(async () => {
      if (!this.roomId) return;
      try {
        const res = await fetch(`/api/rooms/${this.roomId}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.room) {
          const prevStatus = this.room?.status;
          this.room = data.room;

          if (this.onRoomUpdate) {
            this.onRoomUpdate(this.room);
          }

          // Se a partida acabou de iniciar
          if (prevStatus === 'lobby' && data.room.status === 'in_game') {
            this.inBattle = true;
            if (this.onMatchStart) {
              this.onMatchStart(this.room);
            }
          }
        }
      } catch (err) {
        console.warn('[Multiplayer] Erro ao sincronizar status da sala:', err);
      }
    }, intervalMs);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async setReady(isReady) {
    this.isReady = isReady;
    return this.sendUpdate({ isReady });
  }

  async setCharacter(charId) {
    return this.sendUpdate({ charId });
  }

  async sendUpdate(data) {
    if (!this.roomId || !this.playerId) return;
    try {
      const res = await fetch(`/api/rooms/${this.roomId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: this.playerId, ...data })
      });
      const resData = await res.json();
      if (resData.success && resData.room) {
        this.room = resData.room;
        if (this.onRoomUpdate) this.onRoomUpdate(this.room);
      }
    } catch (err) {
      console.warn('[Multiplayer] Erro ao enviar atualização:', err);
    }
  }

  async startMatch() {
    if (!this.roomId || !this.playerId || !this.isHost) return;
    try {
      const res = await fetch(`/api/rooms/${this.roomId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: this.playerId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      this.room = data.room;
      this.inBattle = true;
      if (this.onMatchStart) this.onMatchStart(this.room);
    } catch (err) {
      console.error('[Multiplayer] Falha ao iniciar partida:', err);
      throw err;
    }
  }

  async reportBossDamage(damage, attackId) {
    if (!this.roomId || !this.playerId) return;
    const aId = attackId || `atk_${this.playerId}_${Date.now()}`;
    if (this.reportedAttacks.has(aId)) return;
    this.reportedAttacks.add(aId);

    try {
      const res = await fetch(`/api/rooms/${this.roomId}/boss_damage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: this.playerId, damage, attackId: aId })
      });
      const data = await res.json();
      if (data.success && typeof data.bossHp === 'number') {
        if (this.onBossDamage) this.onBossDamage(data.bossHp, data.status);
      }
    } catch (err) {
      console.warn('[Multiplayer] Erro ao sincronizar dano no chefão:', err);
    }
  }

  getTeammates() {
    if (!this.room || !this.room.players) return [];
    return this.room.players
      .filter(p => p.id !== this.playerId)
      .map(p => ({
        id: p.id,
        name: p.name,
        charId: p.charId,
        x: p.x || 100,
        y: p.y || 384,
        state: p.state || 'idle',
        facingRight: p.facingRight !== false,
        lives: p.lives || 3,
        width: 44,
        height: 76,
        isInvulnerable: false
      }));
  }

  async leave() {
    if (!this.roomId || !this.playerId) return;
    try {
      await fetch(`/api/rooms/${this.roomId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: this.playerId })
      });
    } catch (e) {
      // ignore
    } finally {
      this.stopPolling();
      this.roomId = null;
      this.playerId = null;
      this.isHost = false;
      this.isReady = false;
      this.room = null;
      this.inBattle = false;
    }
  }
}
