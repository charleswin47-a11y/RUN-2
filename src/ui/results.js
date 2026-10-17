import { CHARACTERS_CONFIG } from '../config.js';

export class ResultsScreen {
  constructor() {
    this.screen = document.getElementById('results-screen');
    this.titleEl = document.getElementById('results-title');
    this.subtitleEl = document.getElementById('results-subtitle');

    this.charEl = document.getElementById('res-char');
    this.statusEl = document.getElementById('res-status');
    this.dmgDealtEl = document.getElementById('res-damage-dealt');
    this.dmgTakenEl = document.getElementById('res-damage-taken');
    this.dodgesEl = document.getElementById('res-dodges');
    this.timeEl = document.getElementById('res-time');
    this.livesEl = document.getElementById('res-lives');
    this.scoreEl = document.getElementById('res-score');

    this.advanceBtn = document.getElementById('btn-advance-stage');
    this.playAgainBtn = document.getElementById('btn-play-again');
    this.backMenuBtn = document.getElementById('btn-back-menu');

    this.onPlayAgainCallback = null;
    this.onBackMenuCallback = null;
    this.onAdvanceStageCallback = null;
  }

  init({ onPlayAgain, onBackMenu, onAdvanceStage }) {
    this.onPlayAgainCallback = onPlayAgain;
    this.onBackMenuCallback = onBackMenu;
    this.onAdvanceStageCallback = onAdvanceStage;

    if (this.advanceBtn) {
      this.advanceBtn.onclick = () => {
        this.hide();
        if (this.onAdvanceStageCallback) this.onAdvanceStageCallback();
      };
    }

    if (this.playAgainBtn) {
      this.playAgainBtn.onclick = () => {
        this.hide();
        if (this.onPlayAgainCallback) this.onPlayAgainCallback();
      };
    }

    if (this.backMenuBtn) {
      this.backMenuBtn.onclick = () => {
        this.hide();
        if (this.onBackMenuCallback) this.onBackMenuCallback();
      };
    }

    // Atalho Enter para avançar de fase
    window.addEventListener('keydown', (e) => {
      if (this.screen && this.screen.classList.contains('active')) {
        if (e.key === 'Enter') {
          if (this.advanceBtn && this.advanceBtn.style.display !== 'none') {
            this.advanceBtn.click();
          } else if (this.playAgainBtn) {
            this.playAgainBtn.click();
          }
        }
      }
    });
  }

  show(summary) {
    const char = CHARACTERS_CONFIG[summary.characterId] || { name: summary.characterId };

    if (summary.isVictory) {
      this.titleEl.style.color = 'var(--cyan-neon)';
      if (summary.isFinalStage) {
        this.titleEl.textContent = 'CAMPANHA CONCLUÍDA!';
        this.subtitleEl.textContent = 'Parabéns! Você derrotou O Síndico, O Bandido e O Chefão do Tráfico!';
        if (this.advanceBtn) this.advanceBtn.style.display = 'none';
        if (this.playAgainBtn) this.playAgainBtn.textContent = 'JOGAR CAMPANHA NOVAMENTE';
      } else {
        this.titleEl.textContent = 'VITÓRIA NA ' + (summary.stageTitle ? summary.stageTitle.toUpperCase() : 'FASE') + '!';
        const nextTitle = summary.nextStage ? summary.nextStage.title : 'Próxima Fase';
        this.subtitleEl.textContent = `Desafio superado! Próximo oponente: ${nextTitle}.`;
        if (this.advanceBtn) {
          this.advanceBtn.style.display = 'inline-block';
          this.advanceBtn.textContent = `AVANÇAR PARA ${nextTitle.toUpperCase()} [ENTER]`;
        }
        if (this.playAgainBtn) this.playAgainBtn.textContent = 'REPETIR FASE ATUAL';
      }
    } else {
      this.titleEl.textContent = 'DERROTA!';
      this.titleEl.style.color = 'var(--magenta-neon)';
      this.subtitleEl.textContent = summary.livesRemaining <= 0
        ? `Você foi derrotado em ${summary.stageTitle || 'combate'}. Tente novamente!`
        : `O tempo limite se esgotou antes de derrotar o chefão!`;
      if (this.advanceBtn) this.advanceBtn.style.display = 'none';
      if (this.playAgainBtn) this.playAgainBtn.textContent = 'TENTAR ESTA FASE NOVAMENTE';
    }

    if (this.charEl) this.charEl.textContent = char.name;
    if (this.statusEl) this.statusEl.textContent = summary.isVictory ? 'Vitória' : 'Derrota';
    if (this.dmgDealtEl) this.dmgDealtEl.textContent = summary.damageDealt.toLocaleString('pt-BR');
    if (this.dmgTakenEl) this.dmgTakenEl.textContent = `${summary.damageTaken} vida(s)`;
    if (this.dodgesEl) this.dodgesEl.textContent = summary.dodgedAttacks;
    if (this.timeEl) this.timeEl.textContent = summary.elapsedTimeFormatted;
    if (this.livesEl) this.livesEl.textContent = `${summary.livesRemaining} / 3`;
    if (this.scoreEl) this.scoreEl.textContent = summary.finalScore.toLocaleString('pt-BR');

    if (this.screen) this.screen.classList.add('active');
  }

  hide() {
    if (this.screen) this.screen.classList.remove('active');
  }
}
