import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CANVAS_CONFIG,
  GAME_RULES,
  BOSS_CONFIG,
  CHARACTERS_CONFIG,
  SCORING_RULES,
  INPUT_BINDINGS
} from '../src/config.js';

import { ScoringSystem } from '../src/systems/scoring.js';

test('CANVAS_CONFIG: Resolução fixa de 960x540 e chão configurado', () => {
  assert.equal(CANVAS_CONFIG.WIDTH, 960);
  assert.equal(CANVAS_CONFIG.HEIGHT, 540);
  assert.equal(CANVAS_CONFIG.GROUND_Y, 460);
  assert.ok(CANVAS_CONFIG.GRAVITY > 0);
});

test('GAME_RULES: Tempo de batalha de 180s e 3 vidas iniciais', () => {
  assert.equal(GAME_RULES.BATTLE_TIME_LIMIT_SEC, 180);
  assert.equal(GAME_RULES.PLAYER_START_LIVES, 3);
  assert.equal(GAME_RULES.INVULNERABILITY_DURATION_SEC, 1.5);
  assert.ok(GAME_RULES.MAX_DELTA_TIME_SEC <= 0.1);
});

test('BOSS_CONFIG: Síndico possui 1000 HP, 3 fases e 3 ataques específicos', () => {
  assert.equal(BOSS_CONFIG.NAME, 'O Síndico do Parque Columbia');
  assert.equal(BOSS_CONFIG.MAX_HP, 1000);

  // 3 Fases
  const phases = Object.keys(BOSS_CONFIG.PHASES);
  assert.equal(phases.length, 3);
  assert.ok(BOSS_CONFIG.PHASES.PHASE_1.THRESHOLD >= 0.70);
  assert.ok(BOSS_CONFIG.PHASES.PHASE_2.THRESHOLD >= 0.30);

  // 3 Ataques
  const attacks = BOSS_CONFIG.ATTACKS;
  assert.ok(attacks.CHAVE_INGLESA);
  assert.ok(attacks.RECLAMACAO_CONDOMINIO);
  assert.ok(attacks.MULTA_SURPRESA);
});

test('CHARACTERS_CONFIG: Contém os 15 personagens do universo A Grande Família', () => {
  const charKeys = Object.keys(CHARACTERS_CONFIG);
  // Vitor possui 2 modos (Sonic e Mario), totalizando 16 entradas
  assert.ok(charKeys.length >= 15);

  const requiredChars = [
    'di5', 'muniz', 'beatriz', 'vitor_sonic', 'nalu', 'joao',
    'julya', 'matheus', 'douglas', 'emily', 'lais', 'wendel',
    'vitor_mario', 'taynara', 'clarinha', 'junior'
  ];

  requiredChars.forEach(key => {
    const char = CHARACTERS_CONFIG[key];
    assert.ok(char, `Personagem ${key} deve estar configurado`);
    assert.ok(char.name, `Personagem ${key} precisa de nome`);
    assert.ok(char.abilityName, `Personagem ${key} precisa de nome de habilidade`);
    assert.ok(char.cooldownSec > 0, `Personagem ${key} precisa de recarga positiva`);
    assert.ok(char.speed > 0, `Personagem ${key} precisa de velocidade`);
    assert.ok(char.jumpForce > 0, `Personagem ${key} precisa de força de salto`);
  });
});

test('ScoringSystem: Calcula pontuação determinística e estatísticas da partida', () => {
  const scoring = new ScoringSystem();
  scoring.characterId = 'di5';

  // Causa 200 de dano
  scoring.recordDamageDealt(200);
  assert.equal(scoring.damageDealt, 200);
  assert.equal(scoring.score, 200 * SCORING_RULES.DAMAGE_POINT_MULTIPLIER);

  // Registra 2 esquivas
  scoring.recordDodge();
  scoring.recordDodge();
  assert.equal(scoring.dodgedAttacksCount, 2);

  // Toma 1 hit
  scoring.recordDamageTaken(1);
  assert.equal(scoring.livesRemaining, 2);
  assert.equal(scoring.damageTaken, 1);

  // Sobrevive 10 segundos
  scoring.updateTime(10);
  assert.equal(scoring.elapsedSeconds, 10);

  // Finaliza com vitória faltando 60 segundos
  scoring.finalize(true, 60);
  assert.equal(scoring.isVictory, true);

  const summary = scoring.getSummary();
  assert.equal(summary.characterId, 'di5');
  assert.equal(summary.isVictory, true);
  assert.equal(summary.damageDealt, 200);
  assert.equal(summary.livesRemaining, 2);
  assert.ok(summary.finalScore > 5000, 'Pontuação com vitória deve incluir bônus');
});

test('INPUT_BINDINGS: Possui suporte para setas, WASD, ações de pulo e habilidade', () => {
  assert.ok(INPUT_BINDINGS.LEFT.includes('ArrowLeft') && INPUT_BINDINGS.LEFT.includes('KeyA'));
  assert.ok(INPUT_BINDINGS.RIGHT.includes('ArrowRight') && INPUT_BINDINGS.RIGHT.includes('KeyD'));
  assert.ok(INPUT_BINDINGS.JUMP.includes('Space') || INPUT_BINDINGS.JUMP.includes(' '));
  assert.ok(INPUT_BINDINGS.PAUSE.includes('Escape'));
});
