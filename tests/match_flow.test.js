import test from 'node:test';
import assert from 'node:assert/strict';

import { PlayerEntity } from '../src/entities/player.js';
import { BossEntity } from '../src/entities/boss.js';
import { CombatSystem } from '../src/systems/combat.js';
import { ScoringSystem } from '../src/systems/scoring.js';

test('Fluxo Completo de Partida: Combate, Vitória e Estatísticas', () => {
  const player = new PlayerEntity('di5');
  const boss = new BossEntity();
  const combat = new CombatSystem();
  const scoring = new ScoringSystem();
  scoring.characterId = 'di5';

  const idleInput = {
    isLeftPressed: () => false,
    isRightPressed: () => false,
    isJumpPressed: () => false,
    isCrouchPressed: () => false,
    isBasicAttackPressed: () => false,
    isAbilityPressed: () => false
  };

  // 1. Simula 2 segundos de batalha
  for (let step = 0; step < 40; step++) {
    scoring.updateTime(0.05);
    player.update(0.05, idleInput, null);
    boss.update(0.05, player.x, null);
    combat.update(0.05, player, boss, scoring, null);
  }

  assert.equal(scoring.damageDealt, 0);
  assert.ok(scoring.elapsedSeconds > 1.8);

  // 2. Jogador causa dano fatal ao Chefão
  const fatalDmg = boss.takeDamage(1000, null);
  scoring.recordDamageDealt(fatalDmg);
  assert.equal(boss.hp, 0);

  // 3. Finaliza com vitória
  scoring.finalize(true, 120);
  const summary = scoring.getSummary();

  assert.equal(summary.isVictory, true);
  assert.equal(summary.characterId, 'di5');
  assert.equal(summary.damageDealt, 1000);
  assert.equal(summary.livesRemaining, 3);
  assert.ok(summary.finalScore > 10000);

  // 4. Reinício da partida
  player.reset('muniz');
  boss.reset();
  combat.reset();
  scoring.reset();

  assert.equal(player.charId, 'muniz');
  assert.equal(boss.hp, 1000);
  assert.equal(scoring.score, 0);
});
