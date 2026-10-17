/**
 * A Grande Família Game - Modo Chefão
 * Motor de Renderização Pixel Art 16-bits (SpriteRenderer)
 * Renderização deliberada de pixels alinhados à grade, sem interpolação borrada.
 * Totalmente compatível com as referências visuais oficiais de A Grande Família Game.
 */

export class SpriteRenderer {
  constructor() {
    this.pixelScale = 2;
  }

  prepareContext(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
  }

  // =========================================================================
  // RETRATOS INDIVIDUAIS DOS 16 COMBATENTES (MENU E HUD)
  // =========================================================================

  drawCharacterPortrait(ctx, charId, x = 0, y = 0, size = 36) {
    ctx.save();
    this.prepareContext(ctx);

    const s = size / 36;
    const px = Math.round(x);
    const py = Math.round(y);

    // Fundo da moldura com degradê retrô
    const bgGrad = ctx.createLinearGradient(px, py, px, py + size);
    bgGrad.addColorStop(0, '#1c1038');
    bgGrad.addColorStop(1, '#0b0618');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(px, py, size, size);

    // 1. Pele com sombreamento em 2 tons
    const { skinBase, skinShadow } = this._getSkinPalette(charId);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(px + 8 * s, py + 12 * s, 20 * s, 16 * s);
    ctx.fillStyle = skinBase;
    ctx.fillRect(px + 9 * s, py + 10 * s, 18 * s, 16 * s);

    // 2. Vestimenta / Colarinho com sombras
    const { torsoBase, torsoHighlight, torsoShadow } = this._getTorsoPalette(charId);
    ctx.fillStyle = torsoShadow;
    ctx.fillRect(px + 5 * s, py + 26 * s, 26 * s, 10 * s);
    ctx.fillStyle = torsoBase;
    ctx.fillRect(px + 6 * s, py + 25 * s, 24 * s, 9 * s);
    ctx.fillStyle = torsoHighlight;
    ctx.fillRect(px + 8 * s, py + 25 * s, 20 * s, 2 * s);

    if (charId === 'muniz') {
      // Listra branca diagonal cruzmaltina + detalhe vermelho
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(px + 8 * s, py + 25 * s);
      ctx.lineTo(px + 18 * s, py + 36 * s);
      ctx.lineTo(px + 23 * s, py + 36 * s);
      ctx.lineTo(px + 13 * s, py + 25 * s);
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 14 * s, py + 28 * s, 3 * s, 3 * s);
    }

    // 3. Olhos expressivos com íris e brilho de pupila
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 11 * s, py + 15 * s, 5 * s, 5 * s);
    ctx.fillRect(px + 20 * s, py + 15 * s, 5 * s, 5 * s);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px + 13 * s, py + 16 * s, 3 * s, 4 * s);
    ctx.fillRect(px + 22 * s, py + 16 * s, 3 * s, 4 * s);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 14 * s, py + 16 * s, 1 * s, 1 * s);
    ctx.fillRect(px + 23 * s, py + 16 * s, 1 * s, 1 * s);

    // Nariz e boca sutis em pixel art
    ctx.fillStyle = skinShadow;
    ctx.fillRect(px + 17 * s, py + 20 * s, 2 * s, 2 * s);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(px + 16 * s, py + 23 * s, 4 * s, 1 * s);

    // 4. Cabelos, Acessórios e Chapéus individuais
    this._drawPortraitHeadgear(ctx, charId, px, py, s);

    // Contorno pixelado nítido
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);

    ctx.restore();
  }

  _drawPortraitHeadgear(ctx, charId, px, py, s) {
    switch (charId) {
      case 'di5':
        // Cabelo preto texturizado
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 7 * s, py + 3 * s, 22 * s, 6 * s);
        ctx.fillRect(px + 5 * s, py + 6 * s, 4 * s, 7 * s);
        // Faixa Ciano oficial na testa
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px + 6 * s, py + 8 * s, 24 * s, 4 * s);
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(px + 6 * s, py + 11 * s, 24 * s, 1 * s);
        // Nó/pontas da faixa na lateral
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px + 4 * s, py + 10 * s, 3 * s, 5 * s);
        // Óculos escuros retangulares com bordas ciano e brilho duplo
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 9 * s, py + 14 * s, 8 * s, 6 * s);
        ctx.fillRect(px + 19 * s, py + 14 * s, 8 * s, 6 * s);
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px + 9 * s, py + 14 * s, 8 * s, 1 * s);
        ctx.fillRect(px + 19 * s, py + 14 * s, 8 * s, 1 * s);
        ctx.fillRect(px + 17 * s, py + 16 * s, 2 * s, 2 * s); // Ponte
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 10 * s, py + 15 * s, 2 * s, 2 * s);
        ctx.fillRect(px + 20 * s, py + 15 * s, 2 * s, 2 * s);
        break;

      case 'wendel':
        // Boné vermelho oficial virado para trás
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(px + 5 * s, py + 4 * s, 26 * s, 9 * s);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 8 * s);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 8 * s, py + 3 * s, 18 * s, 3 * s);
        // Aba do boné virada para trás (lado esquerdo do retrato)
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(px + 2 * s, py + 8 * s, 5 * s, 4 * s);
        // Cabelo rente saindo embaixo do boné
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(px + 6 * s, py + 11 * s, 4 * s, 6 * s);
        ctx.fillRect(px + 26 * s, py + 11 * s, 4 * s, 6 * s);
        break;

      case 'muniz':
        // Cabelo preto alinhado
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 8 * s);
        ctx.fillRect(px + 5 * s, py + 7 * s, 4 * s, 8 * s);
        // Óculos escuros aviador com armação amarela oficial
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px + 9 * s, py + 13 * s, 9 * s, 8 * s);
        ctx.fillRect(px + 18 * s, py + 13 * s, 9 * s, 8 * s);
        ctx.fillStyle = '#020617';
        ctx.fillRect(px + 10 * s, py + 14 * s, 7 * s, 6 * s);
        ctx.fillRect(px + 19 * s, py + 14 * s, 7 * s, 6 * s);
        // Ponte dourada
        ctx.fillStyle = '#facc15';
        ctx.fillRect(px + 17 * s, py + 15 * s, 2 * s, 2 * s);
        // Reflexo branco nos dois vidros
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 11 * s, py + 15 * s, 2 * s, 2 * s);
        ctx.fillRect(px + 20 * s, py + 15 * s, 2 * s, 2 * s);
        break;

      case 'joao':
        // Capuz vermelho oficial cobrindo topo e laterais
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(px + 4 * s, py + 2 * s, 28 * s, 12 * s);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 5 * s, py + 2 * s, 26 * s, 10 * s);
        ctx.fillRect(px + 3 * s, py + 8 * s, 6 * s, 18 * s);
        ctx.fillRect(px + 27 * s, py + 8 * s, 6 * s, 18 * s);
        // Borda do capuz contornando o rosto
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 7 * s, py + 4 * s, 22 * s, 3 * s);
        // Fones de ouvido sobre o capuz
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 2 * s, py + 12 * s, 4 * s, 10 * s);
        ctx.fillRect(px + 30 * s, py + 12 * s, 4 * s, 10 * s);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(px + 3 * s, py + 14 * s, 2 * s, 6 * s);
        break;

      case 'douglas':
        // Cabelo preto com bandana ciano
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 7 * s);
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px + 6 * s, py + 7 * s, 24 * s, 3 * s);
        // Barba cheia pixel art cobrindo queixo e mandíbula
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + 8 * s, py + 20 * s, 5 * s, 7 * s);
        ctx.fillRect(px + 23 * s, py + 20 * s, 5 * s, 7 * s);
        ctx.fillRect(px + 11 * s, py + 23 * s, 14 * s, 5 * s);
        // Bigode volumoso
        ctx.fillRect(px + 12 * s, py + 21 * s, 12 * s, 3 * s);
        // Sobrancelhas guerreiras grossas
        ctx.fillRect(px + 10 * s, py + 13 * s, 6 * s, 2 * s);
        ctx.fillRect(px + 20 * s, py + 13 * s, 6 * s, 2 * s);
        break;

      case 'nalu':
        // Cabelo loiro exuberante com mechas e sombra
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px + 5 * s, py + 4 * s, 26 * s, 10 * s);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 8 * s);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(px + 8 * s, py + 3 * s, 18 * s, 3 * s);
        // Mechas caindo nos ombros
        ctx.fillStyle = '#fde047';
        ctx.fillRect(px + 3 * s, py + 10 * s, 6 * s, 18 * s);
        ctx.fillRect(px + 27 * s, py + 10 * s, 6 * s, 18 * s);
        // Laço de cabelo rosa e lilás oficial
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(px + 22 * s, py + 1 * s, 8 * s, 5 * s);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(px + 24 * s, py + 2 * s, 4 * s, 3 * s);
        break;

      case 'beatriz':
        // Cabelo castanho suave
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + 6 * s, py + 8 * s, 24 * s, 6 * s);
        ctx.fillRect(px + 4 * s, py + 12 * s, 5 * s, 14 * s);
        ctx.fillRect(px + 27 * s, py + 12 * s, 5 * s, 14 * s);
        // Boina estilosa amarela e rosa oficial
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px + 3 * s, py + 2 * s, 30 * s, 8 * s);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(px + 5 * s, py + 1 * s, 26 * s, 7 * s);
        // Faixa e botão rosa da boina
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(px + 4 * s, py + 8 * s, 28 * s, 2 * s);
        ctx.fillRect(px + 17 * s, py + 0 * s, 3 * s, 2 * s);
        break;

      case 'vitor_sonic':
        // Espinhos azuis arrepiados estilo Sonic
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(px + 5 * s, py + 3 * s, 26 * s, 10 * s);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(px + 6 * s, py + 2 * s, 24 * s, 9 * s);
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(px + 8 * s, py + 2 * s, 16 * s, 3 * s);
        // Espinhos laterais
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(px + 1 * s, py + 3 * s, 6 * s, 7 * s);
        ctx.fillRect(px + 29 * s, py + 3 * s, 6 * s, 7 * s);
        // Óculos ciano oficial
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px + 9 * s, py + 13 * s, 8 * s, 3 * s);
        ctx.fillRect(px + 19 * s, py + 13 * s, 8 * s, 3 * s);
        break;

      case 'vitor_mario':
        // Boné vermelho com aba e emblema branco
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(px + 4 * s, py + 4 * s, 28 * s, 9 * s);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 5 * s, py + 3 * s, 26 * s, 8 * s);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 7 * s, py + 3 * s, 20 * s, 3 * s);
        // Aba do boné
        ctx.fillRect(px + 2 * s, py + 9 * s, 32 * s, 3 * s);
        // Círculo branco no boné
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 15 * s, py + 4 * s, 6 * s, 5 * s);
        // Bigode característico
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 11 * s, py + 21 * s, 14 * s, 4 * s);
        break;

      case 'julya':
        // Cabelo estilizado
        ctx.fillStyle = '#312e81';
        ctx.fillRect(px + 6 * s, py + 4 * s, 24 * s, 8 * s);
        ctx.fillRect(px + 5 * s, py + 8 * s, 4 * s, 16 * s);
        ctx.fillRect(px + 27 * s, py + 8 * s, 4 * s, 16 * s);
        // Headphones rosa e lilás oficiais
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(px + 8 * s, py + 2 * s, 20 * s, 3 * s); // Arco
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(px + 2 * s, py + 12 * s, 5 * s, 10 * s); // Concha E
        ctx.fillRect(px + 29 * s, py + 12 * s, 5 * s, 10 * s); // Concha D
        break;

      case 'junior':
        // Boné marrom virado para trás com costuras
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px + 5 * s, py + 4 * s, 26 * s, 8 * s);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 7 * s);
        // Aba virada para trás
        ctx.fillRect(px + 22 * s, py + 5 * s, 11 * s, 4 * s);
        // Munhequeira verde-limão já no corpo
        break;

      case 'clarinha':
        // Tranças neon de dança
        ctx.fillStyle = '#db2777';
        ctx.fillRect(px + 5 * s, py + 4 * s, 13 * s, 7 * s);
        ctx.fillRect(px + 3 * s, py + 9 * s, 5 * s, 18 * s);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(px + 18 * s, py + 4 * s, 13 * s, 7 * s);
        ctx.fillRect(px + 28 * s, py + 9 * s, 5 * s, 18 * s);
        // Headset gamer oficial com microfone
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(px + 8 * s, py + 2 * s, 20 * s, 3 * s); // Arco
        ctx.fillStyle = '#db2777';
        ctx.fillRect(px + 2 * s, py + 12 * s, 4 * s, 9 * s); // Concha E
        ctx.fillRect(px + 30 * s, py + 12 * s, 4 * s, 9 * s); // Concha D
        // Haste do microfone descendo até a boca
        ctx.fillStyle = '#64748b';
        ctx.fillRect(px + 28 * s, py + 18 * s, 2 * s, 5 * s);
        ctx.fillRect(px + 23 * s, py + 22 * s, 6 * s, 2 * s);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(px + 21 * s, py + 21 * s, 3 * s, 3 * s);
        break;

      case 'taynara':
        // Cabelo afro volumoso e esculpido
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(px + 3 * s, py + 1 * s, 30 * s, 12 * s);
        ctx.fillRect(px + 2 * s, py + 6 * s, 7 * s, 22 * s);
        ctx.fillRect(px + 27 * s, py + 6 * s, 7 * s, 22 * s);
        // Coroa de flores tropicais oficial
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px + 6 * s, py + 6 * s, 24 * s, 3 * s); // Folhagem
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 7 * s, py + 4 * s, 4 * s, 4 * s);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px + 14 * s, py + 4 * s, 4 * s, 4 * s);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(px + 21 * s, py + 4 * s, 4 * s, 4 * s);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(px + 26 * s, py + 4 * s, 3 * s, 4 * s);
        break;

      case 'matheus':
        // Corte degrade navalhado impecável
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 8 * s);
        ctx.fillRect(px + 5 * s, py + 7 * s, 3 * s, 8 * s);
        ctx.fillRect(px + 28 * s, py + 7 * s, 3 * s, 8 * s);
        // Sobrancelhas alinhadas
        ctx.fillRect(px + 10 * s, py + 13 * s, 6 * s, 2 * s);
        ctx.fillRect(px + 20 * s, py + 13 * s, 6 * s, 2 * s);
        // Corrente de prata visível no pescoço
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(px + 14 * s, py + 26 * s, 8 * s, 2 * s);
        ctx.fillRect(px + 16 * s, py + 28 * s, 4 * s, 2 * s);
        break;

      case 'emily':
        // Cabelo castanho com presilha artesanal
        ctx.fillStyle = '#451a03';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 9 * s);
        ctx.fillRect(px + 4 * s, py + 8 * s, 5 * s, 16 * s);
        ctx.fillRect(px + 27 * s, py + 8 * s, 5 * s, 16 * s);
        // Presilha artesanal oficial na franja
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(px + 8 * s, py + 6 * s, 5 * s, 4 * s);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(px + 9 * s, py + 7 * s, 3 * s, 2 * s);
        break;

      case 'lais':
        // Cabelo longo místico
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(px + 5 * s, py + 3 * s, 26 * s, 9 * s);
        ctx.fillRect(px + 3 * s, py + 8 * s, 6 * s, 20 * s);
        ctx.fillRect(px + 27 * s, py + 8 * s, 6 * s, 20 * s);
        // Tiara mística roxa com safira ciano
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(px + 6 * s, py + 6 * s, 24 * s, 4 * s);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(px + 7 * s, py + 5 * s, 22 * s, 2 * s);
        // Gema prismática central
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px + 16 * s, py + 4 * s, 4 * s, 4 * s);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 17 * s, py + 5 * s, 2 * s, 2 * s);
        break;

      default:
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 6 * s, py + 3 * s, 24 * s, 8 * s);
        break;
    }
  }

  // =========================================================================
  // RENDERIZAÇÃO 16-BITS DOS 3 CHEFÕES DA CAMPANHA
  // =========================================================================

  drawBoss(ctx, boss, animTime) {
    const { x, y, width, height, state, currentAttack, isHurt, isEnraged, phase, bossId } = boss;

    ctx.save();
    this.prepareContext(ctx);

    const bx = Math.round(x);
    const by = Math.round(y);

    // Efeito de flash ao tomar dano
    if (isHurt && Math.floor(animTime * 24) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Aura enfurecida na Fase 2 e Fase 3
    if (phase === 'PHASE_2' || phase === 'PHASE_3') {
      ctx.save();
      const auraColor = phase === 'PHASE_3' ? '#ff0055' : (bossId === 'chefao_trafico' ? '#8b5cf6' : '#ffbe0b');
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = phase === 'PHASE_3' ? 24 : 14;
      ctx.strokeStyle = phase === 'PHASE_3' ? 'rgba(255, 0, 85, 0.7)' : 'rgba(255, 190, 11, 0.5)';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx - 4, by - 4, width + 8, height + 8);
      ctx.restore();
    }

    const breatheOffset = Math.sin(animTime * 4.5) * 2.5;

    // Despacha para o chefe específico da campanha
    if (bossId === 'bandido') {
      this._drawBossBandido(ctx, boss, bx, by, breatheOffset, isEnraged, animTime);
    } else if (bossId === 'chefao_trafico') {
      this._drawBossChefaoTrafico(ctx, boss, bx, by, breatheOffset, isEnraged, animTime);
    } else {
      this._drawBossSindico(ctx, boss, bx, by, breatheOffset, isEnraged, animTime);
    }

    ctx.restore();
  }

  // --- CHEFE 1: O SÍNDICO DO PARQUE COLUMBIA ---
  _drawBossSindico(ctx, boss, bx, by, breatheOffset, isEnraged, animTime) {
    const { state, currentAttack, width, height } = boss;

    // 1. Sapatos sociais Oxford pretos com brilho e solado
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 16, by + 162, 46, 18);
    ctx.fillRect(bx + 78, by + 162, 46, 18);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + 18, by + 160, 42, 6);
    ctx.fillRect(bx + 80, by + 160, 42, 6);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx + 24, by + 162, 8, 3);
    ctx.fillRect(bx + 86, by + 162, 8, 3);

    // 2. Calça social cinza de cós alto com vinco
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + 22, by + 115, 38, 48);
    ctx.fillRect(bx + 80, by + 115, 38, 48);

    ctx.fillStyle = '#334155';
    ctx.fillRect(bx + 24, by + 115, 34, 46);
    ctx.fillRect(bx + 82, by + 115, 34, 46);

    ctx.fillStyle = '#475569';
    ctx.fillRect(bx + 40, by + 116, 2, 44);
    ctx.fillRect(bx + 98, by + 116, 2, 44);

    // Cinto de couro com fivela dourada
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 18, by + 107, 104, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(bx + 62, by + 106, 16, 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bx + 66, by + 109, 8, 6);

    // 3. Camisa Polo Mostarda com suspensórios
    const poloColor = isEnraged ? '#e11d48' : '#eab308';
    const poloShadow = isEnraged ? '#9f1239' : '#ca8a04';
    const poloHighlight = isEnraged ? '#f43f5e' : '#fef08a';

    ctx.fillStyle = poloShadow;
    ctx.fillRect(bx + 16, by + 48 + breatheOffset, 108, 62);
    ctx.fillStyle = poloColor;
    ctx.fillRect(bx + 18, by + 48 + breatheOffset, 104, 58);
    ctx.fillStyle = poloHighlight;
    ctx.fillRect(bx + 26, by + 50 + breatheOffset, 88, 4);

    // Suspensórios pretos com fivelas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 34, by + 48 + breatheOffset, 10, 60);
    ctx.fillRect(bx + 96, by + 48 + breatheOffset, 10, 60);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx + 33, by + 90 + breatheOffset, 12, 6);
    ctx.fillRect(bx + 95, by + 90 + breatheOffset, 12, 6);

    // 4. Cabeça, Óculos Azuis e Careca
    const headY = by + 6 + breatheOffset;
    ctx.fillStyle = isEnraged ? '#f87171' : '#f59e0b';
    ctx.fillRect(bx + 30, headY, 80, 46);
    ctx.fillStyle = isEnraged ? '#fca5a5' : '#fed7aa';
    ctx.fillRect(bx + 32, headY + 2, 76, 42);

    // Penteado lateral comb-over
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + 26, headY + 6, 8, 34);
    ctx.fillRect(bx + 106, headY + 6, 8, 34);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx + 36, headY + 2, 68, 3);

    // Vapor dos ouvidos
    if (isEnraged) {
      const steamShift = Math.sin(animTime * 18) * 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(bx + 18 + steamShift, headY + 10, 6, 6);
      ctx.fillRect(bx + 116 - steamShift, headY + 10, 6, 6);
    }

    // Óculos gigantes com lentes azuis
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 38, headY + 12, 28, 18);
    ctx.fillRect(bx + 74, headY + 12, 28, 18);
    ctx.fillRect(bx + 66, headY + 17, 8, 5);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bx + 41, headY + 15, 22, 12);
    ctx.fillRect(bx + 77, headY + 15, 22, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 45, headY + 17, 4, 4);
    ctx.fillRect(bx + 81, headY + 17, 4, 4);

    // Bigode
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + 48, headY + 30, 44, 8);

    // 5. Prancheta de Multas
    ctx.fillStyle = '#451a03';
    ctx.fillRect(bx - 10, by + 66 + breatheOffset, 32, 46);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx - 4, by + 72 + breatheOffset, 22, 36);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(bx - 2, by + 76 + breatheOffset, 18, 4);

    // 6. Chave Inglesa de 24 polegadas
    const wrenchAngle = (state === 'preparacao' && currentAttack === 'chave_inglesa')
      ? -Math.PI / 2.8
      : (state === 'ataque' && currentAttack === 'chave_inglesa')
      ? Math.PI / 3.2
      : Math.sin(animTime * 3) * 0.08;

    ctx.save();
    ctx.translate(bx + 130, by + 68 + breatheOffset);
    ctx.rotate(wrenchAngle);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-5, -6, 10, 64);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-13, -34, 26, 26);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -28, 14, 16);
    ctx.restore();
  }

  // --- CHEFE 2: O BANDIDO (FASE 2) ---
  _drawBossBandido(ctx, boss, bx, by, breatheOffset, isEnraged, animTime) {
    const { state, currentAttack, facingLeft, activeAttack } = boss;

    // Efeito de rastro/afterimage durante Investida Relâmpago
    if (state === 'ataque' && activeAttack?.isDashing) {
      const trailDir = facingLeft ? 24 : -24;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.fillRect(bx + trailDir, by + 20, 80, 130);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
      ctx.fillRect(bx + trailDir * 2, by + 20, 80, 130);
    }

    // 1. Botas táticas de combate pretas
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 14, by + 144, 36, 16);
    ctx.fillRect(bx + 60, by + 144, 36, 16);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx + 16, by + 142, 32, 4);
    ctx.fillRect(bx + 62, by + 142, 32, 4);

    // 2. Calça cargo tática cinza grafite com bolsos laterais
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx + 18, by + 98, 30, 48);
    ctx.fillRect(bx + 62, by + 98, 30, 48);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx + 20, by + 98, 26, 46);
    ctx.fillRect(bx + 64, by + 98, 26, 46);
    // Bolsos táticos
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 14, by + 108, 8, 14);
    ctx.fillRect(bx + 88, by + 108, 8, 14);

    // 3. Regata esportiva preta e vermelha / Jaqueta urbana
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 16, by + 42 + breatheOffset, 78, 58);
    ctx.fillStyle = isEnraged ? '#ef4444' : '#dc2626';
    ctx.fillRect(bx + 20, by + 44 + breatheOffset, 70, 54);
    // Faixa diagonal esportiva
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 28, by + 48 + breatheOffset, 8, 50);

    // 4. Cabeça, Bandana Urbana e Cicatriz
    const headY = by + 4 + breatheOffset;
    // Pele morena sombreada
    ctx.fillStyle = '#8d5b4c';
    ctx.fillRect(bx + 26, headY, 58, 40);
    ctx.fillStyle = '#b07d62';
    ctx.fillRect(bx + 28, headY + 2, 54, 36);

    // Bandana vermelha amarrada para trás com nó e pontas esvoaçantes
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(bx + 24, headY, 62, 14);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bx + 26, headY + 1, 58, 11);
    // Pontas da bandana esvoaçando
    const bandWave = Math.sin(animTime * 8) * 3;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(bx + 82, headY + 4 + bandWave, 16, 6);
    ctx.fillRect(bx + 92, headY + 8 + bandWave, 12, 5);

    // Olhos ferozes e focados
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 34, headY + 16, 12, 6);
    ctx.fillRect(bx + 56, headY + 16, 12, 6);
    ctx.fillStyle = isEnraged ? '#ef4444' : '#0f172a';
    ctx.fillRect(bx + 38, headY + 17, 6, 5);
    ctx.fillRect(bx + 60, headY + 17, 6, 5);

    // Cicatriz vertical no olho esquerdo
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(bx + 40, headY + 12, 2, 14);

    // 5. Braço esquerdo com Navalha / Faca de caça
    ctx.fillStyle = '#b07d62';
    ctx.fillRect(bx + 6, by + 48 + breatheOffset, 14, 36);
    // Lâmina de aço brilhante da navalha
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(bx - 6, by + 76 + breatheOffset, 16, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx - 10, by + 78 + breatheOffset, 18, 4);

    // 6. Braço direito com Corrente de Ferro enrolada
    ctx.fillStyle = '#b07d62';
    ctx.fillRect(bx + 90, by + 48 + breatheOffset, 14, 36);
    // Elos de corrente em aço
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(bx + 88, by + 56 + breatheOffset, 18, 5);
    ctx.fillRect(bx + 88, by + 66 + breatheOffset, 18, 5);
    ctx.fillRect(bx + 88, by + 76 + breatheOffset, 18, 5);
    // Ponta da corrente pendurada
    ctx.fillRect(bx + 98, by + 82 + breatheOffset, 6, 26);
  }

  // --- CHEFE 3: O CHEFÃO DO TRÁFICO (FASE 3 / FINAL) ---
  _drawBossChefaoTrafico(ctx, boss, bx, by, breatheOffset, isEnraged, animTime) {
    const { state, currentAttack, facingLeft } = boss;

    // 1. Sapatos sociais pretos lustrados com bico fino
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 18, by + 168, 44, 17);
    ctx.fillRect(bx + 68, by + 168, 44, 17);
    ctx.fillStyle = '#00f3ff';
    ctx.fillRect(bx + 22, by + 169, 10, 2);
    ctx.fillRect(bx + 72, by + 169, 10, 2);

    // 2. Calça social risca de giz preta/roxa profunda
    ctx.fillStyle = '#1e1135';
    ctx.fillRect(bx + 22, by + 116, 38, 54);
    ctx.fillRect(bx + 70, by + 116, 38, 54);
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(bx + 24, by + 116, 34, 52);
    ctx.fillRect(bx + 72, by + 116, 34, 52);
    // Risca de giz sutil
    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.fillRect(bx + 32, by + 118, 1, 48);
    ctx.fillRect(bx + 80, by + 118, 1, 48);

    // Cinto com fivela dourada pesada
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 18, by + 108, 94, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(bx + 58, by + 106, 16, 13);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 63, by + 109, 6, 6);

    // 3. Sobretudo / Terno de Mafia com golas largas e camisa de seda
    ctx.fillStyle = '#0f051d';
    ctx.fillRect(bx + 14, by + 46 + breatheOffset, 102, 64);
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(bx + 16, by + 48 + breatheOffset, 98, 60);

    // Lapelas largas roxas com realce magenta
    ctx.fillStyle = '#581c87';
    ctx.fillRect(bx + 18, by + 48 + breatheOffset, 22, 54);
    ctx.fillRect(bx + 90, by + 48 + breatheOffset, 22, 54);

    // Camisa de seda preta entreaberta no peito
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 50, by + 52 + breatheOffset, 30, 48);

    // Corrente grossa de ouro maciço com medalhão
    ctx.fillStyle = '#eab308';
    ctx.fillRect(bx + 48, by + 56 + breatheOffset, 34, 6);
    ctx.fillRect(bx + 52, by + 62 + breatheOffset, 26, 6);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(bx + 60, by + 68 + breatheOffset, 10, 10); // Medalhão dourado

    // 4. Cabeça, Óculos Escuros de Aviador e Charuto Cubano
    const headY = by + 6 + breatheOffset;
    ctx.fillStyle = '#8d5b4c';
    ctx.fillRect(bx + 34, headY, 62, 42);
    ctx.fillStyle = '#b07d62';
    ctx.fillRect(bx + 36, headY + 2, 58, 38);

    // Cabelo preto bem penteado para trás (slicked back)
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 32, headY, 66, 10);
    ctx.fillRect(bx + 30, headY + 8, 8, 24);
    ctx.fillRect(bx + 92, headY + 8, 8, 24);

    // Óculos escuros aviador estilo Don Corleone
    ctx.fillStyle = '#020617';
    ctx.fillRect(bx + 42, headY + 12, 22, 14);
    ctx.fillRect(bx + 66, headY + 12, 22, 14);
    ctx.fillRect(bx + 62, headY + 16, 6, 3);
    // Reflexo roxo/neon nos óculos
    ctx.fillStyle = isEnraged ? '#ff0055' : '#8b5cf6';
    ctx.fillRect(bx + 44, headY + 14, 8, 4);
    ctx.fillRect(bx + 68, headY + 14, 8, 4);

    // Barba cerrada / cavanhaque elegante
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx + 52, headY + 32, 26, 6);
    ctx.fillRect(bx + 58, headY + 38, 14, 4);

    // Charuto cubano com ponta acesa em brasa e fumaça
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bx + 74, headY + 32, 18, 5);
    ctx.fillStyle = '#f97316'; // Brasa acesa
    ctx.fillRect(bx + 90, headY + 32, 4, 5);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bx + 92, headY + 33, 2, 3);

    // Puffs de fumaça cinza subindo do charuto
    const smokeY = headY + 22 - (Math.sin(animTime * 6) * 6);
    ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
    ctx.fillRect(bx + 94, smokeY, 6, 6);
    ctx.fillRect(bx + 98, smokeY - 8, 8, 8);

    // 5. Mão Direita com Pistola Pesada de Ouro / Bengala Nobre
    ctx.fillStyle = '#b07d62';
    ctx.fillRect(bx + 6, by + 56 + breatheOffset, 14, 38);
    // Pistola Pesada Cromada / Ouro
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(bx - 12, by + 82 + breatheOffset, 22, 12);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(bx - 14, by + 80 + breatheOffset, 24, 6);
    ctx.fillRect(bx - 16, by + 82 + breatheOffset, 6, 8);
  }

  // =========================================================================
  // RENDERIZAÇÃO 16-BITS DOS 16 PERSONAGENS JOGÁVEIS COM ANIMAÇÃO COMPLETA
  // =========================================================================

  drawPlayer(ctx, player, animTime) {
    const { x, y, width, height, charId, facingRight, state, isInvulnerable, isCrouching, abilityActive } = player;

    ctx.save();
    this.prepareContext(ctx);

    // Piscar durante invulnerabilidade
    if (isInvulnerable && Math.floor(animTime * 20) % 2 === 0) {
      ctx.globalAlpha = 0.35;
    }

    const px = Math.round(x);
    const py = Math.round(y);
    const flip = !facingRight;

    // Se estiver no Modo Sonic (Vitor), renderiza a esfera azul giratória
    if (charId === 'vitor_sonic' && abilityActive) {
      this.drawSonicSpinDash(ctx, px, py, width, height, animTime);
      ctx.restore();
      return;
    }

    // Se for João com Kart ativo
    if (charId === 'joao' && abilityActive) {
      this.drawJoaoKart(ctx, px, py, width, height, animTime, flip);
      ctx.restore();
      return;
    }

    // Se for Julya com Motinha ativa
    if (charId === 'julya' && abilityActive) {
      this.drawJulyaMotinha(ctx, px, py, width, height, animTime, flip);
      ctx.restore();
      return;
    }

    // Se for Matheus Invisível
    if (charId === 'matheus' && abilityActive) {
      ctx.globalAlpha = 0.28;
    }

    ctx.save();
    if (flip) {
      ctx.translate(px + width, py);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(px, py);
    }

    // Ciclo de corrida de 4 frames
    const walkFrame = Math.floor(animTime * 12) % 4;
    const isMoving = state === 'run';
    const isJumping = state === 'jump';
    const isFalling = state === 'fall';
    const isAttacking = state === 'attack';
    const isCrouch = isCrouching;

    // Offsets de animação articular
    let legL = 0;
    let legR = 0;
    let bobY = 0;

    if (isMoving) {
      if (walkFrame === 0) { legL = -6; legR = 6; bobY = 0; }
      else if (walkFrame === 1) { legL = -2; legR = 2; bobY = 2; }
      else if (walkFrame === 2) { legL = 6; legR = -6; bobY = 0; }
      else { legL = 2; legR = -2; bobY = -2; }
    } else if (isJumping) {
      legL = -8; legR = -4; bobY = -4;
    } else if (isFalling) {
      legL = 4; legR = 6; bobY = 2;
    }

    const crouchShift = isCrouch ? 16 : 0;
    const bodyY = crouchShift + bobY;

    // Paletas de cores sombreadas
    const { skinBase, skinShadow } = this._getSkinPalette(charId);
    const { torsoBase, torsoHighlight, torsoShadow } = this._getTorsoPalette(charId);
    const { legsBase, legsShadow } = this._getLegsPalette(charId);
    const shoeColor = this._getShoeColor(charId);

    // 1. Pernas com joelho articulado e calçados
    ctx.fillStyle = legsShadow;
    ctx.fillRect(8, 52 + bodyY, 11, isJumping ? 18 : 24 - legL);
    ctx.fillRect(25, 52 + bodyY, 11, isJumping ? 18 : 24 - legR);

    ctx.fillStyle = legsBase;
    ctx.fillRect(10, 52 + bodyY, 8, isJumping ? 16 : 22 - legL);
    ctx.fillRect(27, 52 + bodyY, 8, isJumping ? 16 : 22 - legR);

    // Sapatos com sola destacada
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(6, 74 + bodyY - (isJumping ? 4 : legL / 2), 15, 6);
    ctx.fillRect(23, 74 + bodyY - (isJumping ? 4 : legR / 2), 15, 6);

    ctx.fillStyle = shoeColor;
    ctx.fillRect(6, 72 + bodyY - (isJumping ? 4 : legL / 2), 14, 4);
    ctx.fillRect(23, 72 + bodyY - (isJumping ? 4 : legR / 2), 14, 4);

    // 2. Tronco e Roupa com Sombreamento em 3 Tons
    ctx.fillStyle = torsoShadow;
    ctx.fillRect(8, 28 + bodyY, 28, isCrouch ? 20 : 26);
    ctx.fillStyle = torsoBase;
    ctx.fillRect(9, 28 + bodyY, 25, isCrouch ? 19 : 24);
    ctx.fillStyle = torsoHighlight;
    ctx.fillRect(11, 29 + bodyY, 21, 3);

    // Emblemas e Detalhes de Peito
    this._drawChestDetails(ctx, charId, bodyY);

    // 3. Cabeça, Rosto e 2 Olhos Expressivos Integrados com Acessórios Oficiais
    this._drawPlayerFaceAndHead(ctx, charId, skinBase, skinShadow, bodyY, animTime);

    // 4. Braços e Golpes Específicos de Cada Lutador
    if (isAttacking) {
      this._drawCharacterBasicAttack(ctx, charId, player.attackType, skinBase, torsoBase, bodyY, animTime);
    } else {
      const armSwing = isMoving ? legL : 0;
      ctx.fillStyle = skinShadow;
      ctx.fillRect(2, 30 + bodyY + armSwing, 8, 20);
      ctx.fillStyle = skinBase;
      ctx.fillRect(34, 30 + bodyY - armSwing, 8, 20);

      // Munhequeiras verde-limão de Junior
      if (charId === 'junior') {
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(2, 42 + bodyY + armSwing, 8, 5);
        ctx.fillRect(34, 42 + bodyY - armSwing, 8, 5);
      }
    }

    ctx.restore();

    // Efeitos ativos
    if (charId === 'di5' && player.shieldActive) {
      this.drawDi5Shield(ctx, px, py, width, height, animTime);
    }
    if (charId === 'nalu' && abilityActive) {
      this.drawNaluAura(ctx, px, py, width, height, animTime);
    }

    ctx.restore();
  }

  _getSkinPalette(charId) {
    switch (charId) {
      case 'matheus':
      case 'taynara':
        return { skinBase: '#6d4c41', skinShadow: '#4e342e' };
      case 'wendel':
      case 'junior':
        return { skinBase: '#b07d62', skinShadow: '#8d5b4c' };
      default:
        return { skinBase: '#fed7aa', skinShadow: '#d97706' };
    }
  }

  _getTorsoPalette(charId) {
    switch (charId) {
      case 'di5':
        // Moletom Verde Oficial de Di5
        return { torsoBase: '#15803d', torsoHighlight: '#22c55e', torsoShadow: '#14532d' };
      case 'muniz':
        return { torsoBase: '#0f172a', torsoHighlight: '#1e293b', torsoShadow: '#020617' };
      case 'beatriz':
        return { torsoBase: '#0284c7', torsoHighlight: '#38bdf8', torsoShadow: '#0369a1' };
      case 'nalu':
        return { torsoBase: '#f59e0b', torsoHighlight: '#fef08a', torsoShadow: '#b45309' };
      case 'douglas':
        // Camisa Rubra Oficial de Douglas
        return { torsoBase: '#991b1b', torsoHighlight: '#dc2626', torsoShadow: '#7f1d1d' };
      case 'emily':
        return { torsoBase: '#ea580c', torsoHighlight: '#fb923c', torsoShadow: '#9a3412' };
      case 'lais':
        return { torsoBase: '#7e22ce', torsoHighlight: '#a855f7', torsoShadow: '#581c87' };
      case 'wendel':
        return { torsoBase: '#15803d', torsoHighlight: '#22c55e', torsoShadow: '#166534' };
      case 'vitor_mario':
        return { torsoBase: '#dc2626', torsoHighlight: '#ef4444', torsoShadow: '#991b1b' };
      case 'taynara':
        return { torsoBase: '#166534', torsoHighlight: '#22c55e', torsoShadow: '#14532d' };
      case 'clarinha':
        return { torsoBase: '#db2777', torsoHighlight: '#f472b6', torsoShadow: '#9d174d' };
      case 'junior':
        return { torsoBase: '#78350f', torsoHighlight: '#d97706', torsoShadow: '#451a03' };
      default:
        return { torsoBase: '#2563eb', torsoHighlight: '#60a5fa', torsoShadow: '#1d4ed8' };
    }
  }

  _getLegsPalette(charId) {
    switch (charId) {
      case 'vitor_mario':
        return { legsBase: '#1d4ed8', legsShadow: '#1e3a8a' };
      case 'wendel':
        return { legsBase: '#f8fafc', legsShadow: '#cbd5e1' };
      default:
        return { legsBase: '#1e293b', legsShadow: '#0f172a' };
    }
  }

  _getShoeColor(charId) {
    switch (charId) {
      case 'vitor_sonic': return '#ef4444';
      case 'wendel': return '#eab308';
      case 'vitor_mario': return '#78350f';
      default: return '#0f172a';
    }
  }

  _drawChestDetails(ctx, charId, bodyY) {
    if (charId === 'muniz') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(9, 28 + bodyY);
      ctx.lineTo(26, 52 + bodyY);
      ctx.lineTo(32, 52 + bodyY);
      ctx.lineTo(15, 28 + bodyY);
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(17, 36 + bodyY, 4, 4);
    } else if (charId === 'vitor_mario') {
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(11, 38 + bodyY, 7, 16);
      ctx.fillRect(26, 38 + bodyY, 7, 16);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(13, 44 + bodyY, 4, 4);
      ctx.fillRect(28, 44 + bodyY, 4, 4);
    } else if (charId === 'douglas') {
      // Detalhe de bainha/cinto de couro transversal e camisa rubra
      ctx.fillStyle = '#451a03';
      ctx.fillRect(10, 31 + bodyY, 24, 3);
      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(20, 31 + bodyY, 4, 3);
    } else if (charId === 'matheus') {
      // Corrente prateada estilosa brilhando no peito
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(16, 28 + bodyY, 12, 2);
      ctx.fillRect(19, 30 + bodyY, 6, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(21, 32 + bodyY, 2, 2);
    } else if (charId === 'di5') {
      // Cordões brancos e bolso canguru do moletom verde
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(18, 29 + bodyY, 2, 6);
      ctx.fillRect(24, 29 + bodyY, 2, 6);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(13, 41 + bodyY, 18, 9);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(14, 42 + bodyY, 16, 2);
    } else if (charId === 'wendel') {
      // Listras esportivas brancas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 34 + bodyY, 24, 2);
      ctx.fillRect(10, 39 + bodyY, 24, 2);
    }
  }

  // =========================================================================
  // ROSTO, CABEÇA E DOIS OLHOS EXPRESSIVOS PARA TODOS OS 16 PERSONAGENS
  // =========================================================================

  _drawPlayerFaceAndHead(ctx, charId, skinBase, skinShadow, bodyY, animTime) {
    // 1. Base da cabeça e mandíbula com volume e sombreamento
    ctx.fillStyle = skinShadow;
    ctx.fillRect(10, 8 + bodyY, 24, 22);
    ctx.fillStyle = skinBase;
    ctx.fillRect(11, 8 + bodyY, 22, 20);

    // 2. Renderização Base dos DOIS OLHOS (Dois olhos distintos, proporcionais e com pupilas/brilho)
    const isSunglasses = charId === 'muniz' || charId === 'di5';
    
    if (!isSunglasses) {
      // OLHO ESQUERDO (traseiro em perspectiva 3/4)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 14 + bodyY, 5, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(15, 15 + bodyY, 3, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(16, 15 + bodyY, 1, 1);

      // Sobrancelha esquerda
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(13, 12 + bodyY, 6, 2);

      // OLHO DIREITO (frontal em perspectiva 3/4)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(22, 14 + bodyY, 6, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(24, 15 + bodyY, 3, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(25, 15 + bodyY, 1, 1);

      // Sobrancelha direita
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(21, 12 + bodyY, 7, 2);
    }

    // Nariz e Boca expressivos
    ctx.fillStyle = skinShadow;
    ctx.fillRect(27, 20 + bodyY, 2, 3);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(23, 24 + bodyY, 4, 2);

    // 3. Acessórios e Cabelos Oficiais Específicos
    switch (charId) {
      case 'di5':
        // Cabelo preto texturizado
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(9, 3 + bodyY, 26, 6);
        ctx.fillRect(8, 7 + bodyY, 4, 8);
        // FAIXA CIANO OFICIAL NA TESTA
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(9, 8 + bodyY, 25, 4);
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(9, 11 + bodyY, 25, 1);
        // Nó da faixa atrás
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(6, 10 + bodyY, 4, 6);
        // Óculos escuros retangulares com brilho duplo e DOIS OLHOS visíveis atrás
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(13, 13 + bodyY, 7, 6);
        ctx.fillRect(21, 13 + bodyY, 8, 6);
        ctx.fillRect(19, 15 + bodyY, 3, 2); // Ponte
        // Bordas ciano dos óculos
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(13, 13 + bodyY, 7, 1);
        ctx.fillRect(21, 13 + bodyY, 8, 1);
        // Reflexo nos dois vidros
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(14, 14 + bodyY, 2, 2);
        ctx.fillRect(23, 14 + bodyY, 3, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(15, 15 + bodyY, 1, 1);
        ctx.fillRect(25, 15 + bodyY, 1, 1);
        break;

      case 'wendel':
        // Boné vermelho oficial virado para trás
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(8, 3 + bodyY, 27, 9);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(9, 2 + bodyY, 25, 8);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(12, 1 + bodyY, 18, 3);
        // Aba do boné virada para trás (lado esquerdo)
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(4, 7 + bodyY, 6, 4);
        // Cabelo rente
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(9, 10 + bodyY, 3, 5);
        break;

      case 'muniz':
        // Cabelo preto alinhado
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(9, 3 + bodyY, 25, 7);
        ctx.fillRect(8, 7 + bodyY, 4, 8);
        // Óculos escuros estilo Vasco com armação amarela oficial
        ctx.fillStyle = '#eab308';
        ctx.fillRect(12, 12 + bodyY, 8, 8);
        ctx.fillRect(21, 12 + bodyY, 9, 8);
        ctx.fillStyle = '#020617';
        ctx.fillRect(13, 13 + bodyY, 6, 6);
        ctx.fillRect(22, 13 + bodyY, 7, 6);
        // Ponte dourada
        ctx.fillStyle = '#facc15';
        ctx.fillRect(19, 15 + bodyY, 3, 2);
        // Reflexo nos DOIS vidros
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(14, 14 + bodyY, 2, 2);
        ctx.fillRect(23, 14 + bodyY, 3, 2);
        break;

      case 'joao':
        // Capuz vermelho oficial contornando rosto
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(7, 2 + bodyY, 29, 11);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(8, 2 + bodyY, 27, 9);
        ctx.fillRect(6, 8 + bodyY, 6, 20);
        ctx.fillRect(30, 8 + bodyY, 5, 18);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(11, 4 + bodyY, 22, 3);
        // Fones de ouvido de corrida nos lados
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(5, 12 + bodyY, 4, 10);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(6, 14 + bodyY, 2, 6);
        break;

      case 'douglas':
        // Bandana ciano na testa
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(9, 3 + bodyY, 25, 6);
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(9, 7 + bodyY, 25, 3);
        // Barba cheia pixel art cobrindo mandíbula e queixo
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(11, 19 + bodyY, 5, 8);
        ctx.fillRect(27, 19 + bodyY, 5, 8);
        ctx.fillRect(14, 22 + bodyY, 15, 6);
        // Bigode volumoso
        ctx.fillRect(16, 21 + bodyY, 12, 3);
        // Sobrancelhas grossas de guerreiro
        ctx.fillRect(13, 12 + bodyY, 6, 2);
        ctx.fillRect(21, 12 + bodyY, 7, 2);
        break;

      case 'nalu':
        // Cabelo loiro exuberante com mechas caindo nos ombros
        ctx.fillStyle = '#eab308';
        ctx.fillRect(7, 3 + bodyY, 28, 12);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(8, 2 + bodyY, 26, 10);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(10, 2 + bodyY, 20, 3);
        // Mechas longas nos ombros
        ctx.fillStyle = '#fde047';
        ctx.fillRect(4, 10 + bodyY, 8, 26);
        ctx.fillRect(31, 10 + bodyY, 7, 24);
        // Laço de cabelo rosa e lilás oficial
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(24, 0 + bodyY, 8, 5);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(26, 1 + bodyY, 4, 3);
        // Brilho duplo nos olhos cintilantes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(17, 17 + bodyY, 1, 1);
        ctx.fillRect(26, 17 + bodyY, 1, 1);
        break;

      case 'beatriz':
        // Cabelo castanho suave
        ctx.fillStyle = '#451a03';
        ctx.fillRect(8, 7 + bodyY, 26, 6);
        ctx.fillRect(6, 11 + bodyY, 5, 14);
        // Boina estilosa amarela e rosa oficial
        ctx.fillStyle = '#eab308';
        ctx.fillRect(6, 1 + bodyY, 29, 8);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(7, 0 + bodyY, 27, 7);
        // Faixa e botão rosa da boina
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(7, 7 + bodyY, 27, 2);
        ctx.fillRect(20, -1 + bodyY, 3, 2);
        break;

      case 'vitor_sonic':
        // Espinhos azuis arrepiados estilo Sonic
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(6, 2 + bodyY, 28, 12);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(7, 1 + bodyY, 26, 11);
        ctx.fillRect(2, 4 + bodyY, 8, 8);
        ctx.fillRect(34, 4 + bodyY, 8, 8);
        // Óculos ciano oficial
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(13, 13 + bodyY, 7, 2);
        ctx.fillRect(21, 13 + bodyY, 8, 2);
        break;

      case 'vitor_mario':
        // Boné vermelho de encanador com aba e emblema branco
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(5, 2 + bodyY, 34, 11);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(6, 1 + bodyY, 32, 10);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(14, 0 + bodyY, 20, 4);
        // Aba do boné
        ctx.fillRect(3, 8 + bodyY, 34, 3);
        // Círculo branco no boné
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(18, 3 + bodyY, 7, 6);
        // Bigode volumoso oficial
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(17, 21 + bodyY, 14, 4);
        break;

      case 'julya':
        // Cabelo moderno
        ctx.fillStyle = '#312e81';
        ctx.fillRect(8, 3 + bodyY, 26, 8);
        ctx.fillRect(7, 8 + bodyY, 4, 16);
        // Headphones rosa e lilás oficiais
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(10, 1 + bodyY, 22, 3); // Arco
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(4, 12 + bodyY, 5, 10); // Concha E
        ctx.fillRect(31, 12 + bodyY, 4, 10); // Concha D
        break;

      case 'junior':
        // Boné marrom virado para trás
        ctx.fillStyle = '#78350f';
        ctx.fillRect(8, 3 + bodyY, 27, 8);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(9, 2 + bodyY, 25, 7);
        // Aba virada para trás
        ctx.fillRect(4, 6 + bodyY, 6, 4);
        break;

      case 'clarinha':
        // Tranças neon de dança bicolores
        ctx.fillStyle = '#db2777';
        ctx.fillRect(8, 3 + bodyY, 13, 8);
        ctx.fillRect(5, 9 + bodyY, 5, 18);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(20, 3 + bodyY, 14, 8);
        ctx.fillRect(31, 9 + bodyY, 5, 18);
        // Headset gamer oficial
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(10, 1 + bodyY, 22, 3); // Arco
        ctx.fillStyle = '#db2777';
        ctx.fillRect(4, 12 + bodyY, 4, 9); // Concha E
        ctx.fillRect(32, 12 + bodyY, 4, 9); // Concha D
        // Microfone articulado
        ctx.fillStyle = '#64748b';
        ctx.fillRect(30, 18 + bodyY, 2, 5);
        ctx.fillRect(25, 22 + bodyY, 6, 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(23, 21 + bodyY, 3, 3);
        break;

      case 'taynara':
        // Cabelo afro volumoso e esculpido
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(5, 1 + bodyY, 32, 12);
        ctx.fillRect(4, 6 + bodyY, 7, 24);
        ctx.fillRect(30, 6 + bodyY, 7, 24);
        // Coroa de flores tropicais oficial
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(8, 6 + bodyY, 26, 3); // Folhagem
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(9, 4 + bodyY, 4, 4);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(16, 4 + bodyY, 4, 4);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(23, 4 + bodyY, 4, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(28, 4 + bodyY, 3, 4);
        break;

      case 'matheus':
        // Corte degrade navalhado impecável
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(8, 3 + bodyY, 26, 8);
        ctx.fillRect(7, 7 + bodyY, 3, 8);
        ctx.fillRect(31, 7 + bodyY, 3, 8);
        break;

      case 'emily':
        // Cabelo castanho com presilha artesanal
        ctx.fillStyle = '#451a03';
        ctx.fillRect(8, 3 + bodyY, 26, 9);
        ctx.fillRect(6, 8 + bodyY, 5, 16);
        ctx.fillRect(31, 8 + bodyY, 4, 16);
        // Presilha artesanal oficial na franja
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(10, 6 + bodyY, 5, 4);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(11, 7 + bodyY, 3, 2);
        break;

      case 'lais':
        // Cabelo longo místico
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(7, 3 + bodyY, 28, 9);
        ctx.fillRect(5, 8 + bodyY, 6, 20);
        ctx.fillRect(31, 8 + bodyY, 6, 20);
        // Tiara mística roxa com safira ciano
        ctx.fillStyle = '#7e22ce';
        ctx.fillRect(8, 6 + bodyY, 26, 4);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(9, 5 + bodyY, 24, 2);
        // Gema prismática central
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(19, 4 + bodyY, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, 5 + bodyY, 2, 2);
        break;

      default:
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(8, 3 + bodyY, 28, 9);
        break;
    }
  }

  // --- HABILIDADES ESPECÍFICAS DOS PERSONAGENS ---

  drawSonicSpinDash(ctx, x, y, width, height, animTime) {
    const cx = x + width / 2;
    const cy = y + height - 26;
    const radius = 24;

    ctx.save();
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1d4ed8';
    const angle = animTime * 28;
    for (let i = 0; i < 4; i++) {
      const a = angle + (i * Math.PI) / 2;
      const sx = cx + Math.cos(a) * (radius - 5);
      const sy = cy + Math.sin(a) * (radius - 5);
      ctx.fillRect(sx - 4, sy - 4, 8, 8);
    }

    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx - 6, cy - 6, 12, 12);
    ctx.restore();
  }

  drawJoaoKart(ctx, x, y, width, height, animTime, flip) {
    ctx.save();
    const kx = x - 10;
    const ky = y + height - 42;

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(kx, ky + 10, 68, 20);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(kx + (flip ? 0 : 54), ky + 14, 14, 16);

    const wheelFrame = Math.floor(animTime * 20) % 2;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(kx + 8, ky + 22, 16, 16);
    ctx.fillRect(kx + 44, ky + 22, 16, 16);
    ctx.fillStyle = wheelFrame === 0 ? '#94a3b8' : '#e2e8f0';
    ctx.fillRect(kx + 12, ky + 26, 8, 8);
    ctx.fillRect(kx + 48, ky + 26, 8, 8);

    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(kx + 26, ky - 10, 18, 18);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(kx + 22, ky - 16, 26, 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const smokeX = flip ? kx + 60 : kx - 10;
    ctx.fillRect(smokeX, ky + 16, 8, 8);
    ctx.restore();
  }

  drawJulyaMotinha(ctx, x, y, width, height, animTime, flip) {
    ctx.save();
    const mx = x - 8;
    const my = y + height - 48;

    ctx.fillStyle = '#db2777';
    ctx.fillRect(mx + 10, my + 14, 46, 22);

    ctx.fillStyle = '#475569';
    ctx.fillRect(mx + (flip ? 12 : 46), my, 6, 20);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mx + 6, my + 26, 16, 16);
    ctx.fillRect(mx + 42, my + 26, 16, 16);

    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(mx + 22, my - 6, 16, 16);
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(mx + 18, my - 12, 24, 8);
    ctx.restore();
  }

  drawDi5Shield(ctx, x, y, width, height, animTime) {
    ctx.save();
    const cx = x + width / 2;
    const cy = y + height / 2;
    const r = width / 2 + 16;

    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 18;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(168, 85, 247, 0.75)';
    for (let i = 0; i < 6; i++) {
      const a = animTime * 3 + (i * Math.PI) / 3;
      const px = cx + Math.cos(a) * (r + 4);
      const py = cy + Math.sin(a) * (r + 4);
      ctx.fillRect(px - 3, py - 3, 6, 6);
    }
    ctx.restore();
  }

  drawNaluAura(ctx, x, y, width, height, animTime) {
    ctx.save();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
    for (let i = 0; i < 5; i++) {
      const sx = x + (i * 10) + Math.sin(animTime * 6 + i) * 6;
      const sy = y + Math.cos(animTime * 6 + i) * 20;
      ctx.fillRect(sx, sy, 4, 4);
    }
    ctx.restore();
  }

  // =========================================================================
  // PROJÉTEIS EM PIXEL ART
  // =========================================================================

  drawProjectile(ctx, p, animTime) {
    const { x, y, type, vx } = p;
    ctx.save();
    this.prepareContext(ctx);

    const px = Math.round(x);
    const py = Math.round(y);

    switch (type) {
      case 'hamburguer':
        ctx.fillStyle = '#d97706';
        ctx.fillRect(px - 14, py - 10, 28, 8);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(px - 8, py - 8, 3, 3);
        ctx.fillRect(px + 4, py - 8, 3, 3);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px - 16, py - 2, 32, 4);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px - 14, py + 2, 28, 6);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px - 12, py + 4, 24, 3);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(px - 14, py + 8, 28, 6);
        break;

      case 'bola_futebol':
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px - 3, py - 3, 6, 6);
        ctx.fillRect(px - 8, py - 8, 4, 4);
        ctx.fillRect(px + 4, py + 4, 4, 4);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(px - 22, py - 4, 12, 8);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px - 16, py - 2, 8, 4);
        break;

      case 'feixe_prismatico':
        const beamGrad = ctx.createLinearGradient(px, py, px + p.range, py);
        beamGrad.addColorStop(0, '#c084fc');
        beamGrad.addColorStop(0.5, '#38bdf8');
        beamGrad.addColorStop(1, '#f472b6');
        ctx.fillStyle = beamGrad;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 14;
        ctx.fillRect(px, py - 8, p.range, 16);
        break;

      case 'vasco_espirito':
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(px, py - 20, 36, 40);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 14, py - 12, 8, 24);
        ctx.fillRect(px + 6, py - 4, 24, 8);
        break;

      case 'rioqualit':
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fillRect(px, py - 16, 42, 32);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 12, py - 8, 18, 16);
        break;

      case 'coco_vador':
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(px - 5, py - 15, 10, 6);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
        ctx.fillRect(px - 14, py - 16, 4, 4);
        ctx.fillRect(px - 8, py - 22, 4, 4);
        break;

      default:
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px - 6, py - 6, 12, 12);
        break;
    }

    ctx.restore();
  }

  // =========================================================================
  // GOLPES BÁSICOS INDIVIDUAIS DOS 16 COMBATENTES
  // =========================================================================

  _drawCharacterBasicAttack(ctx, charId, attackType, skinBase, torsoBase, bodyY, animTime) {
    switch (charId) {
      case 'douglas': // Corte Duplo de Lâmina
        ctx.fillStyle = skinBase;
        ctx.fillRect(28, 28 + bodyY, 18, 8);
        // Espada de aço reluzente
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(44, 26 + bodyY, 28, 6);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(46, 27 + bodyY, 26, 3);
        ctx.fillStyle = '#06b6d4'; // Guarda e pomo
        ctx.fillRect(42, 22 + bodyY, 4, 14);
        // Rastro cortante em arco ciano
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(46, 29 + bodyY, 24, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
        break;

      case 'di5': // Soco Pesado com punho cerrado blindado
        ctx.fillStyle = skinBase;
        ctx.fillRect(26, 30 + bodyY, 20, 10);
        ctx.fillStyle = '#1e1b4b'; // Luva reforçada
        ctx.fillRect(46, 26 + bodyY, 16, 16);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(58, 30 + bodyY, 6, 8);
        // Linhas de impacto cinético
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(64, 26 + bodyY, 8, 3);
        ctx.fillRect(66, 33 + bodyY, 10, 3);
        ctx.fillRect(64, 40 + bodyY, 8, 3);
        break;

      case 'wendel': // Chute Rápido com Chuteira Verde
        ctx.fillStyle = skinBase;
        ctx.fillRect(24, 32 + bodyY, 14, 8);
        // Perna estendida em chute alto
        ctx.fillStyle = '#15803d';
        ctx.fillRect(26, 54 + bodyY, 24, 10);
        ctx.fillStyle = '#eab308'; // Chuteira
        ctx.fillRect(48, 52 + bodyY, 14, 12);
        // Rastro de velocidade verde
        ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
        ctx.fillRect(60, 56 + bodyY, 12, 4);
        break;

      case 'nalu': // Chute Estrelar com partículas de brilho
        ctx.fillStyle = skinBase;
        ctx.fillRect(24, 32 + bodyY, 14, 8);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(26, 52 + bodyY, 22, 10);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(46, 50 + bodyY, 14, 12);
        // Estrelas de brilho douradas
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(58, 46 + bodyY, 6, 6);
        ctx.fillRect(62, 58 + bodyY, 6, 6);
        break;

      case 'muniz': // Cruzado Esportivo com luva branca e detalhe vascaíno
        ctx.fillStyle = skinBase;
        ctx.fillRect(28, 30 + bodyY, 18, 8);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(44, 26 + bodyY, 14, 14);
        ctx.fillStyle = '#dc2626'; // Cruz vermelha sutil na luva
        ctx.fillRect(49, 29 + bodyY, 4, 8);
        ctx.fillRect(47, 31 + bodyY, 8, 4);
        // Onda de choque branca
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(58, 32 + bodyY, 10, 4);
        break;

      case 'joao': // Chave de Roda Automotiva
        ctx.fillStyle = skinBase;
        ctx.fillRect(26, 30 + bodyY, 16, 8);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(42, 26 + bodyY, 22, 6);
        ctx.fillRect(52, 18 + bodyY, 6, 22);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(40, 28 + bodyY, 6, 10);
        break;

      case 'julya': // Golpe de Capacete Rosa
        ctx.fillStyle = skinBase;
        ctx.fillRect(26, 30 + bodyY, 16, 8);
        ctx.fillStyle = '#db2777';
        ctx.fillRect(42, 24 + bodyY, 18, 18);
        ctx.fillStyle = '#1e293b'; // Viseira
        ctx.fillRect(52, 28 + bodyY, 6, 10);
        break;

      case 'taynara': // Chicote de Raiz Verde que chicoteia para a frente
        ctx.fillStyle = skinBase;
        ctx.fillRect(26, 30 + bodyY, 16, 8);
        ctx.fillStyle = '#166534';
        ctx.fillRect(42, 32 + bodyY, 28, 4);
        ctx.fillRect(66, 36 + bodyY, 14, 4);
        // Folhas verdes no chicote
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(50, 28 + bodyY, 6, 4);
        ctx.fillRect(64, 32 + bodyY, 6, 4);
        break;

      case 'beatriz': // Pulso de Energia Rioqualit
        ctx.fillStyle = skinBase;
        ctx.fillRect(26, 30 + bodyY, 18, 8);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(52, 34 + bodyY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(50, 32 + bodyY, 4, 4);
        break;

      case 'matheus': // Golpe Furtivo com silhueta fantasmagórica
        ctx.fillStyle = '#64748b';
        ctx.fillRect(28, 30 + bodyY, 22, 8);
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(48, 28 + bodyY, 12, 12);
        ctx.fillStyle = '#c084fc'; // Brilho espectral roxo
        ctx.fillRect(58, 30 + bodyY, 8, 4);
        break;

      case 'vitor_mario': // Soco de Plataforma Retrô
        ctx.fillStyle = skinBase;
        ctx.fillRect(24, 26 + bodyY, 14, 8);
        ctx.fillStyle = '#f8fafc'; // Luva branca clássica
        ctx.fillRect(36, 18 + bodyY, 14, 14);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(48, 16 + bodyY, 6, 6);
        break;

      case 'clarinha': // Passinho Rítmico com notas musicais
        ctx.fillStyle = skinBase;
        ctx.fillRect(24, 32 + bodyY, 16, 8);
        ctx.fillStyle = '#db2777';
        ctx.fillRect(26, 52 + bodyY, 20, 10);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(44, 50 + bodyY, 12, 12);
        // Nota musical pixelada
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(54, 38 + bodyY, 4, 8);
        ctx.fillRect(58, 36 + bodyY, 6, 3);
        ctx.fillRect(52, 44 + bodyY, 6, 4);
        break;

      default: // Soco Básico
        ctx.fillStyle = skinBase;
        ctx.fillRect(28, 30 + bodyY, 18, 8);
        ctx.fillStyle = torsoBase;
        ctx.fillRect(44, 28 + bodyY, 12, 12);
        ctx.fillStyle = 'rgba(255, 230, 0, 0.7)';
        ctx.fillRect(54, 30 + bodyY, 8, 4);
        break;
    }
  }

  // =========================================================================
  // PROJÉTEIS EM PIXEL ART
  // =========================================================================

  drawProjectile(ctx, p, animTime) {
    const { x, y, type, projectileType, vx } = p;
    const pType = projectileType || type;

    ctx.save();
    this.prepareContext(ctx);

    const px = Math.round(x);
    const py = Math.round(y);

    switch (pType) {
      case 'hamburguer':
      case 'snack_toss':
        ctx.fillStyle = '#d97706';
        ctx.fillRect(px - 12, py - 8, 24, 6);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px - 14, py - 2, 28, 3);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px - 12, py + 1, 24, 5);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px - 10, py + 3, 20, 2);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(px - 12, py + 6, 24, 5);
        break;

      case 'bola_futebol':
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px - 3, py - 3, 6, 6);
        ctx.fillRect(px - 8, py - 8, 4, 4);
        ctx.fillRect(px + 4, py + 4, 4, 4);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(px - 22, py - 4, 12, 8);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(px - 16, py - 2, 8, 4);
        break;

      case 'feixe_prismatico':
        const beamGrad = ctx.createLinearGradient(px, py, px + (p.range || 400), py);
        beamGrad.addColorStop(0, '#c084fc');
        beamGrad.addColorStop(0.5, '#38bdf8');
        beamGrad.addColorStop(1, '#f472b6');
        ctx.fillStyle = beamGrad;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 14;
        ctx.fillRect(px, py - 8, p.range || 400, 16);
        break;

      case 'prismatic_shot':
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;
        ctx.fillRect(px - 8, py - 8, 16, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(px - 4, py - 4, 8, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px - 2, py - 2, 4, 4);
        break;

      case 'vasco_espirito':
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(px, py - 20, 36, 40);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 14, py - 12, 8, 24);
        ctx.fillRect(px + 6, py - 4, 24, 8);
        break;

      case 'rioqualit':
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fillRect(px, py - 16, 42, 32);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 12, py - 8, 18, 16);
        break;

      case 'coco_vador':
      case 'short_splat':
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(px - 4, py - 14, 8, 5);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
        ctx.fillRect(px - 10, py - 12, 4, 4);
        break;

      default:
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(px - 6, py - 6, 12, 12);
        break;
    }

    ctx.restore();
  }

  // =========================================================================
  // TELEGRAFOS E AVISOS VISUAIS DOS 3 CHEFÕES
  // =========================================================================

  drawBossTelegraph(ctx, boss, animTime) {
    const { x, y, width, height, state, currentAttack, bossId } = boss;
    if (state !== 'preparacao') return;

    ctx.save();
    this.prepareContext(ctx);

    const blink = Math.floor(animTime * 14) % 2 === 0;

    // 1. Telegrafos do Síndico
    if (currentAttack === 'chave_inglesa') {
      const warnWidth = 200;
      const warnX = boss.facingLeft ? x - warnWidth : x + width;
      const warnY = y + 20;

      ctx.fillStyle = blink ? 'rgba(239, 68, 68, 0.38)' : 'rgba(239, 68, 68, 0.16)';
      ctx.fillRect(warnX, warnY, warnWidth, 120);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(warnX, warnY, warnWidth, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('⚠️ GOLPE DE CHAVE!', warnX + 16, warnY + 60);
    } else if (currentAttack === 'reclamacao_condominio') {
      const groundY = 460;
      ctx.fillStyle = blink ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.2)';
      ctx.fillRect(0, groundY - 22, 960, 26);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, groundY - 22, 960, 26);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ PULE! ONDA DE RECLAMAÇÃO NO CHÃO!', 480, groundY - 6);
    } else if (currentAttack === 'multa_surpresa') {
      const targetX = boss.targetAttackX || (x - 300);
      const groundY = 460;
      ctx.fillStyle = blink ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.22)';
      ctx.beginPath();
      ctx.ellipse(targetX, groundY - 6, 60, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SAIA DAQUI!', targetX, groundY - 24);
    }

    // 2. Telegrafos do Bandido
    else if (currentAttack === 'investida_relampago') {
      const groundY = 460;
      ctx.fillStyle = blink ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(40, groundY - 80, 880, 80);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(40, groundY - 80, 880, 80);
      ctx.setLineDash([]);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ INVESTIDA RELÂMPAGO! PREPARE-SE PARA PULAR!', 480, groundY - 35);
    } else if (currentAttack === 'arremesso_faca') {
      const warnY = y + 60;
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(x, warnY);
      ctx.lineTo(boss.facingLeft ? 0 : 960, warnY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ CUIDADO COM A NAVALHA!', boss.facingLeft ? x - 80 : x + width + 80, warnY - 8);
    } else if (currentAttack === 'golpe_corrente') {
      const warnWidth = 240;
      const warnX = boss.facingLeft ? x - warnWidth : x + width;
      ctx.fillStyle = blink ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.18)';
      ctx.fillRect(warnX, y + 30, warnWidth, 100);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(warnX, y + 30, warnWidth, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('⚠️ AÇOITE DE CORRENTE!', warnX + 20, y + 75);
    }

    // 3. Telegrafos do Chefão do Tráfico
    else if (currentAttack === 'dominio_arena') {
      const zoneX = Math.max(30, (boss.targetAttackX || 300) - 180);
      const zoneW = 360;
      const groundY = 460;
      ctx.fillStyle = blink ? 'rgba(217, 70, 239, 0.45)' : 'rgba(217, 70, 239, 0.18)';
      ctx.fillRect(zoneX, 0, zoneW, groundY);
      ctx.strokeStyle = '#d946ef';
      ctx.lineWidth = 3;
      ctx.strokeRect(zoneX, 0, zoneW, groundY);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ DOMÍNIO DA ARENA! ZONA BLOQUEADA!', zoneX + zoneW / 2, groundY - 140);
    } else if (currentAttack === 'investida_capangas') {
      ctx.fillStyle = blink ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.15)';
      ctx.fillRect(0, 460 - 75, 960, 75);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ EMBOSCADA DE CAPANGAS! PULE SOBRE ELES!', 480, 460 - 30);
    } else if (currentAttack === 'disparo_pesado') {
      const warnY = y + 55;
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, warnY);
      ctx.lineTo(boss.facingLeft ? 0 : 960, warnY);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ MIRA A LASER! DISPARO PESADO!', 480, warnY - 10);
    }

    ctx.restore();
  }

  // =========================================================================
  // RENDERIZAÇÃO DOS ATAQUES ATIVOS DOS 3 CHEFÕES
  // =========================================================================

  drawBossActiveAttack(ctx, boss, animTime) {
    const { state, currentAttack, activeAttack } = boss;
    if (state !== 'ataque' || !activeAttack) return;

    ctx.save();
    this.prepareContext(ctx);

    // 1. Ataques Ativos do Síndico
    if (currentAttack === 'reclamacao_condominio' && activeAttack.shockwaveX !== undefined) {
      const sx = activeAttack.shockwaveX;
      const sy = 460 - 60;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(sx, sy + 20, 24, 30);
      ctx.fillRect(sx - 16, sy + 10, 20, 24);
      ctx.fillRect(sx + 10, sy, 22, 28);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('NOTIFICAÇÃO', sx - 8, sy + 36);
      ctx.fillStyle = 'rgba(255, 190, 11, 0.6)';
      ctx.fillRect(sx + 24, 460 - 10, 16, 10);
    } else if (currentAttack === 'multa_surpresa' && activeAttack.fineY !== undefined) {
      const fx = activeAttack.fineX;
      const fy = activeAttack.fineY;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(fx - 40, fy - 50, 80, 70);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.strokeRect(fx - 40, fy - 50, 80, 70);
      ctx.fillStyle = '#dc2626';
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MULTA R$ 5.000', fx, fy - 18);
      ctx.font = '10px monospace';
      ctx.fillText('PARQUE COLUMBIA', fx, fy - 4);
    }

    // 2. Ataques Ativos do Bandido
    else if (currentAttack === 'arremesso_faca' && activeAttack.knifeX !== undefined) {
      const kx = activeAttack.knifeX;
      const ky = activeAttack.knifeY;
      ctx.save();
      ctx.translate(kx, ky);
      ctx.rotate(animTime * 25);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-12, -3, 24, 6);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-14, -2, 6, 4);
      ctx.restore();
    } else if (currentAttack === 'golpe_corrente' && activeAttack.hitbox) {
      const hb = activeAttack.hitbox;
      ctx.fillStyle = '#cbd5e1';
      for (let cx = hb.x; cx < hb.x + hb.width; cx += 20) {
        ctx.fillRect(cx, hb.y + 35, 14, 6);
      }
    }

    // 3. Ataques Ativos do Chefão do Tráfico
    else if (currentAttack === 'dominio_arena' && activeAttack.zoneX !== undefined) {
      const zx = activeAttack.zoneX;
      const zw = activeAttack.zoneWidth;
      const groundY = 460;
      // Colunas de fogo roxo e lasers no chão
      const fireGrad = ctx.createLinearGradient(0, groundY, 0, groundY - 90);
      fireGrad.addColorStop(0, 'rgba(217, 70, 239, 0.85)');
      fireGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
      fireGrad.addColorStop(1, 'rgba(217, 70, 239, 0)');
      ctx.fillStyle = fireGrad;
      ctx.fillRect(zx, groundY - 90, zw, 90);

      // Faixas de choque no piso
      ctx.fillStyle = '#ffffff';
      for (let lx = zx + 10; lx < zx + zw; lx += 30) {
        ctx.fillRect(lx, groundY - 6, 12, 4);
      }
    } else if (currentAttack === 'investida_capangas') {
      const groundY = 460;
      const c1X = activeAttack.capanga1X;
      const c2X = activeAttack.capanga2X;
      // Capanga 1
      this._drawCapangaShadow(ctx, c1X, groundY - 70, animTime);
      // Capanga 2
      this._drawCapangaShadow(ctx, c2X, groundY - 70, animTime + 0.2);
    } else if (currentAttack === 'disparo_pesado' && activeAttack.bulletX !== undefined) {
      const bx = activeAttack.bulletX;
      const by = activeAttack.bulletY;
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12;
      ctx.fillRect(bx - 12, by - 4, 24, 8);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx - 4, by - 2, 8, 4);
    }

    ctx.restore();
  }

  _drawCapangaShadow(ctx, cx, cy, animTime) {
    ctx.save();
    // Capanga encapuzado em silhueta escura
    ctx.fillStyle = '#090314';
    ctx.fillRect(cx, cy + 20, 34, 34); // Tronco
    ctx.fillRect(cx + 6, cy, 22, 22); // Capuz
    ctx.fillStyle = '#ef4444'; // Olhos vermelhos no capuz
    ctx.fillRect(cx + 10, cy + 8, 4, 4);
    ctx.fillRect(cx + 18, cy + 8, 4, 4);

    // Pernas correndo animadas
    const legStep = Math.sin(animTime * 18) * 8;
    ctx.fillStyle = '#1e1135';
    ctx.fillRect(cx + 4, cy + 54, 10, 16 + legStep);
    ctx.fillRect(cx + 20, cy + 54, 10, 16 - legStep);
    ctx.restore();
  }

  // =========================================================================
  // CENÁRIOS PARALLAX DAS 3 FASES DA CAMPANHA
  // =========================================================================

  renderArenaBackground(ctx, theme = 'parque_columbia', animTime = 0) {
    this.prepareContext(ctx);

    if (theme === 'beco_noturno') {
      this._renderArenaBecoNoturno(ctx, animTime);
    } else if (theme === 'cobertura_qg') {
      this._renderArenaCoberturaQG(ctx, animTime);
    } else {
      this._renderArenaParqueColumbia(ctx, animTime);
    }
  }

  _renderArenaParqueColumbia(ctx, animTime) {
    // 1. Céu Noturno Urbano
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 460);
    skyGrad.addColorStop(0, '#04020a');
    skyGrad.addColorStop(0.55, '#120524');
    skyGrad.addColorStop(1, '#2c0b47');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 460);

    // Lua crescente
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(820, 70, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0314';
    ctx.beginPath();
    ctx.arc(815, 68, 14, 0, Math.PI * 2);
    ctx.fill();

    // Prédios ao fundo
    const buildings = [
      { x: 30, width: 95, height: 260 },
      { x: 145, width: 85, height: 320 },
      { x: 250, width: 110, height: 240 },
      { x: 380, width: 125, height: 360 },
      { x: 525, width: 90, height: 280 },
      { x: 635, width: 115, height: 340 },
      { x: 770, width: 130, height: 300 }
    ];

    buildings.forEach((b, idx) => {
      const topY = 460 - b.height;
      ctx.fillStyle = idx % 2 === 0 ? '#100624' : '#190a36';
      ctx.fillRect(b.x, topY, b.width, b.height);

      // Janelas iluminadas
      const cols = Math.floor((b.width - 16) / 24);
      const rows = Math.floor((b.height - 24) / 36);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const randSeed = (r * 7 + c * 13 + Math.floor(b.x)) % 7;
          let winColor = 'rgba(15, 23, 42, 0.9)';
          if (randSeed === 1 || randSeed === 4) winColor = '#fbbf24';
          else if (randSeed === 2) winColor = '#38bdf8';

          const wx = b.x + 8 + c * 24;
          const wy = topY + 16 + r * 36;
          ctx.fillStyle = winColor;
          ctx.fillRect(wx, wy, 12, 16);
        }
      }
    });

    // Poste de Iluminação
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(218, 460 - 140, 6, 140);
    ctx.fillRect(212, 460 - 144, 24, 5);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(220, 460 - 139, 8, 5);

    // Chão de Copacabana e Pista
    this._renderCommonGround(ctx, '#00f3ff');
  }

  _renderArenaBecoNoturno(ctx, animTime) {
    // 1. Céu Noturno Vermelho/Escuro de viela
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 460);
    skyGrad.addColorStop(0, '#0a0204');
    skyGrad.addColorStop(0.5, '#1e0509');
    skyGrad.addColorStop(1, '#3b0b14');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 460);

    // Fios elétricos emaranhados cruzando o beco
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.bezierCurveTo(300, 130, 650, 120, 960, 90);
    ctx.moveTo(0, 110);
    ctx.bezierCurveTo(280, 150, 620, 160, 960, 130);
    ctx.stroke();

    // Muros de tijolos com grafites
    ctx.fillStyle = '#1c0c12';
    ctx.fillRect(20, 120, 360, 340);
    ctx.fillStyle = '#260f18';
    ctx.fillRect(390, 80, 550, 380);

    // Tijolos individuais
    ctx.fillStyle = '#3f1a26';
    for (let by = 130; by < 450; by += 24) {
      for (let bx = 30; bx < 370; bx += 40) {
        ctx.fillRect(bx + ((by / 24) % 2 * 18), by, 32, 10);
      }
    }

    // Grafites nas paredes
    ctx.fillStyle = '#ef4444';
    ctx.font = '900 28px monospace';
    ctx.fillText('AGF 2026', 80, 220);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('ZONA NORTE', 460, 200);

    // Tambor de óleo queimando com chamas pixeladas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(80, 460 - 55, 36, 55);
    ctx.fillStyle = '#f97316';
    const flameY = Math.sin(animTime * 14) * 6;
    ctx.fillRect(86, 460 - 75 + flameY, 24, 22);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(92, 460 - 82 + flameY, 12, 16);

    // Chão de Asfalto com poças e linha neon laranja
    this._renderCommonGround(ctx, '#f97316');
  }

  _renderArenaCoberturaQG(ctx, animTime) {
    // 1. Céu Noturno do Rio de Janeiro
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 460);
    skyGrad.addColorStop(0, '#030108');
    skyGrad.addColorStop(0.5, '#110322');
    skyGrad.addColorStop(1, '#2c0442');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 460);

    // Lua cheia avermelhada no horizonte
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(800, 90, 32, 0, Math.PI * 2);
    ctx.fill();

    // Silhueta das Montanhas Cariocas (Corcovado com Cristo Redentor)
    ctx.fillStyle = '#080212';
    ctx.beginPath();
    ctx.moveTo(350, 460);
    ctx.lineTo(480, 160);
    ctx.lineTo(540, 160);
    ctx.lineTo(660, 460);
    ctx.fill();

    // Estátua do Cristo Redentor iluminada em pixel art
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(507, 130, 6, 30); // Corpo
    ctx.fillRect(495, 138, 30, 5); // Braços abertos
    ctx.fillRect(508, 124, 4, 6); // Cabeça

    // Guarda-corpo de vidro de luxo da cobertura
    ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.fillRect(0, 460 - 60, 960, 60);
    ctx.strokeStyle = '#d946ef';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 460 - 60, 960, 60);

    // Chão de Mármore e Linha Magenta Neon
    this._renderCommonGround(ctx, '#d946ef');
  }

  _renderCommonGround(ctx, neonColor) {
    // Asfalto escuro
    ctx.fillStyle = '#0a0514';
    ctx.fillRect(0, 460, 960, 80);

    // Linha neon da arena
    ctx.fillStyle = neonColor;
    ctx.fillRect(0, 460, 960, 4);

    // Faixas de sinalização
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let x = 0; x < 960; x += 60) {
      ctx.fillRect(x, 460 + 12, 30, 2);
    }
  }
}

