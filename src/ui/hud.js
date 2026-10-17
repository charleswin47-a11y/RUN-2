export class HUD {
  constructor() {
    this.charNameEl = document.getElementById('hud-char-name');
    this.livesContainer = document.getElementById('hud-lives-container');
    this.timerEl = document.getElementById('hud-timer');
    this.bossNameEl = document.getElementById('hud-boss-name');
    this.bossPhaseEl = document.getElementById('hud-boss-phase');
    this.bossHpFill = document.getElementById('hud-boss-hp-fill');
    this.bossHpText = document.getElementById('hud-boss-hp-text');
    this.abilityNameEl = document.getElementById('hud-ability-name');
    this.cooldownOverlay = document.getElementById('hud-cooldown-overlay');
    this.scoreEl = document.getElementById('hud-score');
  }

  setup(character, bossConfig) {
    if (this.charNameEl) this.charNameEl.textContent = character.name;
    if (this.abilityNameEl) this.abilityNameEl.textContent = character.abilityName;
    if (this.bossNameEl) this.bossNameEl.textContent = bossConfig.NAME;
    this.updateBossHP(bossConfig.MAX_HP, bossConfig.MAX_HP, 'Fase 1');
    this.updateLives(3);
    this.updateTimer(180);
    this.updateScore(0);
    this.updateCooldown(0);
  }

  updateLives(livesRemaining) {
    if (!this.livesContainer) return;
    this.livesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.className = `hud-life-icon ${i < livesRemaining ? '' : 'lost'}`;
      heart.textContent = '❤️';
      this.livesContainer.appendChild(heart);
    }
  }

  updateTimer(secondsRemaining) {
    if (!this.timerEl) return;
    const clamped = Math.max(0, Math.ceil(secondsRemaining));
    const mins = Math.floor(clamped / 60);
    const secs = clamped % 60;
    this.timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    this.timerEl.classList.remove('warning', 'critical');
    if (clamped <= 30 && clamped > 10) {
      this.timerEl.classList.add('warning');
    } else if (clamped <= 10) {
      this.timerEl.classList.add('critical');
    }
  }

  updateBossHP(currentHp, maxHp, phaseName) {
    const pct = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
    if (this.bossHpFill) {
      this.bossHpFill.style.width = `${pct}%`;
    }
    if (this.bossHpText) {
      this.bossHpText.textContent = `${Math.ceil(currentHp)} / ${maxHp}`;
    }
    if (this.bossPhaseEl && phaseName) {
      this.bossPhaseEl.textContent = phaseName;
    }
  }

  updateCooldown(remainingSec) {
    if (!this.cooldownOverlay) return;
    if (remainingSec > 0) {
      this.cooldownOverlay.style.display = 'flex';
      this.cooldownOverlay.textContent = remainingSec.toFixed(1) + 's';
    } else {
      this.cooldownOverlay.style.display = 'none';
    }
  }

  updateScore(score) {
    if (this.scoreEl) {
      this.scoreEl.textContent = Number(score).toLocaleString('pt-BR');
    }
  }
}
