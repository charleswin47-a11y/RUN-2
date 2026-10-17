import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BOSSES_CONFIG,
  CAMPAIGN_STAGES,
  CHARACTERS_CONFIG
} from '../src/config.js';
import { BossEntity } from '../src/entities/boss.js';
import { PlayerEntity } from '../src/entities/player.js';
import { CombatSystem } from '../src/systems/combat.js';
import { ScoringSystem } from '../src/systems/scoring.js';

test('Campanha Oficial: 3 Chefões e Estágios Progressivos', () => {
  assert.equal(CAMPAIGN_STAGES.length, 3, 'A campanha deve possuir exatamente 3 chefões');

  // Fase 1: Síndico
  assert.equal(CAMPAIGN_STAGES[0].bossId, 'sindico');
  assert.equal(BOSSES_CONFIG.sindico.MAX_HP, 1000);
  assert.ok(BOSSES_CONFIG.sindico.ATTACKS.CHAVE_INGLESA);
  assert.ok(BOSSES_CONFIG.sindico.ATTACKS.RECLAMACAO_CONDOMINIO);
  assert.ok(BOSSES_CONFIG.sindico.ATTACKS.MULTA_SURPRESA);

  // Fase 2: Bandido
  assert.equal(CAMPAIGN_STAGES[1].bossId, 'bandido');
  assert.equal(BOSSES_CONFIG.bandido.MAX_HP, 1300);
  assert.ok(BOSSES_CONFIG.bandido.ATTACKS.INVESTIDA_RELAMPAGO);
  assert.ok(BOSSES_CONFIG.bandido.ATTACKS.ARREMESSO_FACA);
  assert.ok(BOSSES_CONFIG.bandido.ATTACKS.GOLPE_CORRENTE);

  // Fase 3: Chefão do Tráfico
  assert.equal(CAMPAIGN_STAGES[2].bossId, 'chefao_trafico');
  assert.equal(BOSSES_CONFIG.chefao_trafico.MAX_HP, 1600);
  assert.ok(BOSSES_CONFIG.chefao_trafico.ATTACKS.DOMINIO_ARENA);
  assert.ok(BOSSES_CONFIG.chefao_trafico.ATTACKS.INVESTIDA_CAPANGAS);
  assert.ok(BOSSES_CONFIG.chefao_trafico.ATTACKS.DISPARO_PESADO);
});

test('BossEntity: Máquina de Estados e Patrulha (Diagrama Mermaid)', () => {
  const boss = new BossEntity('bandido');
  assert.equal(boss.state, 'entrada', 'Chefão inicia no estado de Entrada');

  // 1. Simula entrada na arena
  boss.update(1.0, 100, null);
  assert.equal(boss.state, 'patrulha', 'Após entrada, o chefão passa a patrulhar');

  // 2. Patrulha se movimenta
  const startX = boss.x;
  boss.update(0.2, 100, null);
  assert.notEqual(boss.x, startX, 'O chefão deve caminhar durante a patrulha');

  // 3. Aproximação quando jogador fica perto
  boss.patrolTimer = 0;
  boss.update(0.1, boss.x - 50, null);
  assert.equal(boss.state, 'aproximacao', 'Chefão deve entrar no estado de aproximação');

  // 4. Preparação (Telegraph)
  boss.approachTimer = 0;
  boss.update(0.1, 120, null);
  assert.equal(boss.state, 'preparacao', 'Chefão deve preparar golpe telegrafado');
  assert.ok(boss.currentAttack !== null);

  // 5. Ataque
  boss.stateTimer = boss.telegraphDuration + 0.1;
  boss.update(0.1, 120, null);
  assert.equal(boss.state, 'ataque', 'Chefão deve executar o ataque ativo');
  assert.ok(boss.activeAttack !== null);

  // 6. Transição de Fase Especial ao perder vida
  boss.takeDamage(600, null);
  assert.equal(boss.state, 'faseespecial', 'Mudança de fase dispara FaseEspecial');

  // 7. Derrota
  boss.takeDamage(1000, null);
  assert.equal(boss.state, 'derrotado', 'Vida zerada coloca o chefão no estado derrotado');
  assert.equal(boss.hp, 0);
});

test('Estilo de Combate dos 16 Personagens: Golpes Básicos e Contra-Ataque', () => {
  const chars = Object.keys(CHARACTERS_CONFIG);
  assert.equal(chars.length, 16, 'Deve haver 16 combatentes configurados');

  for (const charId of chars) {
    const char = CHARACTERS_CONFIG[charId];
    assert.ok(char.basicAttack, `${charId} deve possuir configuração de basicAttack`);
    assert.ok(char.basicAttack.type, `${charId} deve ter um tipo de ataque específico`);
    assert.ok(char.basicAttack.damage > 0, `${charId} deve ter dano maior que zero`);

    const player = new PlayerEntity(charId);
    player.performBasicAttack(null);
    assert.equal(player.isAttacking, true);
    assert.ok(player.attackHitbox !== null);
  }

  // Teste específico de Contra-Ataque do Di5
  const di5 = new PlayerEntity('di5');
  di5.shieldActive = true;
  di5.takeDamage(1, null); // Escudo absorve e arma contra-ataque
  assert.equal(di5.justCountered, true, 'Di5 deve armar contra-ataque após absorver com escudo');

  di5.performBasicAttack(null);
  assert.equal(di5.attackHitbox.damage, 50, 'Contra-ataque do Di5 deve infligir dano ampliado (25 + 25)');
  assert.equal(di5.justCountered, false, 'Contra-ataque deve ser consumido após o golpe');
});

test('CombatSystem: Resolução de Ataques do Bandido e Chefão do Tráfico', () => {
  const combat = new CombatSystem();
  const player = new PlayerEntity('di5');
  const scoring = new ScoringSystem();

  // 1. Bandido: Investida Relâmpago contra jogador no chão
  const bandido = new BossEntity('bandido');
  bandido.state = 'ataque';
  bandido.activeAttack = {
    type: 'investida_relampago',
    isDashing: true,
    hasHit: false
  };
  // Coloca bandido colidindo com jogador
  bandido.x = player.x;
  player.isGrounded = true;

  combat.update(0.02, player, bandido, scoring, null);
  assert.equal(player.lives, 2, 'Investida Relâmpago do Bandido deve causar dano ao acertar');

  // 2. Chefão do Tráfico: Domínio da Arena (Zona de Fogo no Chão)
  const chefao = new BossEntity('chefao_trafico');
  chefao.state = 'ataque';
  chefao.activeAttack = {
    type: 'dominio_arena',
    zoneX: player.x - 20,
    zoneWidth: 200,
    duration: 1.5,
    hasHit: false
  };

  player.isInvulnerable = false;
  player.isGrounded = true; // No chão dentro da zona
  combat.update(0.02, player, chefao, scoring, null);
  assert.equal(player.lives, 1, 'Zona bloqueada do Chefão do Tráfico deve causar dano se o jogador estiver no chão');

  // 3. Esquiva pulando fora da zona ou no ar
  player.isInvulnerable = false;
  player.isGrounded = false; // Pulando no ar!
  chefao.activeAttack.hasHit = false;
  chefao.activeAttack.dodgedRecorded = false;

  combat.update(0.02, player, chefao, scoring, null);
  assert.equal(player.lives, 1, 'Vidas não devem cair quando o jogador esquiva pulando');
});
