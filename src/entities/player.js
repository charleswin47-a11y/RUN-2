import { CANVAS_CONFIG, GAME_RULES, CHARACTERS_CONFIG } from '../config.js';

export class PlayerEntity {
  constructor(charId = 'di5') {
    this.charId = charId;
    this.config = CHARACTERS_CONFIG[charId] || CHARACTERS_CONFIG.di5;

    this.width = 44;
    this.height = 76;
    this.x = 120;
    this.y = CANVAS_CONFIG.GROUND_Y - this.height;

    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isCrouching = false;
    this.facingRight = true;

    this.state = 'idle'; // 'idle', 'run', 'jump', 'fall', 'crouch', 'attack', 'hurt'
    this.stateTimer = 0;

    this.lives = GAME_RULES.PLAYER_START_LIVES;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;

    // Ataque básico específico
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackCooldown = 0;
    this.attackHitbox = null;
    this.attackType = this.config.basicAttack?.type || 'heavy_punch';
    this.pendingBasicProjectile = null;

    // Habilidade especial
    this.abilityCooldown = 0;
    this.abilityActive = false;
    this.abilityDurationTimer = 0;
    this.abilityCharges = this.config.maxCharges || 1;

    // Buffs e mecânicas específicas
    this.shieldActive = false; // Di5
    this.justCountered = false; // Di5 contra-ataque
    this.counterTimer = 0;
    this.bonusSpeed = 0;
  }

  reset(charId) {
    if (charId) {
      this.charId = charId;
      this.config = CHARACTERS_CONFIG[charId] || CHARACTERS_CONFIG.di5;
    }
    this.x = 120;
    this.y = CANVAS_CONFIG.GROUND_Y - this.height;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = true;
    this.isCrouching = false;
    this.facingRight = true;
    this.state = 'idle';
    this.stateTimer = 0;

    this.lives = GAME_RULES.PLAYER_START_LIVES;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;

    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackCooldown = 0;
    this.attackHitbox = null;
    this.attackType = this.config.basicAttack?.type || 'heavy_punch';
    this.pendingBasicProjectile = null;

    this.abilityCooldown = 0;
    this.abilityActive = false;
    this.abilityDurationTimer = 0;
    this.abilityCharges = this.config.maxCharges || 1;
    this.shieldActive = false;
    this.justCountered = false;
    this.counterTimer = 0;
    this.bonusSpeed = 0;
  }

  update(dt, input, audio) {
    this.stateTimer += dt;

    // 1. Invulnerabilidade temporária
    if (this.isInvulnerable) {
      this.invulnerableTimer -= dt;
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
      }
    }

    // Janela de contra-ataque (Di5)
    if (this.counterTimer > 0) {
      this.counterTimer -= dt;
      if (this.counterTimer <= 0) {
        this.justCountered = false;
      }
    }

    // 2. Cooldowns de ataque e habilidade
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.abilityCooldown > 0) this.abilityCooldown -= dt;

    if (this.isAttacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.attackHitbox = null;
      }
    }

    // 3. Duração da habilidade ativa
    if (this.abilityActive) {
      this.abilityDurationTimer -= dt;
      if (this.abilityDurationTimer <= 0) {
        this.endAbility();
      }
    }

    // 4. Agachamento
    this.isCrouching = input.isCrouchPressed() && this.isGrounded;
    this.height = this.isCrouching ? 52 : 76;

    // 5. Movimentação Horizontal
    const currentSpeed = (this.config.speed + this.bonusSpeed) * (this.isCrouching ? 0.4 : 1.0);
    let moveDir = 0;
    if (input.isLeftPressed()) moveDir -= 1;
    if (input.isRightPressed()) moveDir += 1;

    if (moveDir !== 0) {
      this.vx = moveDir * currentSpeed;
      this.facingRight = moveDir > 0;
    } else {
      this.vx = 0;
    }

    // 6. Pulo e Gravidade
    if (input.isJumpPressed() && this.isGrounded && !this.isCrouching) {
      const jumpImpulse = this.charId === 'vitor_mario' && this.abilityActive
        ? this.config.jumpForce * 1.3
        : this.config.jumpForce;

      this.vy = -jumpImpulse;
      this.isGrounded = false;
      if (audio) audio.playJump();
    }

    if (!this.isGrounded) {
      this.vy += CANVAS_CONFIG.GRAVITY * dt;
      this.y += this.vy * dt;

      // Colisão com o chão
      if (this.y + this.height >= CANVAS_CONFIG.GROUND_Y) {
        this.y = CANVAS_CONFIG.GROUND_Y - this.height;
        this.vy = 0;
        this.isGrounded = true;
      }
    }

    this.x += this.vx * dt;

    // Limites da arena (deixar margem nas bordas)
    const minX = 20;
    const maxX = CANVAS_CONFIG.WIDTH - this.width - 20;
    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;

    // 7. Determinação do Estado da Animação
    if (this.isAttacking) {
      this.state = 'attack';
    } else if (!this.isGrounded) {
      this.state = this.vy < 0 ? 'jump' : 'fall';
    } else if (this.isCrouching) {
      this.state = 'crouch';
    } else if (Math.abs(this.vx) > 10) {
      this.state = 'run';
    } else {
      this.state = 'idle';
    }

    // 8. Ataque básico acionado
    if (input.isBasicAttackPressed() && !this.isAttacking && this.attackCooldown <= 0) {
      const basicProj = this.performBasicAttack(audio);
      if (basicProj) {
        this.pendingBasicProjectile = basicProj;
      }
    }
  }

  performBasicAttack(audio) {
    const atkConfig = this.config.basicAttack || {
      name: 'Ataque Básico',
      type: 'punch',
      damage: 25,
      range: 55,
      cooldown: 0.35,
      duration: 0.22
    };

    this.isAttacking = true;
    this.attackTimer = atkConfig.duration || 0.22;
    this.attackCooldown = atkConfig.cooldown || 0.35;
    this.attackType = atkConfig.type;

    let finalDamage = atkConfig.damage || 25;

    // Bônus de Contra-Ataque de Di5 (após bloquear com escudo)
    if (this.charId === 'di5' && this.justCountered) {
      finalDamage += atkConfig.counterBonus || 20;
      this.justCountered = false;
      this.counterTimer = 0;
    }

    // Bônus de Ataque Furtivo de Matheus (durante invisibilidade)
    if (this.charId === 'matheus' && this.abilityActive) {
      finalDamage = Math.round(finalDamage * 1.5);
    }

    const hitWidth = atkConfig.range || 55;
    const hitHeight = 44;
    const hitX = this.facingRight ? this.x + this.width : this.x - hitWidth;
    const hitY = this.y + 16;

    this.attackHitbox = {
      x: hitX,
      y: hitY,
      width: hitWidth,
      height: hitHeight,
      damage: finalDamage,
      type: atkConfig.type,
      charId: this.charId,
      canInterrupt: !!atkConfig.canInterrupt
    };

    if (audio) audio.playAttack();

    // Se o ataque básico gera um pequeno projétil
    if (atkConfig.isProjectile) {
      return {
        type: 'projectile',
        projectileType: atkConfig.type,
        x: this.facingRight ? this.x + this.width : this.x,
        y: this.y + 24,
        vx: (this.facingRight ? 1 : -1) * (atkConfig.range * 3.5),
        vy: atkConfig.type === 'short_splat' ? -220 : 0,
        gravity: atkConfig.type === 'short_splat' ? 620 : 0,
        damage: finalDamage,
        charId: this.charId
      };
    }

    return null;
  }

  triggerAbility(audio) {
    if (this.abilityCooldown > 0) return null;

    this.abilityCooldown = this.config.cooldownSec;
    this.abilityActive = true;
    this.abilityDurationTimer = this.config.durationSec || 2.0;

    if (audio) audio.playAbility();

    // Comportamento customizado por combatente
    switch (this.charId) {
      case 'di5':
        this.shieldActive = true;
        return { type: 'shield', charId: 'di5' };

      case 'nalu':
        this.bonusSpeed = 120;
        return { type: 'speed_buff', multiplier: 1.5 };

      case 'vitor_sonic':
        this.bonusSpeed = 340;
        this.isInvulnerable = true;
        this.invulnerableTimer = this.abilityDurationTimer;
        return { type: 'sonic_spin', damage: 120 };

      case 'joao':
        this.bonusSpeed = 260;
        this.isInvulnerable = true;
        this.invulnerableTimer = this.abilityDurationTimer;
        return { type: 'kart_dash', damage: 135 };

      case 'julya':
        this.bonusSpeed = 240;
        return { type: 'motinha_dash', damage: 100 };

      case 'matheus':
        return { type: 'invisibility', duration: this.abilityDurationTimer };

      case 'vitor_mario':
        this.vy = -750;
        this.isGrounded = false;
        return { type: 'super_jump' };

      case 'douglas':
        return {
          type: 'melee_sword',
          x: this.facingRight ? this.x + this.width : this.x - 70,
          y: this.y + 10,
          width: 70,
          height: 60,
          damage: this.config.damage || 90
        };

      case 'emily':
        return {
          type: 'projectile',
          projectileType: 'hamburguer',
          x: this.x + (this.facingRight ? this.width : 0),
          y: this.y + 24,
          vx: (this.facingRight ? 1 : -1) * (this.config.projectileSpeed || 600),
          vy: 0,
          damage: this.config.damage || 95
        };

      case 'wendel':
        return {
          type: 'projectile',
          projectileType: 'bola_futebol',
          x: this.x + (this.facingRight ? this.width : 0),
          y: this.y + 36,
          vx: (this.facingRight ? 1 : -1) * (this.config.projectileSpeed || 750),
          vy: 0,
          damage: this.config.damage || 110
        };

      case 'junior':
        return {
          type: 'projectile',
          projectileType: 'coco_vador',
          x: this.x + (this.facingRight ? this.width : 0),
          y: this.y + 10,
          vx: (this.facingRight ? 1 : -1) * 380,
          vy: -480, // Arco balístico
          gravity: 800,
          damage: this.config.damage || 95
        };

      case 'muniz':
        return {
          type: 'projectile',
          projectileType: 'vasco_espirito',
          x: this.x + (this.facingRight ? this.width : 0),
          y: this.y + 15,
          vx: (this.facingRight ? 1 : -1) * 600,
          vy: 0,
          damage: this.config.damage || 140
        };

      case 'beatriz':
        return {
          type: 'projectile',
          projectileType: 'rioqualit',
          x: this.x + (this.facingRight ? this.width : 0),
          y: this.y + 20,
          vx: (this.facingRight ? 1 : -1) * 580,
          vy: 0,
          damage: this.config.damage || 130
        };

      case 'lais':
        return {
          type: 'projectile',
          projectileType: 'feixe_prismatico',
          x: this.x + (this.facingRight ? this.width : -400),
          y: this.y + 26,
          range: 400,
          duration: 1.0,
          damage: this.config.damage || 105
        };

      case 'taynara':
        return {
          type: 'root_boss',
          duration: 1.8,
          x: this.x,
          damage: 50
        };

      case 'clarinha':
        return {
          type: 'distract_boss',
          duration: 2.0,
          x: this.x,
          damage: 40
        };

      default:
        return null;
    }
  }

  endAbility() {
    this.abilityActive = false;
    this.bonusSpeed = 0;
  }

  takeDamage(livesLost = 1, audio = null) {
    if (this.isInvulnerable) return false;

    // Se o escudo de Di5 estiver ativo, absorve o golpe
    if (this.shieldActive) {
      this.shieldActive = false;
      this.isInvulnerable = true;
      this.invulnerableTimer = 0.8;
      this.justCountered = true; // Di5 carrega contra-ataque pesado!
      this.counterTimer = 2.5;
      if (audio) audio.playDodge();
      return 'shield_absorbed';
    }

    this.lives -= livesLost;
    this.isInvulnerable = true;
    this.invulnerableTimer = GAME_RULES.INVULNERABILITY_DURATION_SEC;
    this.state = 'hurt';

    // Impulso de knockback
    this.vx = this.facingRight ? -160 : 160;
    this.vy = -180;
    this.isGrounded = false;

    if (audio) audio.playPlayerHurt();
    return true;
  }

  getHitbox() {
    return {
      x: this.x + 6,
      y: this.y + 4,
      width: this.width - 12,
      height: this.height - 4
    };
  }
}
