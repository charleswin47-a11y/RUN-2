import { CANVAS_CONFIG, GAME_RULES, BOSSES_CONFIG, BOSS_CONFIG, CHARACTERS_CONFIG, CAMPAIGN_STAGES } from './config.js';
import { HUD } from './ui/hud.js';
import { ScoringSystem } from './systems/scoring.js';
import { InputSystem } from './systems/input.js';
import { RetroAudioSystem } from './systems/audio.js';
import { SpriteRenderer } from './graphics/spriteRenderer.js';
import { PlayerEntity } from './entities/player.js';
import { BossEntity } from './entities/boss.js';
import { CombatSystem } from './systems/combat.js';

export class GameEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;

    // Sistemas
    this.hud = new HUD();
    this.scoring = new ScoringSystem();
    this.input = new InputSystem();
    this.audio = new RetroAudioSystem();
    this.renderer = new SpriteRenderer();
    this.combat = new CombatSystem();

    // Campanha e Estágios
    this.currentStageIndex = 0;
    this.currentStage = CAMPAIGN_STAGES[0];

    // Entidades
    this.player = new PlayerEntity('di5');
    this.boss = new BossEntity(this.currentStage.bossId);

    this.selectedCharId = 'di5';
    this.selectedChar = CHARACTERS_CONFIG.di5;

    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;

    // Configurações de combate e acessibilidade
    this.enableScreenShake = true;
    this.showHitboxes = false;
    this.teammates = []; // Parceiros no modo Co-Op Online (até 3 jogadores)

    this.timeRemaining = GAME_RULES.BATTLE_TIME_LIMIT_SEC;
    this.animTime = 0;
    this.lastTime = 0;
    this.rafId = null;

    this.onMatchEndCallback = null;
    this._loop = this._loop.bind(this);
  }

  toggleHitboxes() {
    this.showHitboxes = !this.showHitboxes;
  }

  toggleScreenShake(enabled) {
    this.enableScreenShake = enabled !== undefined ? enabled : !this.enableScreenShake;
  }

  init(canvas, { onMatchEnd } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.onMatchEndCallback = onMatchEnd;

    this.canvas.width = CANVAS_CONFIG.WIDTH;
    this.canvas.height = CANVAS_CONFIG.HEIGHT;
    this.canvas.setAttribute('tabindex', '0');
    this.canvas.style.outline = 'none';

    this.canvas.addEventListener('click', () => {
      window.focus();
      this.canvas.focus();
    });

    // Tecla 'H' para alternar o visualizador de Hitboxes / Hurtboxes
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyH') {
        this.toggleHitboxes();
      }
    });

    // Configura renderização nítida sem blur
    this.renderer.prepareContext(this.ctx);

    // Inicializa controles e callback de pausa
    this.input.init(() => this.togglePause());

    // Permite ativar áudio no primeiro clique/toque do usuário
    const unlockAudio = () => {
      this.audio.userInteraction();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Renderiza a cena inicial da arena e combatentes no canvas
    this.render(this.ctx);
  }

  start(characterId, stageIndex = 0) {
    this.audio.userInteraction();
    this.selectedCharId = characterId || this.selectedCharId || 'di5';
    this.selectedChar = CHARACTERS_CONFIG[this.selectedCharId] || CHARACTERS_CONFIG.di5;

    // Configura o estágio da campanha (0: Síndico, 1: Bandido, 2: Chefão do Tráfico)
    this.currentStageIndex = stageIndex >= 0 && stageIndex < CAMPAIGN_STAGES.length ? stageIndex : 0;
    this.currentStage = CAMPAIGN_STAGES[this.currentStageIndex];
    const bossConfig = BOSSES_CONFIG[this.currentStage.bossId] || BOSS_CONFIG;

    // Garante que os listeners de input estejam ativos
    this.input.init(() => this.togglePause());

    // Remove foco de qualquer botão HTML e direciona para o jogo
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    window.focus();
    if (this.canvas) this.canvas.focus();

    this.timeRemaining = GAME_RULES.BATTLE_TIME_LIMIT_SEC;
    this.animTime = 0;

    // Reinicializa entidades e sistemas com o chefe atual
    this.player.reset(this.selectedCharId);
    this.boss.reset(this.currentStage.bossId);
    this.combat.reset();
    this.scoring.reset();
    this.scoring.characterId = this.selectedCharId;

    // Configura callbacks de multiplayer para sincronização do chefão
    this.combat.onDamageDealt = (damage, attackId) => {
      if (this.multiplayer && this.multiplayer.inBattle) {
        this.multiplayer.reportBossDamage(damage, attackId);
      }
    };

    if (this.multiplayer) {
      this.multiplayer.onBossDamage = (bossHp, status) => {
        this.boss.hp = bossHp;
        if (this.boss.hp <= 0 && this.isRunning) {
          this.boss.hp = 0;
          this._endBattle(true, 'BOSS_DEFEATED');
        }
      };
    }

    this.hud.setup(this.selectedChar, bossConfig);

    this.isRunning = true;
    this.isPaused = false;
    this.isGameOver = false;
    this.lastTime = performance.now();

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this._loop);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  togglePause() {
    if (this.isGameOver || !this.isRunning) return;
    if (this.isPaused) {
      this.resume();
      const menu = document.getElementById('pause-screen');
      if (menu) menu.classList.remove('active');
    } else {
      this.pause();
      const menu = document.getElementById('pause-screen');
      if (menu) menu.classList.add('active');
    }
  }

  restart() {
    this.start(this.selectedCharId);
  }

  destroy() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.input.destroy();
  }

  _loop(currentTime) {
    if (!this.isRunning) return;

    if (this.isPaused) {
      this.rafId = requestAnimationFrame(this._loop);
      return;
    }

    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Proteção contra saltos anômalos de tempo
    if (dt > GAME_RULES.MAX_DELTA_TIME_SEC) {
      dt = GAME_RULES.MAX_DELTA_TIME_SEC;
    }

    this.animTime += dt;
    this.update(dt);
    this.render(this.ctx);

    if (this.isRunning) {
      this.rafId = requestAnimationFrame(this._loop);
    }
  }

  update(dt) {
    // 1. Cronômetro da Partida em tempo real
    this.timeRemaining -= dt;
    this.scoring.updateTime(dt);

    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this._endBattle(false, 'TIME_OUT');
      return;
    }

    // Micro-pausa dramática de impacto (hitstop nos golpes fortes)
    if (this.combat.hitstopTimer > 0) {
      this.combat.hitstopTimer -= dt;
      this.combat.update(dt, this.player, this.boss, this.scoring, this.audio);
      return;
    }

    // 2. Acionamento da Habilidade Especial do Jogador
    if (this.input.isAbilityPressed() && this.player.abilityCooldown <= 0) {
      const abilityResult = this.player.triggerAbility(this.audio);
      if (abilityResult) {
        this._handleAbilityEffect(abilityResult);
      }
    }

    // 3. Atualização das Entidades
    this.player.update(dt, this.input, this.audio);
    if (this.player.pendingBasicProjectile) {
      this.combat.addProjectile(this.player.pendingBasicProjectile);
      this.player.pendingBasicProjectile = null;
    }
    this.boss.update(dt, this.player.x, this.audio);

    // 4. Sistema de Combate e Colisões
    this.combat.update(dt, this.player, this.boss, this.scoring, this.audio);

    // 5. Checagem de Condições de Vitória ou Derrota
    if (this.boss.hp <= 0) {
      this.boss.hp = 0;
      this._endBattle(true, 'BOSS_DEFEATED');
      return;
    }

    if (this.player.lives <= 0) {
      this.player.lives = 0;
      this._endBattle(false, 'PLAYER_DIED');
      return;
    }

    // 6. Atualização da HUD
    this.hud.updateTimer(this.timeRemaining);
    this.hud.updateLives(this.player.lives);
    this.hud.updateBossHP(this.boss.hp, this.boss.maxHp, this.boss.phaseConfig.NAME);
    this.hud.updateCooldown(this.player.abilityCooldown);
    this.hud.updateScore(this.scoring.score);

    // 7. Sincronização no modo Co-Op Online (a cada ~80ms)
    if (this.multiplayer && this.multiplayer.inBattle) {
      this.mpSyncTimer = (this.mpSyncTimer || 0) + dt;
      if (this.mpSyncTimer >= 0.08) {
        this.mpSyncTimer = 0;
        this.multiplayer.sendUpdate({
          x: Math.round(this.player.x),
          y: Math.round(this.player.y),
          state: this.player.state,
          facingRight: this.player.facingRight,
          lives: this.player.lives
        });
      }
      this.teammates = this.multiplayer.getTeammates();
    }
  }

  _handleAbilityEffect(effect) {
    if (effect.type === 'projectile') {
      this.combat.addProjectile(effect);
    } else if (effect.type === 'melee_sword') {
      // Douglas - golpe de espada frontal imediato
      if (this.combat._checkOverlap(effect, this.boss.getHitbox())) {
        const damage = this.boss.takeDamage(effect.damage, this.audio);
        this.scoring.recordDamageDealt(damage);
        if (this.multiplayer && this.multiplayer.inBattle) {
          this.multiplayer.reportBossDamage(damage, `sword_${Date.now()}`);
        }
        this.combat.triggerImpact(0.08, 0.20, 7.0);
        this.combat.addCombatText(this.boss.x + this.boss.width / 2, this.boss.y + 40, `-${damage}`, '#00f3ff');
        this.combat.addHitSparks(effect.x, effect.y, '#00f3ff', 12);
      }
    } else if (effect.type === 'root_boss') {
      // Taynara - Raízes vivas imobilizam o chefão e cancelam o golpe
      this.boss.applyStun(effect.duration);
      const damage = this.boss.takeDamage(effect.damage, this.audio);
      this.scoring.recordDamageDealt(damage);
      if (this.multiplayer && this.multiplayer.inBattle) {
        this.multiplayer.reportBossDamage(damage, `roots_${Date.now()}`);
      }
      this.combat.triggerImpact(0.07, 0.18, 6.0);
      this.combat.addCombatText(this.boss.x + this.boss.width / 2, this.boss.y + 20, 'RAÍZES IMOBILIZARAM!', '#22c55e');
      this.combat.addHitSparks(this.boss.x + this.boss.width / 2, CANVAS_CONFIG.GROUND_Y - 30, '#22c55e', 14);
    } else if (effect.type === 'distract_boss') {
      // Clarinha - Passinho Especial distrai o síndico
      this.boss.applyStun(effect.duration);
      const damage = this.boss.takeDamage(effect.damage, this.audio);
      this.scoring.recordDamageDealt(damage);
      if (this.multiplayer && this.multiplayer.inBattle) {
        this.multiplayer.reportBossDamage(damage, `dance_${Date.now()}`);
      }
      this.combat.triggerImpact(0.06, 0.16, 5.0);
      this.combat.addCombatText(this.boss.x + this.boss.width / 2, this.boss.y + 20, 'DISTRAÍDO NO PASSINHO!', '#ec4899');
      this.combat.addHitSparks(this.boss.x + this.boss.width / 2, this.boss.y + 50, '#ec4899', 14);
    }
  }

  render(ctx) {
    this.renderer.prepareContext(ctx);

    ctx.save();
    // 0. Screen Shake nos impactos fortes
    if (this.enableScreenShake && this.combat.screenShakeTimer > 0) {
      const intensity = this.combat.screenShakeIntensity || 5;
      const ox = (Math.random() - 0.5) * intensity;
      const oy = (Math.random() - 0.5) * intensity;
      ctx.translate(ox, oy);
    }

    // 1. Cenário Noturno com Camadas Parallax conforme a Fase Atual da Campanha
    const currentTheme = this.currentStage ? this.currentStage.arenaTheme : 'parque_columbia';
    this.renderer.renderArenaBackground(ctx, currentTheme, this.animTime);

    // 2. Avisos Telegrafados do Chefão
    this.renderer.drawBossTelegraph(ctx, this.boss, this.animTime);

    // 3. Projéteis em voo
    for (const p of this.combat.projectiles) {
      this.renderer.drawProjectile(ctx, p, this.animTime);
    }

    // 4. Ataque Ativo do Chefão
    this.renderer.drawBossActiveAttack(ctx, this.boss, this.animTime);

    // 5. Renderização do Jogador Local
    this.renderer.drawPlayer(ctx, this.player, this.animTime);

    // 5.1. Renderização de Aliados em Co-Op Online (até 3 jogadores)
    if (this.teammates && this.teammates.length > 0) {
      for (const mate of this.teammates) {
        this.renderer.drawPlayer(ctx, mate, this.animTime);
        // Indicador com nome do jogador aliado acima da cabeça
        ctx.fillStyle = '#00f3ff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(mate.name || 'Aliado', Math.round(mate.x + mate.width / 2), Math.round(mate.y - 6));
      }
    }

    // 6. Renderização do Chefão Atual
    this.renderer.drawBoss(ctx, this.boss, this.animTime);

    // 7. Efeitos de Partículas e Textos Flutuantes
    this.combat.render(ctx);

    // 8. Visualizador Debug de Hitboxes e Hurtboxes (Tecla H)
    if (this.showHitboxes) {
      this._drawDebugHitboxes(ctx);
    }

    ctx.restore();
  }

  _drawDebugHitboxes(ctx) {
    ctx.save();
    // Hurtbox do Jogador (Verde-azulado)
    const pHit = this.player.getHitbox();
    ctx.fillStyle = 'rgba(0, 255, 128, 0.25)';
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1.5;
    ctx.fillRect(pHit.x, pHit.y, pHit.width, pHit.height);
    ctx.strokeRect(pHit.x, pHit.y, pHit.width, pHit.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`PLAYER [${this.player.state.toUpperCase()}]`, pHit.x, pHit.y - 4);

    // Hitbox de Ataque Básico do Jogador (Vermelho)
    if (this.player.attackHitbox) {
      const a = this.player.attackHitbox;
      ctx.fillStyle = 'rgba(255, 0, 80, 0.45)';
      ctx.strokeStyle = '#ff0050';
      ctx.fillRect(a.x, a.y, a.width, a.height);
      ctx.strokeRect(a.x, a.y, a.width, a.height);
      ctx.fillStyle = '#ff0050';
      ctx.fillText(`HITBOX [DMG:${a.damage}]`, a.x, a.y - 4);
    }

    // Hurtbox do Chefão (Amarelo)
    const bHit = this.boss.getHitbox();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
    ctx.strokeStyle = '#facc15';
    ctx.fillRect(bHit.x, bHit.y, bHit.width, bHit.height);
    ctx.strokeRect(bHit.x, bHit.y, bHit.width, bHit.height);
    ctx.fillStyle = '#facc15';
    ctx.fillText(`BOSS [${this.boss.state.toUpperCase()} | HP:${this.boss.hp}]`, bHit.x, bHit.y - 4);

    // Hitbox de Ataque do Chefão (Vermelho)
    if (this.boss.activeAttack && this.boss.activeAttack.hitbox) {
      const ba = this.boss.activeAttack.hitbox;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.45)';
      ctx.strokeStyle = '#ff0000';
      ctx.fillRect(ba.x, ba.y, ba.width, ba.height);
      ctx.strokeRect(ba.x, ba.y, ba.width, ba.height);
    }
    ctx.restore();
  }

  _renderParallaxArena(ctx) {
    // 1. Céu Noturno Urbano (Roxo Profundo / Azul Meia-Noite)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_CONFIG.GROUND_Y);
    skyGrad.addColorStop(0, '#04020a');
    skyGrad.addColorStop(0.55, '#120524');
    skyGrad.addColorStop(1, '#2c0b47');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.GROUND_Y);

    // Lua crescente retrô
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(820, 70, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0314';
    ctx.beginPath();
    ctx.arc(815, 68, 14, 0, Math.PI * 2);
    ctx.fill();

    // Estrelas cintilantes nítidas em pixel art
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 35; i++) {
      const sx = (i * 29 + Math.sin(i * 77) * 20) % CANVAS_CONFIG.WIDTH;
      const sy = (i * 13 + Math.cos(i * 41) * 12) % 170;
      ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
    }

    // 2. Camada Distante: Silhueta do Morro com Torre e Luz Vermelha Piscando
    ctx.fillStyle = '#0a0316';
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_CONFIG.GROUND_Y);
    ctx.lineTo(0, 240);
    ctx.quadraticCurveTo(220, 140, 460, 250);
    ctx.quadraticCurveTo(700, 170, 960, 210);
    ctx.lineTo(960, CANVAS_CONFIG.GROUND_Y);
    ctx.fill();

    // Antena no topo do morro com luz vermelha intermitente
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(220, 125, 2, 20);
    const blinkRed = Math.floor(this.animTime * 2) % 2 === 0;
    ctx.fillStyle = blinkRed ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(219, 123, 4, 4);

    // 3. Camada Média: Edifícios do Parque Columbia com Caixas d'Água e Antenas
    const buildings = [
      { x: 20, w: 90, h: 290, color: '#130726', waterTank: true },
      { x: 130, w: 110, h: 250, color: '#1a0933', antenna: true },
      { x: 260, w: 80, h: 320, color: '#100520', waterTank: true },
      { x: 360, w: 130, h: 270, color: '#17082e', antenna: true },
      { x: 510, w: 100, h: 310, color: '#120624', waterTank: true },
      { x: 630, w: 120, h: 260, color: '#1b0a36', antenna: true },
      { x: 770, w: 90, h: 300, color: '#140728', waterTank: true },
      { x: 880, w: 80, h: 240, color: '#100520' }
    ];

    buildings.forEach(b => {
      const topY = CANVAS_CONFIG.GROUND_Y - b.h;

      // Caixa d'água de fibrocimento no telhado
      if (b.waterTank) {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(b.x + 14, topY - 16, 26, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(b.x + 16, topY - 14, 22, 3);
      }

      // Antena de TV no telhado
      if (b.antenna) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(b.x + b.w - 18, topY - 24, 2, 24);
        ctx.fillRect(b.x + b.w - 24, topY - 18, 14, 2);
        ctx.fillRect(b.x + b.w - 22, topY - 12, 10, 2);
      }

      // Estrutura do prédio
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, topY, b.w, b.h);

      // Janelas pixeladas (amarelas quentes, azuis de TV e apagadas)
      const rows = Math.floor(b.h / 38);
      const cols = Math.floor(b.w / 26);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const randSeed = (r * 7 + c * 13 + Math.floor(b.x)) % 7;
          let winColor = 'rgba(15, 23, 42, 0.9)';
          if (randSeed === 1 || randSeed === 4) {
            winColor = '#fbbf24';
          } else if (randSeed === 2) {
            winColor = '#38bdf8';
          }

          const wx = b.x + 7 + c * 25;
          const wy = topY + 16 + r * 36;
          ctx.fillStyle = winColor;
          ctx.fillRect(wx, wy, 12, 16);

          // Aparelho de ar-condicionado em algumas janelas
          if (randSeed === 1 && r < rows - 1) {
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(wx + 1, wy + 17, 10, 6);
          }
        }
      }
    });

    // 4. Poste de Iluminação Pública Urbano com Cone de Luz Quente
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(218, CANVAS_CONFIG.GROUND_Y - 140, 6, 140);
    ctx.fillRect(212, CANVAS_CONFIG.GROUND_Y - 144, 24, 5);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(220, CANVAS_CONFIG.GROUND_Y - 139, 8, 5);

    // Cone suave de iluminação
    const lightGrad = ctx.createRadialGradient(224, CANVAS_CONFIG.GROUND_Y - 136, 10, 224, CANVAS_CONFIG.GROUND_Y, 150);
    lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
    lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(224, CANVAS_CONFIG.GROUND_Y - 136);
    ctx.lineTo(100, CANVAS_CONFIG.GROUND_Y);
    ctx.lineTo(350, CANVAS_CONFIG.GROUND_Y);
    ctx.closePath();
    ctx.fill();

    // 5. Asfalto e Calçadão Carioca
    ctx.fillStyle = '#0a0514';
    ctx.fillRect(0, CANVAS_CONFIG.GROUND_Y, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT - CANVAS_CONFIG.GROUND_Y);

    // Linha de plataforma ciano neon marcante
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(0, CANVAS_CONFIG.GROUND_Y, CANVAS_CONFIG.WIDTH, 3);

    // Padrão de pedras portuguesas (ondas de Copacabana pixeladas na guia)
    ctx.fillStyle = '#1e1338';
    ctx.fillRect(0, CANVAS_CONFIG.GROUND_Y + 3, CANVAS_CONFIG.WIDTH, 14);
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x < CANVAS_CONFIG.WIDTH; x += 32) {
      ctx.fillRect(x, CANVAS_CONFIG.GROUND_Y + 6, 16, 2);
      ctx.fillRect(x + 8, CANVAS_CONFIG.GROUND_Y + 8, 16, 2);
      ctx.fillRect(x + 16, CANVAS_CONFIG.GROUND_Y + 10, 16, 2);
    }

    // Faixas de trânsito amarelas na pista
    ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
    for (let x = 30; x < CANVAS_CONFIG.WIDTH; x += 130) {
      ctx.fillRect(x, CANVAS_CONFIG.GROUND_Y + 40, 65, 8);
    }
  }

  _endBattle(isVictory, reason) {
    this.isRunning = false;
    this.isGameOver = true;
    this.scoring.finalize(isVictory, this.timeRemaining);

    if (isVictory) {
      this.audio.playVictory();
    } else {
      this.audio.playDefeat();
    }

    const baseSummary = this.scoring.getSummary();
    const isFinalStage = this.currentStageIndex >= CAMPAIGN_STAGES.length - 1;
    const nextStage = CAMPAIGN_STAGES[this.currentStageIndex + 1] || null;

    const summary = {
      ...baseSummary,
      stageIndex: this.currentStageIndex,
      stageTitle: this.currentStage ? this.currentStage.title : 'Fase 1',
      stageDifficulty: this.currentStage ? this.currentStage.difficulty : 'Fácil',
      isFinalStage,
      nextStage
    };

    if (this.onMatchEndCallback) {
      this.onMatchEndCallback(summary);
    }
  }

  advanceToNextStage() {
    const nextIdx = this.currentStageIndex + 1;
    if (nextIdx < CAMPAIGN_STAGES.length) {
      this.start(this.selectedCharId, nextIdx);
    } else {
      this.start(this.selectedCharId, 0);
    }
  }

  retryCurrentStage() {
    this.start(this.selectedCharId, this.currentStageIndex);
  }
}
