export class CombatSystem {
  constructor() {
    this.projectiles = [];
    this.combatTexts = []; // Dano flutuante e textos de aviso
    this.particles = [];
    this.hitstopTimer = 0; // Pausa dramática em milissegundos nos impactos fortes
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;
    this.onDamageDealt = null;
  }

  reset() {
    this.projectiles = [];
    this.combatTexts = [];
    this.particles = [];
    this.hitstopTimer = 0;
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;
    this.onDamageDealt = null;
  }

  triggerImpact(hitstopDuration = 0.05, shakeDuration = 0.15, shakeIntensity = 5) {
    this.hitstopTimer = Math.max(this.hitstopTimer, hitstopDuration);
    this.screenShakeTimer = Math.max(this.screenShakeTimer, shakeDuration);
    this.screenShakeIntensity = Math.max(this.screenShakeIntensity, shakeIntensity);
  }

  addProjectile(proj) {
    this.projectiles.push({
      ...proj,
      hasHit: false,
      lifeTimer: proj.duration || 3.0
    });
  }

  addCombatText(x, y, text, color = '#ffffff') {
    this.combatTexts.push({
      x,
      y,
      text,
      color,
      vy: -60,
      alpha: 1.0,
      life: 0.8
    });
  }

  addHitSparks(x, y, color = '#ffe600', count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 120 + Math.random() * 160;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1.0,
        life: 0.35
      });
    }
  }

  update(dt, player, boss, scoring, audio) {
    // 1. Atualização e Colisão dos Projéteis do Jogador
    const bossHitbox = boss.getHitbox();

    if (this.screenShakeTimer > 0) {
      this.screenShakeTimer -= dt;
      if (this.screenShakeTimer <= 0) this.screenShakeIntensity = 0;
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.lifeTimer -= dt;

      // Movimentação do projétil
      p.x += (p.vx || 0) * dt;
      if (p.gravity) {
        p.vy += p.gravity * dt;
      }
      p.y += (p.vy || 0) * dt;

      // Colisão do Projétil com o Chefão
      if (!p.hasHit && boss.isVulnerable) {
        const projRect = {
          x: p.x - 16,
          y: p.y - 16,
          width: 32,
          height: 32
        };

        if (this._checkOverlap(projRect, bossHitbox)) {
          p.hasHit = true;
          const damageDealt = boss.takeDamage(p.damage, audio);
          scoring.recordDamageDealt(damageDealt);
          if (this.onDamageDealt) this.onDamageDealt(damageDealt, p.attackId || `proj_${p.type}_${Date.now()}`);
          this.triggerImpact(0.04, 0.12, 4);
          this.addCombatText(boss.x + boss.width / 2, boss.y + 20, `-${damageDealt}`, '#00f3ff');
          this.addHitSparks(p.x, p.y, '#00f3ff');

          // Se for projétil comum, remove após o impacto
          if (p.projectileType !== 'vasco_espirito' && p.projectileType !== 'rioqualit') {
            this.projectiles.splice(i, 1);
            continue;
          }
        }
      }

      // Limpeza de projéteis fora da tela ou expirados
      if (p.lifeTimer <= 0 || p.x > 1000 || p.x < -100 || p.y > 540) {
        this.projectiles.splice(i, 1);
      }
    }

    // 2. Colisão do Ataque Básico do Jogador com o Chefão
    if (player.attackHitbox && boss.isVulnerable && !player.attackHitbox.hasHit) {
      if (this._checkOverlap(player.attackHitbox, bossHitbox)) {
        player.attackHitbox.hasHit = true;
        const damage = boss.takeDamage(player.attackHitbox.damage, audio);
        scoring.recordDamageDealt(damage);
        if (this.onDamageDealt) this.onDamageDealt(damage, player.attackHitbox.attackId || `basic_${player.charId}_${Date.now()}`);

        // Feedback de combate estilizado
        if (player.attackHitbox.charId === 'di5' && player.attackHitbox.damage > 35) {
          this.triggerImpact(0.08, 0.22, 7.5);
          this.addCombatText(boss.x + boss.width / 2, boss.y + 20, `CONTRA-ATAQUE! -${damage}`, '#00f3ff');
          this.addHitSparks(player.attackHitbox.x, player.attackHitbox.y, '#00f3ff', 16);
        } else if (player.attackHitbox.charId === 'matheus' && player.abilityActive) {
          this.triggerImpact(0.07, 0.18, 6.0);
          this.addCombatText(boss.x + boss.width / 2, boss.y + 20, `GOLPE FURTIVO! -${damage}`, '#c084fc');
          this.addHitSparks(player.attackHitbox.x, player.attackHitbox.y, '#c084fc', 14);
        } else {
          this.triggerImpact(0.05, 0.14, 4.5);
          this.addCombatText(boss.x + boss.width / 2, boss.y + 40, `-${damage}`, '#ffe600');
          this.addHitSparks(player.attackHitbox.x, player.attackHitbox.y, '#ffe600', 8);
        }

        // Interrupção compatível (ex: Passinho da Clarinha durante preparação)
        if (player.attackHitbox.canInterrupt && boss.state === 'preparacao') {
          boss.applyStun(1.2);
          this.triggerImpact(0.07, 0.16, 5.0);
          this.addCombatText(boss.x + boss.width / 2, boss.y - 10, 'GOLPE INTERROMPIDO!', '#ec4899');
        }
      }
    }

    // 3. Colisão dos Golpes de Avanço Ofensivo (Vitor Sonic, João Kart, Julya Motinha)
    if (player.abilityActive && (player.charId === 'vitor_sonic' || player.charId === 'joao' || player.charId === 'julya')) {
      if (this._checkOverlap(player.getHitbox(), bossHitbox) && !player.dashHitApplied) {
        player.dashHitApplied = true;
        const dmg = player.config.damage || 110;
        const damage = boss.takeDamage(dmg, audio);
        scoring.recordDamageDealt(damage);
        if (this.onDamageDealt) this.onDamageDealt(damage, `dash_${player.charId}_${Date.now()}`);
        this.triggerImpact(0.07, 0.20, 6.5);
        this.addCombatText(boss.x + boss.width / 2, boss.y + 40, `-${damage}`, '#ff007f');
        this.addHitSparks(player.x + player.width, player.y + player.height / 2, '#ff007f', 14);
      }
    } else {
      player.dashHitApplied = false;
    }

    // 4. Colisão dos Ataques dos 3 Chefões com o Jogador
    const playerHitbox = player.getHitbox();

    if ((boss.state === 'ataque' || boss.state === 'attack') && boss.activeAttack && !boss.activeAttack.hasHit) {
      const attack = boss.activeAttack;

      // 4.1. Ataques do Síndico
      if (attack.type === 'chave_inglesa') {
        if (this._checkOverlap(attack.hitbox, playerHitbox)) {
          attack.hasHit = true;
          const hitResult = player.takeDamage(1, audio);
          this._applyPlayerDamage(player, hitResult, scoring, 'GOLPE DE CHAVE!');
        }
      } else if (attack.type === 'reclamacao_condominio') {
        const shockwaveRect = {
          x: attack.shockwaveX,
          y: 460 - 50,
          width: attack.width,
          height: attack.height
        };

        if (this._checkOverlap(shockwaveRect, playerHitbox)) {
          if (player.isGrounded) {
            attack.hasHit = true;
            const hitResult = player.takeDamage(1, audio);
            this._applyPlayerDamage(player, hitResult, scoring, 'MULTADO NO CHÃO!');
          } else if (!attack.dodgedRecorded) {
            attack.dodgedRecorded = true;
            scoring.recordDodge();
            this.addCombatText(player.x, player.y - 20, 'ESQUIVA NO PULO!', '#00ff88');
            if (audio) audio.playDodge();
          }
        }
      } else if (attack.type === 'multa_surpresa') {
        if (attack.hasLanded) {
          const fineRect = {
            x: attack.fineX - 35,
            y: attack.fineY - 45,
            width: 70,
            height: 60
          };

          if (this._checkOverlap(fineRect, playerHitbox)) {
            attack.hasHit = true;
            const hitResult = player.takeDamage(1, audio);
            this._applyPlayerDamage(player, hitResult, scoring, 'MULTA JUDICIAL!');
          } else if (!attack.dodgedRecorded) {
            attack.dodgedRecorded = true;
            scoring.recordDodge();
            this.addCombatText(player.x, player.y - 20, 'ESQUIVA PERFEITA!', '#00ff88');
            if (audio) audio.playDodge();
          }
        }
      }

      // 4.2. Ataques do Bandido
      else if (attack.type === 'investida_relampago') {
        if (this._checkOverlap(boss.getHitbox(), playerHitbox)) {
          attack.hasHit = true;
          const hitResult = player.takeDamage(1, audio);
          this._applyPlayerDamage(player, hitResult, scoring, 'ATROPELADO!');
        }
      } else if (attack.type === 'arremesso_faca') {
        const knifeRect = {
          x: attack.knifeX - 12,
          y: attack.knifeY - 8,
          width: 24,
          height: 16
        };
        if (this._checkOverlap(knifeRect, playerHitbox)) {
          attack.hasHit = true;
          const hitResult = player.takeDamage(1, audio);
          this._applyPlayerDamage(player, hitResult, scoring, 'CORTE DE NAVALHA!');
        }
      } else if (attack.type === 'golpe_corrente') {
        if (this._checkOverlap(attack.hitbox, playerHitbox)) {
          attack.hasHit = true;
          const hitResult = player.takeDamage(1, audio);
          this._applyPlayerDamage(player, hitResult, scoring, 'AÇOITE DE CORRENTE!');
        }
      }

      // 4.3. Ataques do Chefão do Tráfico
      else if (attack.type === 'dominio_arena') {
        // Se o jogador estiver no chão dentro da zona de domínio ativa
        const inZone = player.x + player.width > attack.zoneX && player.x < attack.zoneX + attack.zoneWidth;
        if (inZone && player.isGrounded && attack.duration < 1.8) {
          attack.hasHit = true;
          const hitResult = player.takeDamage(1, audio);
          this._applyPlayerDamage(player, hitResult, scoring, 'FOGO CRUZADO!');
        } else if (inZone && !player.isGrounded && !attack.dodgedRecorded) {
          attack.dodgedRecorded = true;
          scoring.recordDodge();
          this.addCombatText(player.x, player.y - 20, 'SALTADO SOBRE O FOGO!', '#00ff88');
          if (audio) audio.playDodge();
        }
      } else if (attack.type === 'investida_capangas') {
        const c1Rect = { x: attack.capanga1X, y: 460 - 70, width: 44, height: 70 };
        const c2Rect = { x: attack.capanga2X, y: 460 - 70, width: 44, height: 70 };

        if (!attack.hasHit1 && this._checkOverlap(c1Rect, playerHitbox)) {
          if (player.isGrounded) {
            attack.hasHit1 = true;
            const hitResult = player.takeDamage(1, audio);
            this._applyPlayerDamage(player, hitResult, scoring, 'EMBOSCADA!');
          } else if (!attack.dodgedRecorded) {
            attack.dodgedRecorded = true;
            scoring.recordDodge();
            this.addCombatText(player.x, player.y - 20, 'PULO SOBRE O CAPANGA!', '#00ff88');
            if (audio) audio.playDodge();
          }
        }

        if (!attack.hasHit2 && this._checkOverlap(c2Rect, playerHitbox)) {
          if (player.isGrounded) {
            attack.hasHit2 = true;
            const hitResult = player.takeDamage(1, audio);
            this._applyPlayerDamage(player, hitResult, scoring, 'EMBOSCADA!');
          }
        }
      } else if (attack.type === 'disparo_pesado') {
        const bulletRect = {
          x: attack.bulletX - 16,
          y: attack.bulletY - 6,
          width: 32,
          height: 12
        };
        if (this._checkOverlap(bulletRect, playerHitbox)) {
          attack.hasHit = true;
          const hitResult = player.takeDamage(1, audio);
          this._applyPlayerDamage(player, hitResult, scoring, 'DISPARO PESADO!');
        }
      }
    }

    // 5. Atualização de Textos Flutuantes
    for (let i = this.combatTexts.length - 1; i >= 0; i--) {
      const ct = this.combatTexts[i];
      ct.y += ct.vy * dt;
      ct.life -= dt;
      ct.alpha = Math.max(0, ct.life / 0.8);
      if (ct.life <= 0) {
        this.combatTexts.splice(i, 1);
      }
    }

    // 6. Atualização de Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      pt.alpha = Math.max(0, pt.life / 0.35);
      if (pt.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  _applyPlayerDamage(player, hitResult, scoring, hitText, hitColor = '#ff0055') {
    if (hitResult === 'shield_absorbed') {
      this.triggerImpact(0.06, 0.16, 5.0);
      this.addCombatText(player.x, player.y - 20, 'ESCUDO BLOQUEOU!', '#00f3ff');
      scoring.recordDodge();
    } else if (hitResult) {
      this.triggerImpact(0.09, 0.22, 7.5);
      scoring.recordDamageTaken(1);
      this.addCombatText(player.x, player.y - 20, hitText, hitColor);
    }
  }

  _checkOverlap(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }

  render(ctx) {
    // 1. Partículas
    ctx.save();
    for (const pt of this.particles) {
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.fillRect(Math.round(pt.x), Math.round(pt.y), Math.round(pt.size), Math.round(pt.size));
    }
    ctx.restore();

    // 2. Textos Flutuantes de Combate
    ctx.save();
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    for (const ct of this.combatTexts) {
      ctx.globalAlpha = ct.alpha;
      ctx.fillStyle = ct.color;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText(ct.text, Math.round(ct.x), Math.round(ct.y));
    }
    ctx.restore();
  }
}
