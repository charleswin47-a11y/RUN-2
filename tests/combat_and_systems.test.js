import test from 'node:test';
import assert from 'node:assert/strict';

import { CANVAS_CONFIG, GAME_RULES, BOSS_CONFIG, CHARACTERS_CONFIG } from '../src/config.js';
import { PlayerEntity } from '../src/entities/player.js';
import { BossEntity } from '../src/entities/boss.js';
import { CombatSystem } from '../src/systems/combat.js';
import { ScoringSystem } from '../src/systems/scoring.js';

test('PlayerEntity: Movimentação, Pulo, Gravidade e Agachamento', () => {
  const player = new PlayerEntity('di5');

  // Posição inicial no chão
  assert.equal(player.y, CANVAS_CONFIG.GROUND_Y - player.height);
  assert.equal(player.isGrounded, true);

  // Mock de input para pular
  const mockInputJump = {
    isLeftPressed: () => false,
    isRightPressed: () => false,
    isJumpPressed: () => true,
    isCrouchPressed: () => false,
    isBasicAttackPressed: () => false,
    isAbilityPressed: () => false
  };

  // Atualiza física por 0.05s
  player.update(0.05, mockInputJump, null);
  assert.equal(player.isGrounded, false, 'O jogador deve sair do chão ao pular');
  assert.ok(player.vy < 0, 'A velocidade vertical deve ser ascendente');
  assert.ok(player.y < CANVAS_CONFIG.GROUND_Y - player.height, 'A posição Y deve diminuir (subir)');

  // Simula queda com gravidade por 1.5s até voltar ao solo
  const mockInputIdle = {
    isLeftPressed: () => false,
    isRightPressed: () => false,
    isJumpPressed: () => false,
    isCrouchPressed: () => false,
    isBasicAttackPressed: () => false,
    isAbilityPressed: () => false
  };

  player.update(1.5, mockInputIdle, null);
  assert.equal(player.isGrounded, true, 'O jogador deve colidir e aterrissar no chão');
  assert.equal(player.y, CANVAS_CONFIG.GROUND_Y - player.height);

  // Agachamento reduz a altura da hitbox
  const mockInputCrouch = {
    isLeftPressed: () => false,
    isRightPressed: () => false,
    isJumpPressed: () => false,
    isCrouchPressed: () => true,
    isBasicAttackPressed: () => false,
    isAbilityPressed: () => false
  };

  player.update(0.05, mockInputCrouch, null);
  assert.equal(player.isCrouching, true);
  assert.equal(player.height, 52, 'A altura deve diminuir ao agachar');
});

test('PlayerEntity: Ataque Básico gera Hitbox frontal temporária', () => {
  const player = new PlayerEntity('di5');
  player.performBasicAttack(null);

  assert.equal(player.isAttacking, true);
  assert.ok(player.attackHitbox !== null);
  assert.equal(player.attackHitbox.damage, 25);
  assert.ok(player.attackHitbox.x > player.x, 'Hitbox deve ficar à frente do jogador voltado para a direita');
});

test('PlayerEntity: Habilidades dos Combatentes disparam efeitos corretos', () => {
  // 1. Di5 Escudo
  const di5 = new PlayerEntity('di5');
  const effectDi5 = di5.triggerAbility(null);
  assert.equal(effectDi5.type, 'shield');
  assert.equal(di5.shieldActive, true);
  // Escudo absorve 1 dano letal
  const hitResult = di5.takeDamage(1, null);
  assert.equal(hitResult, 'shield_absorbed');
  assert.equal(di5.lives, 3, 'Vidas não devem ser reduzidas com escudo');
  assert.equal(di5.shieldActive, false, 'Escudo deve ser consumido');

  // 2. Emily Hambúrguer
  const emily = new PlayerEntity('emily');
  const effectEmily = emily.triggerAbility(null);
  assert.equal(effectEmily.type, 'projectile');
  assert.equal(effectEmily.projectileType, 'hamburguer');
  assert.ok(effectEmily.vx > 0);

  // 3. Wendel Chuteira Míssil
  const wendel = new PlayerEntity('wendel');
  const effectWendel = wendel.triggerAbility(null);
  assert.equal(effectWendel.type, 'projectile');
  assert.equal(effectWendel.projectileType, 'bola_futebol');

  // 4. Junior Cocô Voador (Arco balístico)
  const junior = new PlayerEntity('junior');
  const effectJunior = junior.triggerAbility(null);
  assert.equal(effectJunior.projectileType, 'coco_vador');
  assert.ok(effectJunior.vy < 0, 'Deve iniciar subindo no arco');
  assert.ok(effectJunior.gravity > 0, 'Deve ter gravidade no arco');

  // 5. Vitor Sonic Spin Dash
  const sonic = new PlayerEntity('vitor_sonic');
  const effectSonic = sonic.triggerAbility(null);
  assert.equal(effectSonic.type, 'sonic_spin');
  assert.ok(sonic.bonusSpeed > 0);
  assert.equal(sonic.isInvulnerable, true);

  // 6. Taynara Raízes Vivas
  const taynara = new PlayerEntity('taynara');
  const effectTaynara = taynara.triggerAbility(null);
  assert.equal(effectTaynara.type, 'root_boss');
  assert.ok(effectTaynara.duration > 0);
});

test('BossEntity: Ciclo de 3 Fases, 3 Ataques e Dano', () => {
  const boss = new BossEntity();
  assert.equal(boss.hp, 1000);
  assert.equal(boss.phase, 'PHASE_1');

  // Redução de vida para Fase 2 (600 HP = 60%)
  boss.takeDamage(400, null);
  assert.equal(boss.hp, 600);
  assert.equal(boss.phase, 'PHASE_2');

  // Redução de vida para Fase 3 (200 HP = 20%)
  boss.takeDamage(400, null);
  assert.equal(boss.hp, 200);
  assert.equal(boss.phase, 'PHASE_3');
  assert.equal(boss.isEnraged, true);

  // Atordoamento por Raízes de Taynara
  boss.applyStun(1.5);
  assert.equal(boss.state, 'stunned');
  assert.equal(boss.stunTimer, 1.5);
});

test('CombatSystem: Resolução de Colisões, Dano e Esquivas', () => {
  const combat = new CombatSystem();
  const player = new PlayerEntity('di5');
  const boss = new BossEntity();
  const scoring = new ScoringSystem();

  // 1. Projétil atinge o Boss
  combat.addProjectile({
    x: boss.x + 20,
    y: boss.y + 30,
    vx: 100,
    damage: 90,
    projectileType: 'hamburguer'
  });

  combat.update(0.02, player, boss, scoring, null);
  assert.equal(boss.hp, 1000 - 90, 'Chefão deve receber 90 de dano');
  assert.equal(scoring.damageDealt, 90);

  // 2. Onda de choque (Reclamação do Condomínio) contra jogador no chão
  boss.state = 'attack';
  boss.activeAttack = {
    type: 'reclamacao_condominio',
    shockwaveX: player.x + 10,
    speed: 400,
    width: 44,
    height: 60,
    hasHit: false
  };

  player.isGrounded = true;
  combat.update(0.02, player, boss, scoring, null);
  assert.equal(player.lives, 2, 'Jogador deve perder 1 vida ao ser atingido no chão');

  // 3. Esquiva no pulo sobre a onda de choque
  player.isInvulnerable = false; // Reset invulnerability
  player.isGrounded = false; // Jogador no ar!
  boss.activeAttack = {
    type: 'reclamacao_condominio',
    shockwaveX: player.x + 10,
    speed: 400,
    width: 44,
    height: 60,
    hasHit: false,
    dodgedRecorded: false
  };

  const dodgesBefore = scoring.dodgedAttacksCount;
  combat.update(0.02, player, boss, scoring, null);
  assert.equal(player.lives, 2, 'Jogador no ar NÃO deve tomar dano da onda terrestre');
  assert.equal(scoring.dodgedAttacksCount, dodgesBefore + 1, 'Deve registrar esquiva no pulo');
});
