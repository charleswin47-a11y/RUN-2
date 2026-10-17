import { SCORING_RULES } from '../config.js';

export class ScoringSystem {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.damageDealt = 0;
    this.damageTaken = 0;
    this.dodgedAttacksCount = 0;
    this.elapsedSeconds = 0;
    this.characterId = '';
    this.isVictory = false;
    this.livesRemaining = 3;
  }

  recordDamageDealt(damage) {
    this.damageDealt += damage;
    this.score += Math.round(damage * SCORING_RULES.DAMAGE_POINT_MULTIPLIER);
  }

  recordDamageTaken(livesLost = 1) {
    this.damageTaken += livesLost;
    this.livesRemaining = Math.max(0, this.livesRemaining - livesLost);
  }

  recordDodge() {
    this.dodgedAttacksCount++;
    this.score += SCORING_RULES.DODGE_BONUS;
  }

  updateTime(dt) {
    this.elapsedSeconds += dt;
    this.score += Math.round(dt * SCORING_RULES.TIME_SURVIVED_PER_SEC);
  }

  finalize(isVictory, remainingTimeSec) {
    this.isVictory = isVictory;
    if (isVictory) {
      this.score += SCORING_RULES.VICTORY_BONUS;
      this.score += this.livesRemaining * SCORING_RULES.LIFE_REMAINING_BONUS;
      if (remainingTimeSec > 0) {
        this.score += Math.round(remainingTimeSec * SCORING_RULES.FAST_FINISH_BONUS_PER_SEC_LEFT);
      }
    }
  }

  getSummary() {
    const minutes = Math.floor(this.elapsedSeconds / 60);
    const seconds = Math.floor(this.elapsedSeconds % 60);
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
      characterId: this.characterId,
      isVictory: this.isVictory,
      damageDealt: Math.round(this.damageDealt),
      damageTaken: this.damageTaken,
      dodgedAttacks: this.dodgedAttacksCount,
      elapsedTimeFormatted: formattedTime,
      livesRemaining: this.livesRemaining,
      finalScore: Math.round(this.score)
    };
  }
}
