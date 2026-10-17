import { INPUT_BINDINGS } from '../config.js';

export class InputSystem {
  constructor() {
    this.keys = new Set();
    this.touchState = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      attack: false,
      ability: false
    };

    this.onPauseCallback = null;
    this.isListening = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  init(onPause) {
    if (onPause) this.onPauseCallback = onPause;

    if (!this.isListening) {
      window.addEventListener('keydown', this._onKeyDown, { capture: true });
      window.addEventListener('keyup', this._onKeyUp, { capture: true });
      window.addEventListener('blur', this._onBlur);
      this.isListening = true;
    }

    this._setupTouchControls();
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown, { capture: true });
    window.removeEventListener('keyup', this._onKeyUp, { capture: true });
    window.removeEventListener('blur', this._onBlur);
    this.isListening = false;
    this.keys.clear();
  }

  _onBlur() {
    this.keys.clear();
  }

  _onKeyDown(e) {
    // Tecla de Pausa
    if (INPUT_BINDINGS.PAUSE.includes(e.code) || INPUT_BINDINGS.PAUSE.includes(e.key)) {
      if (this.onPauseCallback) this.onPauseCallback();
      e.preventDefault();
      return;
    }

    // Previne que a barra de espaço ou setas rolem a página ou acionem botões com foco
    const preventKeys = ['Space', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (preventKeys.includes(e.code) || preventKeys.includes(e.key)) {
      e.preventDefault();
    }

    // Registra tanto e.code quanto e.key em minúsculo e maiúsculo
    if (e.code) this.keys.add(e.code);
    if (e.key) {
      this.keys.add(e.key);
      this.keys.add(e.key.toLowerCase());
      this.keys.add(e.key.toUpperCase());
    }
  }

  _onKeyUp(e) {
    if (e.code) this.keys.delete(e.code);
    if (e.key) {
      this.keys.delete(e.key);
      this.keys.delete(e.key.toLowerCase());
      this.keys.delete(e.key.toUpperCase());
    }
  }

  _setupTouchControls() {
    const bindTouch = (id, stateKey) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = (e) => {
        if (e.cancelable) e.preventDefault();
        this.touchState[stateKey] = true;
      };
      const end = (e) => {
        if (e.cancelable) e.preventDefault();
        this.touchState[stateKey] = false;
      };
      el.addEventListener('touchstart', start, { passive: false });
      el.addEventListener('touchend', end, { passive: false });
      el.addEventListener('mousedown', start);
      el.addEventListener('mouseup', end);
      el.addEventListener('mouseleave', end);
    };

    bindTouch('touch-left', 'left');
    bindTouch('touch-right', 'right');
    bindTouch('touch-jump', 'jump');
    bindTouch('touch-attack', 'attack');
    bindTouch('touch-ability', 'ability');
  }

  isLeftPressed() {
    if (this.touchState.left) return true;
    return INPUT_BINDINGS.LEFT.some(k => this.keys.has(k) || this.keys.has(k.toLowerCase()));
  }

  isRightPressed() {
    if (this.touchState.right) return true;
    return INPUT_BINDINGS.RIGHT.some(k => this.keys.has(k) || this.keys.has(k.toLowerCase()));
  }

  isJumpPressed() {
    if (this.touchState.jump) return true;
    return INPUT_BINDINGS.JUMP.some(k => this.keys.has(k) || this.keys.has(k.toLowerCase()));
  }

  isCrouchPressed() {
    if (this.touchState.crouch) return true;
    return INPUT_BINDINGS.CROUCH.some(k => this.keys.has(k) || this.keys.has(k.toLowerCase()));
  }

  isBasicAttackPressed() {
    if (this.touchState.attack) return true;
    return INPUT_BINDINGS.BASIC_ATTACK.some(k => this.keys.has(k) || this.keys.has(k.toLowerCase()));
  }

  isAbilityPressed() {
    if (this.touchState.ability) return true;
    return INPUT_BINDINGS.ABILITY.some(k => this.keys.has(k) || this.keys.has(k.toLowerCase()));
  }
}
