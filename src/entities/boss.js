import { CANVAS_CONFIG, BOSSES_CONFIG, BOSS_CONFIG } from '../config.js';

export class BossEntity {
  constructor(bossId = 'sindico') {
    this.bossId = bossId;
    this.config = BOSSES_CONFIG[bossId] || BOSS_CONFIG;

    this.name = this.config.NAME;
    this.maxHp = this.config.MAX_HP;
    this.hp = this.maxHp;

    this.width = this.config.WIDTH;
    this.height = this.config.HEIGHT;
    this.x = this.config.SPAWN_X;
    this.y = this.config.SPAWN_Y;
    this.vx = 0;
    this.facingLeft = true;

    this.phase = 'PHASE_1';
    this.phaseConfig = this.config.PHASES.PHASE_1;

    // Máquina de estados oficial (Entrada -> Patrulha -> Aproximacao -> Preparacao -> Ataque -> Recuperacao -> DanoRecebido -> FaseEspecial -> Derrotado)
    this.state = 'entrada'; // 'entrada', 'patrulha', 'aproximacao', 'preparacao', 'ataque', 'recuperacao', 'danorecebido', 'faseespecial', 'derrotado', 'stunned'
    this.stateTimer = 0;
    this.patrolTimer = 1.5;
    this.patrolDirection = -1; // -1: esquerda, 1: direita

    this.currentAttack = null;
    this.activeAttack = null;
    this.targetAttackX = 0;
    this.telegraphDuration = 1.0;

    this.isHurt = false;
    this.hurtTimer = 0;
    this.isEnraged = false;
    this.isVulnerable = true;
    this.hasTriggeredPhase2Transition = false;
    this.hasTriggeredPhase3Transition = false;

    this.stunTimer = 0;
    this.consecutiveAttackCount = 0;
  }

  reset(bossId) {
    if (bossId) {
      this.bossId = bossId;
      this.config = BOSSES_CONFIG[bossId] || BOSS_CONFIG;
    }

    this.name = this.config.NAME;
    this.maxHp = this.config.MAX_HP;
    this.hp = this.maxHp;

    this.width = this.config.WIDTH;
    this.height = this.config.HEIGHT;
    this.x = this.config.SPAWN_X;
    this.y = this.config.SPAWN_Y;
    this.vx = 0;
    this.facingLeft = true;

    this.phase = 'PHASE_1';
    this.phaseConfig = this.config.PHASES.PHASE_1;

    this.state = 'entrada';
    this.stateTimer = 0;
    this.patrolTimer = 1.5;
    this.patrolDirection = -1;

    this.currentAttack = null;
    this.activeAttack = null;
    this.isHurt = false;
    this.hurtTimer = 0;
    this.isEnraged = false;
    this.isVulnerable = true;
    this.hasTriggeredPhase2Transition = false;
    this.hasTriggeredPhase3Transition = false;

    this.stunTimer = 0;
    this.consecutiveAttackCount = 0;
  }

  update(dt, playerX, audio) {
    this.stateTimer += dt;

    // Flash de dano
    if (this.isHurt) {
      this.hurtTimer -= dt;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
      }
    }

    // Se estiver derrotado
    if (this.state === 'derrotado' || this.hp <= 0) {
      this.state = 'derrotado';
      this.vx = 0;
      this.activeAttack = null;
      return;
    }

    // Atordoamento por habilidades especiais (ex: Taynara / Clarinha)
    if (this.state === 'stunned') {
      this.stunTimer -= dt;
      this.vx = 0;
      if (this.stunTimer <= 0) {
        this.state = 'recuperacao';
        this.stateTimer = 0;
        this.activeAttack = null;
      }
      return;
    }

    // Checagem de Fases e Transição Especial
    this._checkPhase();

    // Orientação visual (olhar para o jogador na maioria dos estados)
    if (this.state !== 'ataque' || !this.activeAttack?.isDashing) {
      this.facingLeft = playerX < this.x + this.width / 2;
    }

    // Execução da Máquina de Estados (Diagrama Mermaid)
    switch (this.state) {
      case 'entrada':
        this._updateEntrada(dt);
        break;

      case 'patrulha':
        this._updatePatrulha(dt, playerX);
        break;

      case 'aproximacao':
        this._updateAproximacao(dt, playerX, audio);
        break;

      case 'preparacao': // Telegraph
        this._updatePreparacao(dt, audio);
        break;

      case 'ataque':
        this._updateAtaque(dt, playerX, audio);
        break;

      case 'recuperacao':
        this._updateRecuperacao(dt);
        break;

      case 'danorecebido':
        this._updateDanoRecebido(dt);
        break;

      case 'faseespecial':
        this._updateFaseEspecial(dt);
        break;
    }
  }

  _checkPhase() {
    const hpRatio = this.hp / this.maxHp;

    if (hpRatio <= this.config.PHASES.PHASE_3.THRESHOLD || hpRatio < 0.30) {
      if (this.phase !== 'PHASE_3') {
        this.phase = 'PHASE_3';
        this.phaseConfig = this.config.PHASES.PHASE_3;
        this.isEnraged = true;
        if (!this.hasTriggeredPhase3Transition && this.state !== 'ataque') {
          this.hasTriggeredPhase3Transition = true;
          this._triggerPhaseTransition();
        }
      }
    } else if (hpRatio <= this.config.PHASES.PHASE_2.THRESHOLD || hpRatio < 0.65) {
      if (this.phase !== 'PHASE_2') {
        this.phase = 'PHASE_2';
        this.phaseConfig = this.config.PHASES.PHASE_2;
        if (!this.hasTriggeredPhase2Transition && this.state !== 'ataque') {
          this.hasTriggeredPhase2Transition = true;
          this._triggerPhaseTransition();
        }
      }
    } else {
      this.phase = 'PHASE_1';
      this.phaseConfig = this.config.PHASES.PHASE_1;
      this.isEnraged = false;
    }
  }

  _triggerPhaseTransition() {
    this.state = 'faseespecial';
    this.stateTimer = 0;
    this.vx = 0;
    this.activeAttack = null;
  }

  _updateEntrada(dt) {
    this.isVulnerable = false;
    // Anda suavemente até sua posição inicial
    const targetX = this.config.SPAWN_X;
    if (Math.abs(this.x - targetX) > 4) {
      const dir = targetX > this.x ? 1 : -1;
      this.x += dir * this.config.WALK_SPEED * dt;
    } else {
      this.x = targetX;
      this.state = 'patrulha';
      this.stateTimer = 0;
      this.patrolTimer = 1.2;
      this.isVulnerable = true;
    }
  }

  _updatePatrulha(dt, playerX) {
    this.isVulnerable = true;
    this.patrolTimer -= dt;

    // Movimentação de patrulha entre os limites configurados
    const speed = this.config.WALK_SPEED * (this.phaseConfig.SPEED_MULTIPLIER || 1.0);
    this.x += this.patrolDirection * speed * dt;

    const minX = this.config.PATROL_MIN_X || 450;
    const maxX = this.config.PATROL_MAX_X || 840;

    if (this.x <= minX) {
      this.x = minX;
      this.patrolDirection = 1;
    } else if (this.x >= maxX) {
      this.x = maxX;
      this.patrolDirection = -1;
    }

    // Se o timer de patrulha esgotar ou jogador se aproximar, passa para aproximação
    const distToPlayer = Math.abs((this.x + this.width / 2) - playerX);
    if (this.patrolTimer <= 0 || distToPlayer < 280) {
      this.state = 'aproximacao';
      this.stateTimer = 0;
      this.approachTimer = 0.8 + Math.random() * 0.8;
    }
  }

  _updateAproximacao(dt, playerX, audio) {
    this.isVulnerable = true;
    this.approachTimer -= dt;

    const bossCenter = this.x + this.width / 2;
    const dist = Math.abs(bossCenter - playerX);
    const speed = this.config.RUN_SPEED * (this.phaseConfig.SPEED_MULTIPLIER || 1.0);

    // Comportamento tático individual do chefe
    if (this.bossId === 'bandido') {
      // Bandido avança agressivamente ou recua rápido para preparar emboscada
      if (dist > 220) {
        const dir = playerX < bossCenter ? -1 : 1;
        this.x += dir * speed * dt;
      } else if (dist < 120 && Math.random() < 0.4) {
        // Recuo tático para ganhar distância
        this.x += 1 * speed * 0.8 * dt;
      }
    } else if (this.bossId === 'chefao_trafico') {
      // Chefão do tráfico domina o centro/direita da arena (~450 a 750)
      const idealX = 640;
      if (Math.abs(this.x - idealX) > 15) {
        const dir = idealX > this.x ? 1 : -1;
        this.x += dir * speed * 0.6 * dt;
      }
    } else {
      // Síndico caminha em direção ao jogador de forma desajeitada
      if (dist > 180) {
        const dir = playerX < bossCenter ? -1 : 1;
        this.x += dir * speed * 0.7 * dt;
      }
    }

    // Garante que o chefe fique dentro da arena
    this.x = Math.max(80, Math.min(CANVAS_CONFIG.WIDTH - this.width - 20, this.x));

    if (this.approachTimer <= 0 || dist < 220) {
      this._startTelegraph(playerX, audio);
    }
  }

  _startTelegraph(playerX, audio) {
    this.state = 'preparacao';
    this.stateTimer = 0;
    this.vx = 0;

    // Seleciona ataque conforme o chefe
    const attacks = Object.keys(this.config.ATTACKS);
    const attackKey = attacks[Math.floor(Math.random() * attacks.length)];
    const chosenAttackConfig = this.config.ATTACKS[attackKey];
    this.currentAttack = chosenAttackConfig.ID;

    // Duração do aviso telegrafado com base na fase
    const baseTelegraph = chosenAttackConfig.TELEGRAPH_SEC || 1.0;
    if (this.phase === 'PHASE_1') {
      this.telegraphDuration = baseTelegraph;
    } else if (this.phase === 'PHASE_2') {
      this.telegraphDuration = baseTelegraph * 0.8;
    } else {
      this.telegraphDuration = baseTelegraph * 0.65;
    }

    // Configuração de mira para ataques específicos
    this.targetAttackX = Math.max(60, Math.min(CANVAS_CONFIG.WIDTH - 100, playerX));

    if (audio) audio.playBossTelegraph();
  }

  _updatePreparacao(dt, audio) {
    this.isVulnerable = true;
    if (this.stateTimer >= this.telegraphDuration) {
      this._executeAttack(audio);
    }
  }

  _executeAttack(audio) {
    this.state = 'ataque';
    this.stateTimer = 0;

    const mult = this.phaseConfig.SPEED_MULTIPLIER || 1.0;

    // ==========================================
    // 1. ATAQUES DO SÍNDICO
    // ==========================================
    if (this.currentAttack === 'chave_inglesa') {
      this.activeAttack = {
        type: 'chave_inglesa',
        duration: 0.35,
        hitbox: {
          x: this.facingLeft ? this.x - 180 : this.x + this.width,
          y: this.y + 40,
          width: 180,
          height: 110
        },
        hasHit: false
      };
      if (audio) audio.playAttack();
    } else if (this.currentAttack === 'reclamacao_condominio') {
      this.activeAttack = {
        type: 'reclamacao_condominio',
        shockwaveX: this.facingLeft ? this.x - 20 : this.x + this.width + 20,
        direction: this.facingLeft ? -1 : 1,
        speed: 460 * mult,
        width: 44,
        height: 60,
        hasHit: false
      };
      if (audio) audio.playAttack();
    } else if (this.currentAttack === 'multa_surpresa') {
      this.activeAttack = {
        type: 'multa_surpresa',
        fineX: this.targetAttackX,
        fineY: -50,
        targetY: CANVAS_CONFIG.GROUND_Y - 30,
        speed: 750 * mult,
        hasLanded: false,
        landTimer: 0.35,
        hasHit: false
      };
    }

    // ==========================================
    // 2. ATAQUES DO BANDIDO
    // ==========================================
    else if (this.currentAttack === 'investida_relampago') {
      this.activeAttack = {
        type: 'investida_relampago',
        isDashing: true,
        dashSpeed: 820 * mult,
        direction: this.facingLeft ? -1 : 1,
        duration: 0.5,
        targetX: this.facingLeft ? 40 : CANVAS_CONFIG.WIDTH - this.width - 40,
        hasHit: false
      };
      if (audio) audio.playAttack();
    } else if (this.currentAttack === 'arremesso_faca') {
      this.activeAttack = {
        type: 'arremesso_faca',
        knifeX: this.facingLeft ? this.x - 10 : this.x + this.width + 10,
        knifeY: this.y + 60,
        direction: this.facingLeft ? -1 : 1,
        speed: 680 * mult,
        hasHit: false
      };
      if (audio) audio.playAttack();
    } else if (this.currentAttack === 'golpe_corrente') {
      this.activeAttack = {
        type: 'golpe_corrente',
        duration: 0.32,
        hitbox: {
          x: this.facingLeft ? this.x - 220 : this.x + this.width,
          y: this.y + 40,
          width: 220,
          height: 90
        },
        hasHit: false
      };
      if (audio) audio.playAttack();
    }

    // ==========================================
    // 3. ATAQUES DO CHEFÃO DO TRÁFICO
    // ==========================================
    else if (this.currentAttack === 'dominio_arena') {
      this.activeAttack = {
        type: 'dominio_arena',
        zoneX: Math.max(30, this.targetAttackX - 180),
        zoneWidth: 360,
        duration: 2.2,
        damageTimer: 0,
        hasHit: false
      };
      if (audio) audio.playBossTelegraph();
    } else if (this.currentAttack === 'investida_capangas') {
      this.activeAttack = {
        type: 'investida_capangas',
        capanga1X: CANVAS_CONFIG.WIDTH + 40,
        capanga2X: CANVAS_CONFIG.WIDTH + 140,
        speed: 560 * mult,
        hasHit1: false,
        hasHit2: false
      };
      if (audio) audio.playAttack();
    } else if (this.currentAttack === 'disparo_pesado') {
      this.activeAttack = {
        type: 'disparo_pesado',
        bulletX: this.facingLeft ? this.x - 20 : this.x + this.width + 20,
        bulletY: this.y + 55,
        direction: this.facingLeft ? -1 : 1,
        speed: 840 * mult,
        hasHit: false
      };
      if (audio) audio.playAttack();
    }
  }

  _updateAtaque(dt, playerX, audio) {
    if (!this.activeAttack) {
      this._finishAttack(playerX, audio);
      return;
    }

    const atk = this.activeAttack;

    // Atualização de ataques específicos
    if (atk.type === 'chave_inglesa' || atk.type === 'golpe_corrente') {
      atk.duration -= dt;
      if (atk.duration <= 0) {
        this.activeAttack = null;
        this._finishAttack(playerX, audio);
      }
    } else if (atk.type === 'reclamacao_condominio') {
      atk.shockwaveX += (atk.direction || -1) * atk.speed * dt;
      if (atk.shockwaveX < -80 || atk.shockwaveX > CANVAS_CONFIG.WIDTH + 80) {
        this.activeAttack = null;
        this._finishAttack(playerX, audio);
      }
    } else if (atk.type === 'multa_surpresa') {
      if (!atk.hasLanded) {
        atk.fineY += atk.speed * dt;
        if (atk.fineY >= atk.targetY) {
          atk.fineY = atk.targetY;
          atk.hasLanded = true;
        }
      } else {
        atk.landTimer -= dt;
        if (atk.landTimer <= 0) {
          this.activeAttack = null;
          this._finishAttack(playerX, audio);
        }
      }
    } else if (atk.type === 'investida_relampago') {
      this.x += atk.direction * atk.dashSpeed * dt;
      const minX = 40;
      const maxX = CANVAS_CONFIG.WIDTH - this.width - 40;

      if ((atk.direction < 0 && this.x <= minX) || (atk.direction > 0 && this.x >= maxX)) {
        this.x = atk.direction < 0 ? minX : maxX;
        this.activeAttack = null;
        // Whiff com janela extra de vulnerabilidade para o jogador punir
        this.state = 'recuperacao';
        this.stateTimer = 0;
        this.recoveryDuration = 1.3;
      }
    } else if (atk.type === 'arremesso_faca') {
      atk.knifeX += atk.direction * atk.speed * dt;
      if (atk.knifeX < -60 || atk.knifeX > CANVAS_CONFIG.WIDTH + 60) {
        this.activeAttack = null;
        this._finishAttack(playerX, audio);
      }
    } else if (atk.type === 'dominio_arena') {
      atk.duration -= dt;
      if (atk.duration <= 0) {
        this.activeAttack = null;
        this._finishAttack(playerX, audio);
      }
    } else if (atk.type === 'investida_capangas') {
      atk.capanga1X -= atk.speed * dt;
      atk.capanga2X -= atk.speed * dt;
      if (atk.capanga2X < -80) {
        this.activeAttack = null;
        this._finishAttack(playerX, audio);
      }
    } else if (atk.type === 'disparo_pesado') {
      atk.bulletX += atk.direction * atk.speed * dt;
      if (atk.bulletX < -60 || atk.bulletX > CANVAS_CONFIG.WIDTH + 60) {
        this.activeAttack = null;
        this._finishAttack(playerX, audio);
      }
    }
  }

  _finishAttack(playerX, audio) {
    // Combos de 2 ataques consecutivos na Fase 2 e 3 do Bandido
    if (this.bossId === 'bandido' && (this.phase === 'PHASE_2' || this.phase === 'PHASE_3') && this.consecutiveAttackCount === 0) {
      this.consecutiveAttackCount = 1;
      this._startTelegraph(playerX, audio);
      return;
    }

    this.consecutiveAttackCount = 0;
    this.state = 'recuperacao';
    this.stateTimer = 0;
    this.recoveryDuration = this.config.ATTACKS[this.currentAttack?.toUpperCase()]?.RECOVERY_SEC || 0.8;
  }

  _updateRecuperacao(dt) {
    this.isVulnerable = true;
    const duration = this.recoveryDuration || 0.8;
    if (this.stateTimer >= duration) {
      this.state = 'patrulha';
      this.stateTimer = 0;
      this.patrolTimer = 1.0 + Math.random() * 1.2;
    }
  }

  _updateDanoRecebido(dt) {
    this.isVulnerable = true;
    if (this.stateTimer >= 0.22) {
      this.state = 'recuperacao';
      this.stateTimer = 0;
    }
  }

  _updateFaseEspecial(dt) {
    this.isVulnerable = false; // Breve momento de transição
    if (this.stateTimer >= 0.8) {
      this.state = 'patrulha';
      this.stateTimer = 0;
      this.patrolTimer = 1.0;
      this.isVulnerable = true;
    }
  }

  takeDamage(amount, audio = null) {
    if (!this.isVulnerable || this.state === 'derrotado') return 0;

    const actualDamage = Math.min(this.hp, amount);
    this.hp -= actualDamage;
    this.isHurt = true;
    this.hurtTimer = 0.25;

    const oldPhase = this.phase;
    this._checkPhase();

    if (this.hp <= 0) {
      this.hp = 0;
      this.state = 'derrotado';
      this.activeAttack = null;
      return actualDamage;
    }

    // Se houve mudança de fase, entra imediatamente em FaseEspecial (Enrage)
    if (this.phase !== oldPhase) {
      this.state = 'faseespecial';
      this.stateTimer = 0;
      this.vx = 0;
      this.activeAttack = null;
    } else if (this.state === 'patrulha' || this.state === 'aproximacao') {
      this.state = 'danorecebido';
      this.stateTimer = 0;
    }

    if (audio) audio.playBossHurt();

    return actualDamage;
  }

  applyStun(duration) {
    this.state = 'stunned';
    this.stunTimer = duration;
    this.activeAttack = null;
  }

  getHitbox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 10
    };
  }
}
