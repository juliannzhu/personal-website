/* @ds-bundle: {"format":3,"namespace":"TETRISJULIANNDesignSystem_af17e8","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Tetromino","sourcePath":"components/core/Tetromino.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"5146e700acb2","components/core/Badge.jsx":"17c63df540ec","components/core/Button.jsx":"c2ae33dce5db","components/core/Card.jsx":"fe69b8cca44e","components/core/IconButton.jsx":"d7ad01d9abe1","components/core/ProgressBar.jsx":"4032eb2c563d","components/core/Switch.jsx":"6659311be1f3","components/core/Tag.jsx":"8b6ca527d93f","components/core/Tetromino.jsx":"6c35ce2797a4","components/forms/Input.jsx":"9fee527a1f2f","components/forms/Textarea.jsx":"d215ce789202","components/navigation/Tabs.jsx":"e1d093f7f85d","ui_kits/website/About.jsx":"2cfcdd2b08b3","ui_kits/website/Contact.jsx":"2c378904670d","ui_kits/website/Hero.jsx":"b065405034f2","ui_kits/website/Loader.jsx":"0ba3a5a3996b","ui_kits/website/Nav.jsx":"3aa0bd169317","ui_kits/website/Now.jsx":"a612102abd9b","ui_kits/website/Projects.jsx":"5ad1a5d8d381","ui_kits/website/Tetris.jsx":"83160e2bffb0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TETRISJULIANNDesignSystem_af17e8 = window.TETRISJULIANNDesignSystem_af17e8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-avatar{ display:inline-flex;align-items:center;justify-content:center;
  font-family:var(--font-pixel);color:var(--text-on-piece);overflow:hidden;
  background:var(--av-c,var(--piece-i));
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35);
  border-radius:var(--radius-1); }
.tj-avatar img{ width:100%;height:100%;object-fit:cover;display:block; }
.tj-avatar--round{ border-radius:var(--radius-pill); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'avatar');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}
const PIECE = {
  i: '--piece-i',
  o: '--piece-o',
  t: '--piece-t',
  s: '--piece-s',
  z: '--piece-z',
  j: '--piece-j',
  l: '--piece-l'
};
const SIZES = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96
};

/** Avatar — square block avatar; shows image or pixel-font initials. */
function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  piece = 'i',
  round = false,
  className = '',
  style = {},
  ...rest
}) {
  ensure();
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  const cls = ['tj-avatar', round ? 'tj-avatar--round' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      width: px,
      height: px,
      fontSize: Math.round(px * 0.34),
      '--av-c': `var(${PIECE[piece] || PIECE.i})`,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt
  }) : (initials || '').slice(0, 2).toUpperCase());
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-badge{
  --b: var(--piece-i);
  display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-mono);font-weight:700;font-size:10px;
  letter-spacing:0.12em;text-transform:uppercase;
  padding:4px 8px;color:var(--text-on-piece);background:var(--b);
  border-radius:var(--radius-1);line-height:1;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.3);
}
.tj-badge--solid{}
.tj-badge--outline{ background:transparent; color:var(--b); box-shadow: inset 0 0 0 1.5px var(--b); }
.tj-badge--soft{ background:color-mix(in srgb, var(--b) 18%, var(--ink-900)); color:var(--b); box-shadow:none; }
.tj-badge--i{--b:var(--piece-i)} .tj-badge--o{--b:var(--piece-o)} .tj-badge--t{--b:var(--piece-t)}
.tj-badge--s{--b:var(--piece-s)} .tj-badge--z{--b:var(--piece-z)} .tj-badge--j{--b:var(--piece-j)} .tj-badge--l{--b:var(--piece-l)}
.tj-badge__dot{ width:6px;height:6px;background:currentColor;border-radius:var(--radius-pill); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'badge');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

/** Badge — small mono status pill. Color via `piece` (i/o/t/s/z/j/l). */
function Badge({
  children,
  piece = 'i',
  variant = 'solid',
  dot = false,
  className = '',
  ...rest
}) {
  ensure();
  const cls = ['tj-badge', `tj-badge--${variant}`, `tj-badge--${piece}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "tj-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Inject component CSS once (tokens drive all values). */
const CSS = `
.tj-btn{
  --b: var(--piece-i);
  --b-lit: var(--piece-i-lit);
  --b-dim: var(--piece-i-dim);
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--font-pixel);text-transform:uppercase;letter-spacing:0.02em;
  color:var(--text-on-piece);background:var(--b);
  border:none;border-radius:var(--radius-1);cursor:pointer;
  box-shadow: inset 2px 2px 0 var(--b-lit), inset -2px -2px 0 var(--b-dim), 0 4px 0 rgba(0,0,0,0.45);
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), filter var(--dur-fast);
  user-select:none;white-space:nowrap;
}
.tj-btn:hover{ filter:brightness(1.12); }
.tj-btn:active{ transform:translateY(4px);
  box-shadow: inset 2px 2px 0 var(--b-lit), inset -2px -2px 0 var(--b-dim), 0 0 0 rgba(0,0,0,0.45); }
.tj-btn:focus-visible{ outline:3px solid var(--text-strong); outline-offset:3px; }
.tj-btn--sm{ font-size:10px; padding:9px 14px; }
.tj-btn--md{ font-size:13px; padding:13px 20px; }
.tj-btn--lg{ font-size:16px; padding:17px 28px; }
.tj-btn--secondary{ --b: var(--ink-600); --b-lit: var(--ink-500); --b-dim: var(--ink-1000); color:var(--text-strong); }
.tj-btn--danger{ --b: var(--piece-z); --b-lit: var(--piece-z-lit); --b-dim: var(--piece-z-dim); }
.tj-btn--success{ --b: var(--piece-s); --b-lit: var(--piece-s-lit); --b-dim: var(--piece-s-dim); }
.tj-btn--warning{ --b: var(--piece-l); --b-lit: var(--piece-l-lit); --b-dim: var(--piece-l-dim); }
.tj-btn--magic{ --b: var(--piece-t); --b-lit: var(--piece-t-lit); --b-dim: var(--piece-t-dim); color:var(--text-strong); }
.tj-btn--ghost{ background:transparent; color:var(--b);
  box-shadow: inset 0 0 0 2px var(--b); }
.tj-btn--ghost:hover{ background:color-mix(in srgb, var(--b) 14%, transparent); filter:none; }
.tj-btn--ghost:active{ transform:translateY(2px); }
.tj-btn--block{ width:100%; }
.tj-btn[disabled]{ cursor:not-allowed; filter:grayscale(0.7) brightness(0.6); transform:none; }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'button');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

/**
 * Button — the brand's primary action. A beveled tetromino block that
 * "locks down" on press. Pixel-font label, always uppercase.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}) {
  ensure();
  const variantClass = variant === 'primary' ? '' : `tj-btn--${variant}`;
  const cls = ['tj-btn', `tj-btn--${size}`, variantClass, block ? 'tj-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled
  }, rest), leftIcon, children, rightIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-card{
  position:relative;background:var(--surface-card);
  border:2px solid var(--border-strong);border-radius:var(--radius-1);
  box-shadow: var(--shadow-block);
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur);
}
.tj-card--pad{ padding:var(--space-5); }
.tj-card--interactive{ cursor:pointer; }
.tj-card--interactive:hover{ transform:translateY(-4px); box-shadow:0 10px 0 rgba(0,0,0,0.45); border-color:var(--card-accent,var(--piece-i)); }
.tj-card--interactive:active{ transform:translateY(0); box-shadow:var(--shadow-block); }
.tj-card__bar{ position:absolute;top:-2px;left:-2px;right:-2px;height:6px;background:var(--card-accent,var(--piece-i)); }
.tj-card--accentbar{ padding-top:calc(var(--space-5) + 6px); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'card');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}
const PIECE = {
  i: '--piece-i',
  o: '--piece-o',
  t: '--piece-t',
  s: '--piece-s',
  z: '--piece-z',
  j: '--piece-j',
  l: '--piece-l'
};

/** Card — beveled surface panel with a hard drop shadow. Optional top accent bar. */
function Card({
  children,
  accent,
  interactive = false,
  pad = true,
  accentBar = false,
  className = '',
  style = {},
  ...rest
}) {
  ensure();
  const cls = ['tj-card', pad ? 'tj-card--pad' : '', interactive ? 'tj-card--interactive' : '', accentBar ? 'tj-card--accentbar' : '', className].filter(Boolean).join(' ');
  const ac = accent ? `var(${PIECE[accent] || PIECE.i})` : undefined;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: {
      ...(ac ? {
        '--card-accent': ac
      } : {}),
      ...style
    }
  }, rest), accentBar && /*#__PURE__*/React.createElement("span", {
    className: "tj-card__bar"
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-iconbtn{
  --b: var(--ink-600);
  display:inline-flex;align-items:center;justify-content:center;
  background:var(--b);color:var(--text-strong);border:none;cursor:pointer;
  border-radius:var(--radius-1);
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.18), inset -2px -2px 0 rgba(0,0,0,0.4), 0 3px 0 rgba(0,0,0,0.45);
  transition: transform var(--dur-fast) var(--ease-out), filter var(--dur-fast);
}
.tj-iconbtn:hover{ filter:brightness(1.18); }
.tj-iconbtn:active{ transform:translateY(3px); box-shadow: inset 2px 2px 0 rgba(255,255,255,0.18), inset -2px -2px 0 rgba(0,0,0,0.4); }
.tj-iconbtn:focus-visible{ outline:3px solid var(--piece-i); outline-offset:2px; }
.tj-iconbtn--sm{ width:32px;height:32px;font-size:14px; }
.tj-iconbtn--md{ width:40px;height:40px;font-size:18px; }
.tj-iconbtn--lg{ width:48px;height:48px;font-size:22px; }
.tj-iconbtn--accent{ --b: var(--piece-i); color:var(--text-on-piece); }
.tj-iconbtn--ghost{ background:transparent; box-shadow:none; color:var(--text-muted); }
.tj-iconbtn--ghost:hover{ background:rgba(255,255,255,0.06); color:var(--text-strong); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'iconbutton');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

/** IconButton — square block button holding a single icon/glyph. */
function IconButton({
  children,
  size = 'md',
  variant = 'default',
  label,
  className = '',
  ...rest
}) {
  ensure();
  const v = variant === 'default' ? '' : `tj-iconbtn--${variant}`;
  const cls = ['tj-iconbtn', `tj-iconbtn--${size}`, v, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-progress{ width:100%; }
.tj-progress__track{
  display:flex;gap:3px;padding:4px;background:var(--bg-well);
  border:2px solid var(--border-strong);border-radius:var(--radius-1);
}
.tj-progress__cell{ flex:1;height:var(--cell-h,16px);background:var(--ink-700);
  transition: background var(--dur) var(--ease-snap); }
.tj-progress__cell--on{ background:var(--prog-c,var(--piece-s));
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.35), inset -1px -1px 0 rgba(0,0,0,0.3); }
.tj-progress__meta{ display:flex;justify-content:space-between;margin-top:8px;
  font-family:var(--font-mono);font-size:11px;color:var(--text-muted); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'progress');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}
const PIECE = {
  i: '--piece-i',
  o: '--piece-o',
  t: '--piece-t',
  s: '--piece-s',
  z: '--piece-z',
  j: '--piece-j',
  l: '--piece-l'
};

/** ProgressBar — segmented "stacked block" progress meter. */
function ProgressBar({
  value = 0,
  cells = 10,
  piece = 's',
  label,
  showValue = true,
  cellHeight = 16,
  className = '',
  style = {},
  ...rest
}) {
  ensure();
  const pct = Math.max(0, Math.min(100, value));
  const filled = Math.round(pct / 100 * cells);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tj-progress', className].filter(Boolean).join(' '),
    style: {
      '--prog-c': `var(${PIECE[piece] || PIECE.s})`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "tj-progress__track",
    style: {
      '--cell-h': `${cellHeight}px`
    }
  }, Array.from({
    length: cells
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'tj-progress__cell' + (i < filled ? ' tj-progress__cell--on' : '')
  }))), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    className: "tj-progress__meta"
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", null, pct, "%")));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-switch{ display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-family:var(--font-mono);font-size:12px;color:var(--text-body); user-select:none; }
.tj-switch__track{ position:relative;width:48px;height:24px;background:var(--bg-well);
  border:2px solid var(--border-strong);border-radius:var(--radius-1);transition:background var(--dur); }
.tj-switch__knob{ position:absolute;top:1px;left:1px;width:18px;height:18px;background:var(--ink-400);
  box-shadow: inset 2px 2px 0 rgba(255,255,255,0.25), inset -2px -2px 0 rgba(0,0,0,0.4);
  transition: transform var(--dur) var(--ease-snap), background var(--dur); }
.tj-switch--on .tj-switch__track{ background:color-mix(in srgb, var(--piece-s) 28%, var(--bg-well)); border-color:var(--piece-s); }
.tj-switch--on .tj-switch__knob{ transform:translateX(24px); background:var(--piece-s);
  box-shadow: inset 2px 2px 0 var(--piece-s-lit), inset -2px -2px 0 var(--piece-s-dim); }
.tj-switch--disabled{ opacity:0.45;cursor:not-allowed; }
.tj-switch input{ position:absolute;opacity:0;width:0;height:0; }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'switch');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

/** Switch — toggle styled as a sliding block. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  ...rest
}) {
  ensure();
  const cls = ['tj-switch', checked ? 'tj-switch--on' : '', disabled ? 'tj-switch--disabled' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("label", {
    className: cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "tj-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tj-switch__knob"
  })), /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked, e)
  }, rest)), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-tag{
  display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-mono);font-size:12px;font-weight:500;
  padding:5px 10px;color:var(--text-body);
  background:var(--surface-elevated);
  border:1px solid var(--border-hairline);border-radius:var(--radius-2);
  line-height:1;transition:border-color var(--dur),color var(--dur);
}
.tj-tag::before{ content:""; width:8px;height:8px;background:var(--tag-c,var(--piece-i));
  box-shadow: inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 0 rgba(0,0,0,0.3); }
.tj-tag--interactive{ cursor:pointer; }
.tj-tag--interactive:hover{ border-color:var(--tag-c,var(--piece-i)); color:var(--text-strong); }
.tj-tag--active{ border-color:var(--tag-c,var(--piece-i)); color:var(--text-strong);
  background:color-mix(in srgb, var(--tag-c, var(--piece-i)) 14%, var(--surface-elevated)); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'tag');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}
const PIECE = {
  i: '--piece-i',
  o: '--piece-o',
  t: '--piece-t',
  s: '--piece-s',
  z: '--piece-z',
  j: '--piece-j',
  l: '--piece-l'
};

/** Tag — keyword / skill chip with a colored block marker. */
function Tag({
  children,
  piece = 'i',
  interactive = false,
  active = false,
  className = '',
  style = {},
  ...rest
}) {
  ensure();
  const cls = ['tj-tag', interactive ? 'tj-tag--interactive' : '', active ? 'tj-tag--active' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      '--tag-c': `var(${PIECE[piece] || PIECE.i})`,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/Tetromino.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-tetromino{ display:inline-grid; gap:2px; }
.tj-tetromino__cell{ background:var(--p);
  box-shadow: inset 2px 2px 0 var(--p-lit), inset -2px -2px 0 var(--p-dim); }
.tj-tetromino__cell--empty{ background:transparent;box-shadow:none; }
@keyframes tj-tetromino-bob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.tj-tetromino--bob{ animation: tj-tetromino-bob 2.4s ease-in-out infinite; }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'tetromino');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

// [cells as (col,row)], grid width, grid height
const SHAPES = {
  i: {
    cells: [[0, 0], [1, 0], [2, 0], [3, 0]],
    w: 4,
    h: 1
  },
  o: {
    cells: [[0, 0], [1, 0], [0, 1], [1, 1]],
    w: 2,
    h: 2
  },
  t: {
    cells: [[1, 0], [0, 1], [1, 1], [2, 1]],
    w: 3,
    h: 2
  },
  s: {
    cells: [[1, 0], [2, 0], [0, 1], [1, 1]],
    w: 3,
    h: 2
  },
  z: {
    cells: [[0, 0], [1, 0], [1, 1], [2, 1]],
    w: 3,
    h: 2
  },
  j: {
    cells: [[0, 0], [0, 1], [1, 1], [2, 1]],
    w: 3,
    h: 2
  },
  l: {
    cells: [[2, 0], [0, 1], [1, 1], [2, 1]],
    w: 3,
    h: 2
  }
};

/** Tetromino — a decorative beveled piece rendered from divs. */
function Tetromino({
  piece = 't',
  size = 24,
  bob = false,
  className = '',
  style = {},
  ...rest
}) {
  ensure();
  const shp = SHAPES[piece] || SHAPES.t;
  const filled = new Set(shp.cells.map(([c, r]) => `${c},${r}`));
  const cells = [];
  for (let r = 0; r < shp.h; r++) {
    for (let c = 0; c < shp.w; c++) {
      const on = filled.has(`${c},${r}`);
      cells.push(/*#__PURE__*/React.createElement("div", {
        key: `${c},${r}`,
        className: 'tj-tetromino__cell' + (on ? '' : ' tj-tetromino__cell--empty'),
        style: {
          width: size,
          height: size
        }
      }));
    }
  }
  const cls = ['tj-tetromino', bob ? 'tj-tetromino--bob' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: {
      gridTemplateColumns: `repeat(${shp.w}, ${size}px)`,
      '--p': `var(--piece-${piece})`,
      '--p-lit': `var(--piece-${piece}-lit)`,
      '--p-dim': `var(--piece-${piece}-dim)`,
      ...style
    }
  }, rest), cells);
}
Object.assign(__ds_scope, { Tetromino });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tetromino.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-field{ display:flex;flex-direction:column;gap:6px;font-family:var(--font-body); }
.tj-field__label{ font-family:var(--font-mono);font-size:11px;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--text-muted); }
.tj-input{
  font-family:var(--font-mono);font-size:14px;color:var(--text-strong);
  background:var(--bg-well);border:2px solid var(--border-strong);
  border-radius:var(--radius-2);padding:11px 13px;width:100%;outline:none;
  transition:border-color var(--dur),box-shadow var(--dur);
}
.tj-input::placeholder{ color:var(--text-faint); }
.tj-input:hover{ border-color:var(--ink-300); }
.tj-input:focus{ border-color:var(--piece-i); box-shadow:0 0 0 3px color-mix(in srgb,var(--piece-i) 25%,transparent); }
.tj-input--invalid{ border-color:var(--piece-z); }
.tj-input--invalid:focus{ box-shadow:0 0 0 3px color-mix(in srgb,var(--piece-z) 25%,transparent); }
.tj-field__hint{ font-size:12px;color:var(--text-faint); }
.tj-field__hint--err{ color:var(--piece-z);font-family:var(--font-mono); }
.tj-input[disabled]{ opacity:0.5;cursor:not-allowed; }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'input');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

/** Input — single-line text field with optional label + hint/error. */
function Input({
  label,
  hint,
  error,
  id,
  className = '',
  ...rest
}) {
  ensure();
  const inputId = id || (label ? 'tj-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  const cls = ['tj-input', error ? 'tj-input--invalid' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tj-field__label",
    htmlFor: inputId
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: cls,
    "aria-invalid": !!error
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    className: "tj-field__hint tj-field__hint--err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "tj-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-field{ display:flex;flex-direction:column;gap:6px;font-family:var(--font-body); }
.tj-field__label{ font-family:var(--font-mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted); }
.tj-field__hint{ font-size:12px;color:var(--text-faint); }
.tj-textarea{ font-family:var(--font-body);font-size:14px;color:var(--text-strong);
  background:var(--bg-well);border:2px solid var(--border-strong);border-radius:var(--radius-2);
  padding:12px 13px;width:100%;outline:none;resize:vertical;min-height:96px;line-height:1.6;
  transition:border-color var(--dur),box-shadow var(--dur); }
.tj-textarea::placeholder{ color:var(--text-faint); }
.tj-textarea:focus{ border-color:var(--piece-i); box-shadow:0 0 0 3px color-mix(in srgb,var(--piece-i) 25%,transparent); }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'textarea');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}

/** Textarea — multi-line field matching Input's styling. */
function Textarea({
  label,
  hint,
  id,
  className = '',
  ...rest
}) {
  ensure();
  const tid = id || (label ? 'tj-' + label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "tj-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "tj-field__label",
    htmlFor: tid
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: tid,
    className: ['tj-textarea', className].filter(Boolean).join(' ')
  }, rest)), hint && /*#__PURE__*/React.createElement("span", {
    className: "tj-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tj-tabs{ display:flex;gap:4px;border-bottom:2px solid var(--border-strong); }
.tj-tab{
  font-family:var(--font-pixel);font-size:11px;text-transform:uppercase;letter-spacing:0.02em;
  color:var(--text-muted);background:transparent;border:none;cursor:pointer;
  padding:12px 16px;position:relative;transition:color var(--dur);
  border-top-left-radius:var(--radius-1);border-top-right-radius:var(--radius-1);
}
.tj-tab:hover{ color:var(--text-body); background:rgba(255,255,255,0.04); }
.tj-tab--active{ color:var(--text-on-piece); background:var(--tab-c,var(--piece-i)); }
.tj-tab--active::after{ content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--tab-c,var(--piece-i)); }
.tj-tab:focus-visible{ outline:3px solid var(--text-strong);outline-offset:-3px; }
`;
let injected = false;
function ensure() {
  if (!injected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.setAttribute('data-tj', 'tabs');
    s.textContent = CSS;
    document.head.appendChild(s);
    injected = true;
  }
}
const PIECE = {
  i: '--piece-i',
  o: '--piece-o',
  t: '--piece-t',
  s: '--piece-s',
  z: '--piece-z',
  j: '--piece-j',
  l: '--piece-l'
};

/**
 * Tabs — pixel-label tab strip. Controlled via `value` + `onChange`.
 * `items` = [{ value, label }].
 */
function Tabs({
  items = [],
  value,
  onChange,
  piece = 'i',
  className = '',
  ...rest
}) {
  ensure();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['tj-tabs', className].filter(Boolean).join(' '),
    role: "tablist",
    style: {
      '--tab-c': `var(${PIECE[piece] || PIECE.i})`
    }
  }, rest), items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    role: "tab",
    "aria-selected": value === it.value,
    className: 'tj-tab' + (value === it.value ? ' tj-tab--active' : ''),
    onClick: () => onChange && onChange(it.value)
  }, it.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
/* About screen — bio + skill meters. */
const {
  Card,
  ProgressBar,
  Tag,
  Tetromino,
  Avatar
} = window.TETRISJULIANNDesignSystem_af17e8;
const SKILLS = [{
  name: 'Python',
  value: 90,
  piece: 'o'
}, {
  name: 'C / C++',
  value: 78,
  piece: 'z'
}, {
  name: 'JavaScript / React',
  value: 84,
  piece: 'i'
}, {
  name: 'Algorithms',
  value: 88,
  piece: 't'
}, {
  name: 'Rust',
  value: 52,
  piece: 'l'
}, {
  name: 'Systems',
  value: 64,
  piece: 's'
}];
const TIMELINE = [{
  piece: 'i',
  when: '2024 — now',
  what: 'B.S. Computer Science',
  where: 'State University · GPA 3.9'
}, {
  piece: 's',
  when: 'Summer 2025',
  what: 'SWE Intern',
  where: 'Built internal tooling for a fintech team'
}, {
  piece: 't',
  when: '2024',
  what: 'Hackathon — 1st place',
  where: 'Real-time collab whiteboard'
}];
function SectionTitle({
  kicker,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--piece-i)'
    }
  }, kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 26,
      color: 'var(--text-strong)',
      margin: '14px 0 0',
      textTransform: 'uppercase'
    }
  }, children));
}
function About() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '56px 24px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    kicker: "// Player 1"
  }, "About"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 40,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "JU",
    piece: "t",
    size: "xl"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 16,
      color: 'var(--text-strong)'
    }
  }, "JULIANN"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 8
    }
  }, "cs major \xB7 she/her \xB7 caffeine \u2192 code"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)'
    }
  }, "Hi! I'm Juliann \u2014 a computer science major who treats every problem like a falling tetromino: rotate it, find where it fits, clear the line. I love building things that feel fast and look fun, from systems-level puzzles to playful web apps."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-body)',
      marginTop: 16
    }
  }, "When I'm not stacking commits, you'll find me chasing a high score, sketching UI ideas, or over-engineering my coffee setup."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    piece: "i"
  }, "Open source"), /*#__PURE__*/React.createElement(Tag, {
    piece: "o"
  }, "Puzzle games"), /*#__PURE__*/React.createElement(Tag, {
    piece: "s"
  }, "Coffee"), /*#__PURE__*/React.createElement(Tag, {
    piece: "t"
  }, "Pixel art")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 13,
      color: 'var(--text-strong)',
      margin: '40px 0 20px',
      textTransform: 'uppercase'
    }
  }, "Timeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, TIMELINE.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement(Tetromino, {
    piece: t.piece,
    size: 10
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, t.when), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: 'var(--text-strong)',
      fontWeight: 600,
      marginTop: 2
    }
  }, t.what), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, t.where)))))), /*#__PURE__*/React.createElement(Card, {
    accent: "i",
    accentBar: true
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 12,
      color: 'var(--text-strong)',
      margin: '0 0 20px',
      textTransform: 'uppercase'
    }
  }, "Skill Meter"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, SKILLS.map(s => /*#__PURE__*/React.createElement(ProgressBar, {
    key: s.name,
    value: s.value,
    piece: s.piece,
    label: s.name,
    cells: 12,
    cellHeight: 14
  }))))));
}
Object.assign(window, {
  About,
  SectionTitle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
/* Contact screen — message form + links. */
const {
  Input,
  Textarea,
  Button,
  Card,
  IconButton,
  Tetromino
} = window.TETRISJULIANNDesignSystem_af17e8;
const LINKS = [{
  label: 'GitHub',
  handle: '@juliann',
  icon: 'pixelarticons:github',
  piece: 'i'
}, {
  label: 'Email',
  handle: 'hi@juliann.dev',
  icon: 'pixelarticons:mail',
  piece: 'o'
}, {
  label: 'LinkedIn',
  handle: 'in/juliann',
  icon: 'pixelarticons:briefcase',
  piece: 's'
}, {
  label: 'Resume',
  handle: 'juliann.pdf',
  icon: 'pixelarticons:file',
  piece: 't'
}];
function Contact() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '56px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--piece-i)'
    }
  }, "// Insert coin"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 26,
      color: 'var(--text-strong)',
      margin: '14px 0 0',
      textTransform: 'uppercase'
    }
  }, "Let's Connect")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 32,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    accent: "i",
    accentBar: true
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '32px 0'
    }
  }, /*#__PURE__*/React.createElement(Tetromino, {
    piece: "s",
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 16,
      color: 'var(--piece-s)',
      margin: '20px 0 8px',
      textTransform: 'uppercase'
    }
  }, "Line Cleared!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 15
    }
  }, "Thanks \u2014 I'll get back to you soon."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setSent(false)
  }, "Send Another"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "you@email.com",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    label: "Message",
    placeholder: "What are we building?",
    required: true
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "success",
    type: "submit",
    block: true
  }, "Send Message"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 12,
      color: 'var(--text-strong)',
      margin: '0 0 18px',
      textTransform: 'uppercase'
    }
  }, "Find me"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, LINKS.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 14px',
      textDecoration: 'none',
      background: 'var(--surface-card)',
      border: '2px solid var(--border-strong)',
      borderRadius: 'var(--radius-1)',
      transition: 'border-color 140ms, transform 140ms'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = `var(--piece-${l.piece})`;
      e.currentTarget.style.transform = 'translateX(4px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.transform = 'translateX(0)';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: `var(--piece-${l.piece})`,
      fontSize: 20,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: l.icon
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, l.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      color: 'var(--text-strong)',
      fontSize: 15,
      fontWeight: 600
    }
  }, l.handle)), /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "pixelarticons:chevron-right",
    style: {
      color: 'var(--text-faint)'
    }
  })))))));
}
Object.assign(window, {
  Contact
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
/* Hero / landing screen + decorative falling-blocks background. */
const {
  Button,
  Badge
} = window.TETRISJULIANNDesignSystem_af17e8;
(function injectHeroCSS() {
  if (document.getElementById('tj-hero-css')) return;
  const s = document.createElement('style');
  s.id = 'tj-hero-css';
  s.textContent = `
  @keyframes tj-fall { 0%{ transform:translateY(-120px) rotate(0deg); } 100%{ transform:translateY(820px) rotate(var(--rot,0deg)); } }
  @keyframes tj-blink2 { 0%,55%{opacity:1} 56%,100%{opacity:0.25} }
  .tj-fallpiece{ position:absolute; top:0; opacity:0.16; animation:tj-fall linear infinite; }
  .tj-heroname span{ display:inline-block; }
  .tj-heroname span:hover{ transform:translateY(-6px); transition:transform 120ms var(--ease-snap); }
  .tj-pressstart{ display:inline-flex; align-items:center; gap:12px; cursor:pointer;
    background:none; border:none; padding:6px 8px; font-family:var(--font-pixel); text-transform:uppercase;
    font-size:18px; color:var(--piece-o); letter-spacing:0.06em; text-shadow:0 3px 0 rgba(0,0,0,0.4); }
  .tj-pressstart .tj-ps-label{ animation:tj-blink2 1.1s steps(1) infinite; }
  .tj-pressstart:hover .tj-ps-label{ animation:none; }
  .tj-pressstart:hover{ color:var(--piece-o-lit); }
  .tj-pressstart:active{ transform:translateY(3px); }
  .tj-pressstart .tj-ps-caret{ color:var(--piece-o); }
  .tj-secondary-link{ font-family:var(--font-mono); font-size:12px; font-weight:700; letter-spacing:0.14em;
    text-transform:uppercase; color:var(--text-muted); background:none; border:none; cursor:pointer;
    border-bottom:2px solid transparent; padding:2px 0; transition:color 140ms, border-color 140ms; }
  .tj-secondary-link:hover{ color:var(--piece-i); border-color:var(--piece-i); }
  `;
  document.head.appendChild(s);
})();
function FallingBg() {
  const pieces = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  const drops = [];
  for (let i = 0; i < 14; i++) {
    const p = pieces[i % 7];
    drops.push({
      p,
      left: (i * 7.3 + 3) % 96,
      size: 16 + i % 4 * 6,
      dur: 7 + i % 5 * 2.2,
      delay: -(i * 1.7),
      rot: i % 2 ? 90 : -90
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }
  }, drops.map((d, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: `../../assets/pieces/${d.p}.svg`,
    className: "tj-fallpiece",
    style: {
      left: `${d.left}%`,
      height: d.size,
      '--rot': `${d.rot}deg`,
      animationDuration: `${d.dur}s`,
      animationDelay: `${d.delay}s`
    }
  })));
}
function HudStat({
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.16em',
      color: 'var(--text-faint)',
      textTransform: 'uppercase'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 20,
      color,
      marginTop: 8
    }
  }, value));
}
function Hero({
  onNav
}) {
  const name = 'JULIANN';
  const colors = ['--piece-i', '--piece-o', '--piece-t', '--piece-s', '--piece-z', '--piece-j', '--piece-l'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 680,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    piece: "s",
    dot: true
  }, "Now playing \xB7 CS @ University")), /*#__PURE__*/React.createElement("h1", {
    className: "tj-heroname",
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 'clamp(34px, 7vw, 68px)',
      lineHeight: 1.1,
      textAlign: 'center',
      margin: 0,
      textTransform: 'uppercase',
      letterSpacing: '0.02em'
    }
  }, name.split('').map((ch, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      color: `var(${colors[i % colors.length]})`,
      textShadow: '0 4px 0 rgba(0,0,0,0.4)'
    }
  }, ch))), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      maxWidth: 560,
      margin: '24px auto 0',
      fontSize: 18,
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, "Computer science major, puzzle-solver, and serial block-stacker. I build clean, playful software \u2014 and I clear my lines."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "tj-pressstart",
    onClick: () => onNav('projects')
  }, /*#__PURE__*/React.createElement("span", {
    className: "tj-ps-caret"
  }, "\u25B6"), /*#__PURE__*/React.createElement("span", {
    className: "tj-ps-label"
  }, "Press Start")))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Loader.jsx
try { (() => {
/* Loader — a ~4s Tetris loading screen.
   Real tetromino pieces drop and stack from the bottom up, filling the well
   like a progress bar; at 100% the rows flash white and clear (bottom-up),
   then the screen fades to reveal the page. */

(function injectLoaderCSS() {
  if (document.getElementById('tj-loader-css')) return;
  const s = document.createElement('style');
  s.id = 'tj-loader-css';
  s.textContent = `
  @keyframes tj-loader-blink { 0%,55%{opacity:1} 56%,100%{opacity:0.35} }
  @keyframes tj-piece-drop { 0%{ transform:translateY(-60px); opacity:0; } 70%{ opacity:1; } 100%{ transform:translateY(0); opacity:1; } }
  .tj-piece-group { animation: tj-piece-drop 150ms var(--ease-snap) both; }
  .tj-loader-cell { transition: opacity 200ms linear, transform 200ms var(--ease-snap); }
  `;
  document.head.appendChild(s);
})();

// Tetromino orientations as [col,row] cells (row increases downward).
const TJ_SHAPES = {
  i: {
    color: 'i',
    rots: [[[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3]]]
  },
  o: {
    color: 'o',
    rots: [[[0, 0], [1, 0], [0, 1], [1, 1]]]
  },
  t: {
    color: 't',
    rots: [[[0, 0], [1, 0], [2, 0], [1, 1]], [[1, 0], [0, 1], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [0, 1], [1, 1], [0, 2]]]
  },
  s: {
    color: 's',
    rots: [[[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]]]
  },
  z: {
    color: 'z',
    rots: [[[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [0, 2]]]
  },
  j: {
    color: 'j',
    rots: [[[0, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[1, 0], [1, 1], [0, 2], [1, 2]]]
  },
  l: {
    color: 'l',
    rots: [[[2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [1, 0], [2, 0], [0, 1]], [[0, 0], [1, 0], [1, 1], [1, 2]]]
  }
};

// Deterministically simulate pieces dropping into a W×H well, stacking bottom-up.
function simulateStack(W, H) {
  const grid = Array.from({
    length: H
  }, () => new Array(W).fill(null));
  const heights = new Array(W).fill(0); // filled rows per column (from bottom)
  const placements = [];
  const bag = ['l', 'j', 'i', 's', 't', 'z', 'o'];
  const colHeight = c => heights[c];
  const recompute = c => {
    let h = 0;
    for (let r = H - 1; r >= 0; r--) {
      if (grid[r][c]) {
        h = r + 1;
        break;
      }
    }
    heights[c] = h;
  };
  for (let n = 0; n < 80; n++) {
    const def = TJ_SHAPES[bag[n % bag.length]];
    let best = null;
    def.rots.forEach((cells, ri) => {
      const maxX = Math.max(...cells.map(c => c[0]));
      const maxY = Math.max(...cells.map(c => c[1]));
      const colLowest = {};
      for (const [x, y] of cells) {
        if (colLowest[x] === undefined || y > colLowest[x]) colLowest[x] = y;
      }
      for (let off = 0; off + maxX < W; off++) {
        // landing base row (bounding-box bottom) so the piece rests on the stack
        let base = 0;
        for (const xs in colLowest) {
          const x = +xs;
          const bottomOffset = maxY - colLowest[x];
          const need = colHeight(off + x) - bottomOffset;
          if (need > base) base = need;
        }
        const abs = cells.map(([x, y]) => ({
          col: off + x,
          row: base + (maxY - y)
        }));
        if (abs.some(c => c.row >= H || c.row < 0 || grid[c.row][c.col])) continue;
        // score: prefer low landing + few holes created underneath
        let holes = 0;
        const lowestPerCol = {};
        for (const c of abs) {
          if (lowestPerCol[c.col] === undefined || c.row < lowestPerCol[c.col]) lowestPerCol[c.col] = c.row;
        }
        for (const cs in lowestPerCol) {
          const gap = lowestPerCol[cs] - colHeight(+cs);
          if (gap > 0) holes += gap;
        }
        const top = Math.max(...abs.map(c => c.row));
        const score = top + holes * 5;
        if (!best || score < best.score) best = {
          abs,
          score,
          color: def.color
        };
      }
    });
    if (!best) break;
    for (const c of best.abs) grid[c.row][c.col] = best.color;
    const cols = new Set(best.abs.map(c => c.col));
    cols.forEach(recompute);
    placements.push({
      cells: best.abs,
      color: best.color
    });
    if (Math.max(...heights) >= H) break;
  }
  const maxRow = placements.reduce((m, p) => Math.max(m, ...p.cells.map(c => c.row)), -1);
  return {
    placements,
    maxStack: maxRow + 1
  };
}
function Loader({
  onDone
}) {
  const W = 10,
    H = 12,
    CELL = 30;
  const FILL_MS = 3500,
    FLASH_MS = 180,
    CLEAR_ROW_MS = 42,
    FADE_MS = 320;
  const sim = React.useMemo(() => simulateStack(W, H), []);
  const N = sim.placements.length;
  const [revealed, setRevealed] = React.useState(0);
  const [phase, setPhase] = React.useState('fill'); // fill | clear
  const [flashing, setFlashing] = React.useState(false);
  const [clearedRows, setClearedRows] = React.useState(0);
  const [revealedOverlay, setRevealedOverlay] = React.useState(false);

  // Reveal pieces over FILL_MS (timer-driven so it always completes).
  React.useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const e = Date.now() - start;
      const rev = Math.min(N, Math.round(e / FILL_MS * N));
      setRevealed(rev);
      if (e >= FILL_MS) {
        clearInterval(id);
        setRevealed(N);
        setPhase('clear');
      }
    }, 40);
    return () => clearInterval(id);
  }, [N]);

  // Clear: flash white, wipe rows bottom-up, fade to reveal the page.
  React.useEffect(() => {
    if (phase !== 'clear') return;
    const timers = [];
    setFlashing(true);
    timers.push(setTimeout(() => {
      setFlashing(false);
      for (let r = 0; r < sim.maxStack; r++) {
        timers.push(setTimeout(() => setClearedRows(r + 1), r * CLEAR_ROW_MS));
      }
      const wipe = sim.maxStack * CLEAR_ROW_MS;
      timers.push(setTimeout(() => setRevealedOverlay(true), wipe + 40));
      timers.push(setTimeout(() => onDone && onDone(), wipe + 40 + FADE_MS));
    }, FLASH_MS));
    return () => timers.forEach(clearTimeout);
  }, [phase]);
  const pct = N ? Math.round(revealed / N * 100) : 100;
  const groups = [];
  for (let i = 0; i < revealed; i++) {
    const p = sim.placements[i];
    const cells = p.cells.map((c, ci) => {
      const rowCleared = phase === 'clear' && c.row < clearedRows;
      const white = flashing && !rowCleared;
      return /*#__PURE__*/React.createElement("div", {
        key: ci,
        className: "tj-loader-cell",
        style: {
          position: 'absolute',
          left: c.col * CELL,
          top: (H - 1 - c.row) * CELL,
          width: CELL - 2,
          height: CELL - 2,
          background: white ? 'var(--text-strong)' : `var(--piece-${p.color})`,
          boxShadow: white ? 'none' : 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)',
          opacity: rowCleared ? 0 : 1,
          transform: rowCleared ? 'scaleY(0.08)' : 'scaleY(1)'
        }
      });
    });
    groups.push(/*#__PURE__*/React.createElement("div", {
      key: i,
      className: "tj-piece-group",
      style: {
        position: 'absolute',
        inset: 0
      }
    }, cells));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9000,
      background: 'var(--bg-well)',
      backgroundImage: 'var(--grid-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
      opacity: revealedOverlay ? 0 : 1,
      transition: `opacity ${FADE_MS}ms linear`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 18,
      color: 'var(--text-strong)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      animation: 'tj-loader-blink 1s steps(1) infinite'
    }
  }, "Loading"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: W * CELL,
      height: H * CELL,
      padding: 0,
      background: 'var(--ink-1000)',
      backgroundImage: 'var(--grid-bg)',
      border: '4px solid var(--border-strong)',
      boxShadow: 'var(--shadow-soft)'
    }
  }, groups), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 30,
      color: 'var(--piece-o)',
      textShadow: '0 3px 0 rgba(0,0,0,0.4)'
    }
  }, pct, "%"));
}
Object.assign(window, {
  Loader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Loader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
/* TopNav + Footer for Juliann's site. Composes bundle primitives. */
const {
  IconButton,
  Tetromino
} = window.TETRISJULIANNDesignSystem_af17e8;
const NAV_ITEMS = [{
  id: 'home',
  label: 'Home',
  piece: 'i'
}, {
  id: 'about',
  label: 'About',
  piece: 'o'
}, {
  id: 'projects',
  label: 'Work',
  piece: 's'
}, {
  id: 'now',
  label: 'Now',
  piece: 'l'
}, {
  id: 'contact',
  label: 'Contact',
  piece: 'z'
}];
function Logo({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Tetromino, {
    piece: "t",
    size: 9
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 16,
      color: 'var(--text-strong)',
      textTransform: 'uppercase',
      letterSpacing: '0.02em'
    }
  }, "JULIANN"));
}

/* A nav item rendered as a vertical slot in the Tetris "NEXT" queue:
   a mini-tetromino in its piece color beside a readable pixel label.
   The current page is the "active" piece — lit up; the rest are queued/dim. */
function NextSlot({
  item,
  active,
  onNav
}) {
  const c = `var(--piece-${item.piece})`;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav(item.id),
    title: item.label,
    "aria-current": active ? 'page' : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      width: '100%',
      padding: '15px 18px',
      cursor: 'pointer',
      textAlign: 'left',
      backgroundColor: active ? `color-mix(in srgb, ${c} 20%, var(--bg-well))` : 'var(--bg-well)',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: active ? c : 'var(--border-strong)',
      borderRadius: 'var(--radius-1)',
      boxShadow: active ? `0 0 14px color-mix(in srgb, ${c} 45%, transparent)` : '0 0 0 transparent'
    },
    onMouseEnter: e => {
      if (!active) {
        e.currentTarget.style.borderColor = c;
        e.currentTarget.querySelector('.tj-slot-lbl').style.color = 'var(--text-strong)';
      }
    },
    onMouseLeave: e => {
      if (!active) {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.querySelector('.tj-slot-lbl').style.color = 'var(--text-muted)';
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      filter: active ? 'none' : 'saturate(0.45) brightness(0.85)',
      opacity: active ? 1 : 0.7,
      transition: 'filter 140ms, opacity 140ms'
    }
  }, /*#__PURE__*/React.createElement(Tetromino, {
    piece: item.piece,
    size: 9
  })), /*#__PURE__*/React.createElement("span", {
    className: "tj-slot-lbl",
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 14,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)',
      transition: 'color 140ms'
    }
  }, item.label));
}
function TopNav({
  current,
  onNav
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'color-mix(in srgb, var(--bg-page) 86%, transparent)',
      backdropFilter: 'blur(8px)',
      borderBottom: '2px solid var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      height: 64,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    onClick: () => onNav('home')
  }))), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'fixed',
      top: '50%',
      right: 22,
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 16,
      width: 264,
      background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)',
      backdropFilter: 'blur(8px)',
      border: '2px solid var(--border-strong)',
      borderRadius: 'var(--radius-1)',
      boxShadow: 'var(--shadow-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 13,
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      textAlign: 'center',
      padding: '4px 0 12px',
      borderBottom: '2px solid var(--border-hairline)'
    }
  }, "NEXT"), NAV_ITEMS.map(it => /*#__PURE__*/React.createElement(NextSlot, {
    key: it.id,
    item: it,
    active: current === it.id,
    onNav: onNav
  }))));
}
function Footer({
  onNav
}) {
  const pieces = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '2px solid var(--border-strong)',
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: 8
    }
  }, pieces.map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      flex: 1,
      background: `var(--piece-${p})`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '32px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, "\xA9 2026 JULIANN \xB7 BUILT ONE BLOCK AT A TIME"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "GitHub",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "pixelarticons:github"
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Email",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "pixelarticons:mail"
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "LinkedIn",
    variant: "ghost"
  }, /*#__PURE__*/React.createElement("iconify-icon", {
    icon: "pixelarticons:briefcase"
  })))));
}

/* Full-screen falling-pieces background, inset from the very top and bottom.
   Sits behind all page content (z-index 0). */
(function injectFallCSS() {
  if (document.getElementById('tj-fallfield-css')) return;
  const s = document.createElement('style');
  s.id = 'tj-fallfield-css';
  s.textContent = `
  @keyframes tj-fallfield { 0%{ transform:translateY(-160px) rotate(0deg); } 100%{ transform:translateY(110vh) rotate(var(--rot,90deg)); } }
  .tj-fallfield-piece{ position:absolute; top:0; opacity:0.15; animation:tj-fallfield linear infinite; will-change:transform; }
  `;
  document.head.appendChild(s);
})();
function FallingField() {
  const pieces = ['i', 'o', 't', 's', 'z', 'j', 'l'];
  const drops = [];
  for (let i = 0; i < 18; i++) {
    drops.push({
      p: pieces[i % 7],
      left: (i * 5.6 + 2) % 97,
      size: 18 + i % 4 * 8,
      dur: 9 + i % 6 * 2.3,
      delay: -(i * 1.4),
      rot: i % 2 ? 90 : -90
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'fixed',
      top: 80,
      bottom: 80,
      left: 0,
      right: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }
  }, drops.map((d, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: `../../assets/pieces/${d.p}.svg`,
    className: "tj-fallfield-piece",
    style: {
      left: `${d.left}%`,
      height: d.size,
      '--rot': `${d.rot}deg`,
      animationDuration: `${d.dur}s`,
      animationDelay: `${d.delay}s`
    }
  })));
}
Object.assign(window, {
  TopNav,
  Footer,
  NAV_ITEMS,
  FallingField
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Now.jsx
try { (() => {
/* Now page — what Juliann is currently up to. */
const {
  Card,
  Badge,
  Tag,
  ProgressBar,
  Tetromino
} = window.TETRISJULIANNDesignSystem_af17e8;
const NOW = [{
  piece: 'i',
  label: 'Building',
  text: 'BLOCKDROP v2 — adding online multiplayer and a spectator mode.'
}, {
  piece: 'o',
  label: 'Learning',
  text: 'Rust ownership for real this time. The borrow checker and I are friends now (mostly).'
}, {
  piece: 's',
  label: 'Reading',
  text: '“Designing Data-Intensive Applications” — slowly, with many highlights.'
}, {
  piece: 't',
  label: 'Playing',
  text: 'Tetris Effect: Connected. Chasing a sub-2-minute 40-line sprint.'
}];
function Now() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 860,
      margin: '0 auto',
      padding: '56px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--piece-i)'
    }
  }, "// Current state"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 26,
      color: 'var(--text-strong)',
      margin: '14px 0 0',
      textTransform: 'uppercase'
    }
  }, "Now")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--text-muted)',
      maxWidth: 520,
      lineHeight: 1.6,
      marginBottom: 32
    }
  }, "A snapshot of what's on my board right now. Last updated June 2026.", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      marginLeft: 8,
      verticalAlign: 'middle'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    piece: "s",
    dot: true
  }, "live"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 18
    }
  }, NOW.map(n => /*#__PURE__*/React.createElement(Card, {
    key: n.label,
    accent: n.piece
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Tetromino, {
    piece: n.piece,
    size: 12
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 11,
      color: `var(--piece-${n.piece})`,
      textTransform: 'uppercase',
      marginBottom: 10
    }
  }, n.label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, n.text)))))), /*#__PURE__*/React.createElement(Card, {
    accent: "o",
    accentBar: true,
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 11,
      color: 'var(--text-strong)',
      textTransform: 'uppercase',
      marginBottom: 16
    }
  }, "This week's stats"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 80,
    piece: "i",
    label: "Commits",
    cells: 10,
    cellHeight: 12
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 45,
    piece: "t",
    label: "Sleep",
    cells: 10,
    cellHeight: 12
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 95,
    piece: "o",
    label: "Coffee",
    cells: 10,
    cellHeight: 12
  }))));
}
Object.assign(window, {
  Now
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Now.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Projects.jsx
try { (() => {
/* Projects screen — filterable grid of project cards. */
const {
  Card,
  Tag,
  Button,
  Tetromino
} = window.TETRISJULIANNDesignSystem_af17e8;
const PROJECTS = [{
  title: 'BLOCKDROP',
  piece: 't',
  tagline: 'A modern Tetris clone in the browser',
  tags: ['TypeScript', 'Canvas', 'WebAudio'],
  cat: 'game',
  year: '2025'
}, {
  title: 'PATHFINDER',
  piece: 'i',
  tagline: 'Interactive A* & Dijkstra maze visualizer',
  tags: ['React', 'Algorithms'],
  cat: 'web',
  year: '2025'
}, {
  title: 'SHELLDB',
  piece: 's',
  tagline: 'A tiny relational database written in C',
  tags: ['C', 'Systems'],
  cat: 'systems',
  year: '2024'
}, {
  title: 'COMMITSTREAK',
  piece: 'o',
  tagline: 'GitHub contribution heatmap, reimagined',
  tags: ['Next.js', 'GraphQL'],
  cat: 'web',
  year: '2024'
}, {
  title: 'RAYCASTER',
  piece: 'z',
  tagline: 'A Wolfenstein-style 3D engine from scratch',
  tags: ['C++', 'Graphics'],
  cat: 'systems',
  year: '2024'
}, {
  title: 'STUDYBUDDY',
  piece: 'l',
  tagline: 'Pomodoro + spaced-repetition study app',
  tags: ['React Native', 'SQLite'],
  cat: 'app',
  year: '2023'
}];
const FILTERS = [{
  id: 'all',
  label: 'All',
  piece: 'i'
}, {
  id: 'web',
  label: 'Web',
  piece: 'i'
}, {
  id: 'game',
  label: 'Games',
  piece: 't'
}, {
  id: 'systems',
  label: 'Systems',
  piece: 's'
}, {
  id: 'app',
  label: 'Apps',
  piece: 'l'
}];
function ProjectCard({
  p,
  onOpen
}) {
  return /*#__PURE__*/React.createElement(Card, {
    accent: p.piece,
    interactive: true,
    accentBar: true,
    onClick: onOpen,
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Tetromino, {
    piece: p.piece,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, p.year)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 15,
      color: 'var(--text-strong)',
      margin: '20px 0 0',
      textTransform: 'uppercase'
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: '12px 0 0',
      lineHeight: 1.55,
      flex: 1
    }
  }, p.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 18
    }
  }, p.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t,
    piece: p.piece
  }, t))));
}
function Projects({
  onNav
}) {
  const [filter, setFilter] = React.useState('all');
  const shown = PROJECTS.filter(p => filter === 'all' || p.cat === filter);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '56px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--piece-i)'
    }
  }, "// High scores"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 26,
      color: 'var(--text-strong)',
      margin: '14px 0 0',
      textTransform: 'uppercase'
    }
  }, "Selected Work")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 28
    }
  }, FILTERS.map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f.id,
    piece: f.piece,
    interactive: true,
    active: filter === f.id,
    onClick: () => setFilter(f.id)
  }, f.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20
    }
  }, shown.map(p => /*#__PURE__*/React.createElement(ProjectCard, {
    key: p.title,
    p: p,
    onOpen: () => onNav('contact')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    leftIcon: /*#__PURE__*/React.createElement("iconify-icon", {
      icon: "pixelarticons:github"
    })
  }, "More on GitHub")));
}
Object.assign(window, {
  Projects
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Projects.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Tetris.jsx
try { (() => {
/* HOLD box (left rail) + a playable Tetris 20-LINE SPRINT with time leaderboard.
   The HOLD box mirrors the NEXT rail on the right and only shows on home. */

const {
  Tetromino: TJTetromino,
  Button: TJButton
} = window.TETRISJULIANNDesignSystem_af17e8;

/* ---- piece data ---------------------------------------------------------- */
const TET_PIECES = {
  I: {
    size: 4,
    color: 'i',
    cells: [[0, 1], [1, 1], [2, 1], [3, 1]]
  },
  O: {
    size: 2,
    color: 'o',
    cells: [[0, 0], [1, 0], [0, 1], [1, 1]]
  },
  T: {
    size: 3,
    color: 't',
    cells: [[1, 0], [0, 1], [1, 1], [2, 1]]
  },
  S: {
    size: 3,
    color: 's',
    cells: [[1, 0], [2, 0], [0, 1], [1, 1]]
  },
  Z: {
    size: 3,
    color: 'z',
    cells: [[0, 0], [1, 0], [1, 1], [2, 1]]
  },
  J: {
    size: 3,
    color: 'j',
    cells: [[0, 0], [0, 1], [1, 1], [2, 1]]
  },
  L: {
    size: 3,
    color: 'l',
    cells: [[2, 0], [0, 1], [1, 1], [2, 1]]
  }
};
const TET_KEYS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const rotateCells = (cells, size) => cells.map(([x, y]) => [size - 1 - y, x]);
const shuffled = () => {
  const a = [...TET_KEYS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const COLS = 10,
  ROWS = 20,
  SPRINT_LINES = 20;
const emptyBoard = () => Array.from({
  length: ROWS
}, () => Array(COLS).fill(null));
const spawn = type => {
  const p = TET_PIECES[type];
  return {
    type,
    color: p.color,
    size: p.size,
    cells: p.cells.map(c => [...c]),
    x: Math.floor((COLS - p.size) / 2),
    y: 0
  };
};
const collides = (board, cells, x, y) => cells.some(([cx, cy]) => {
  const bx = x + cx,
    by = y + cy;
  if (bx < 0 || bx >= COLS || by >= ROWS) return true;
  if (by >= 0 && board[by][bx]) return true;
  return false;
});

/* ---- time formatting + leaderboard (sorted by fastest time) -------------- */
const fmtTime = ms => {
  if (ms == null) return '--:--';
  const cs = Math.floor(ms % 1000 / 10);
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000);
  return `${m}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
};
const SCORES_KEY = 'tj-tetris-sprint';
const DEFAULT_SCORES = [{
  name: 'JUL',
  ms: 38200
}, {
  name: 'ADA',
  ms: 45100
}, {
  name: 'NEO',
  ms: 52400
}, {
  name: 'PIX',
  ms: 63800
}, {
  name: 'BIT',
  ms: 78500
}, {
  name: 'CPU',
  ms: 102000
}];
function loadScores() {
  try {
    const s = JSON.parse(localStorage.getItem(SCORES_KEY));
    if (Array.isArray(s) && s.length) return s;
  } catch (e) {}
  return DEFAULT_SCORES;
}
function saveScore(ms) {
  if (!ms) return loadScores();
  const list = [...loadScores().map(r => ({
    name: r.name,
    ms: r.ms
  })), {
    name: 'YOU',
    ms,
    you: true
  }].sort((a, b) => a.ms - b.ms).slice(0, 8);
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(list.map(({
      name,
      ms
    }) => ({
      name,
      ms
    }))));
  } catch (e) {}
  return list;
}

/* ---- mini piece preview -------------------------------------------------- */
function MiniPiece({
  type,
  cell = 13
}) {
  const p = TET_PIECES[type];
  const cellsSet = new Set(p.cells.map(([x, y]) => `${x},${y}`));
  const items = [];
  for (let y = 0; y < p.size; y++) for (let x = 0; x < p.size; x++) {
    const on = cellsSet.has(`${x},${y}`);
    items.push(/*#__PURE__*/React.createElement("div", {
      key: `${x},${y}`,
      style: {
        width: cell,
        height: cell,
        background: on ? `var(--piece-${p.color})` : 'transparent',
        boxShadow: on ? 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'none'
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${p.size}, ${cell}px)`,
      gap: 2
    }
  }, items);
}

/* ---- the game ------------------------------------------------------------ */
const ensureQueue = s => {
  while (s.queue.length < 8) s.queue.push(...shuffled());
};
const freshState = status => {
  const queue = shuffled().concat(shuffled());
  return {
    board: emptyBoard(),
    queue,
    cur: null,
    hold: null,
    canHold: true,
    lines: 0,
    status: status || 'ready',
    startTime: 0,
    finishMs: 0,
    saved: false
  };
};
function TetrisGame({
  onClose
}) {
  const CELL = 20;
  const g = React.useRef(null);
  const [, force] = React.useState(0);
  const [, setClock] = React.useState(0);
  const rerender = () => force(n => n + 1);
  const [scores, setScores] = React.useState(loadScores);
  if (!g.current) g.current = freshState('ready');
  const startGame = () => {
    const s = freshState('playing');
    const t = s.queue.shift();
    ensureQueue(s);
    s.cur = spawn(t);
    s.startTime = Date.now();
    g.current = s;
    setClock(Date.now());
    rerender();
  };
  const lockAndNext = () => {
    const s = g.current;
    s.cur.cells.forEach(([cx, cy]) => {
      const by = s.cur.y + cy,
        bx = s.cur.x + cx;
      if (by >= 0) s.board[by][bx] = s.cur.color;
    });
    let cleared = 0;
    s.board = s.board.filter(row => {
      const full = row.every(c => c);
      if (full) cleared++;
      return !full;
    });
    while (s.board.length < ROWS) s.board.unshift(Array(COLS).fill(null));
    if (cleared) s.lines += cleared;
    if (s.lines >= SPRINT_LINES) {
      s.status = 'won';
      s.finishMs = Date.now() - s.startTime;
      if (!s.saved) {
        s.saved = true;
        setScores(saveScore(s.finishMs));
      }
      return;
    }
    const t = s.queue.shift();
    ensureQueue(s);
    s.cur = spawn(t);
    s.canHold = true;
    if (collides(s.board, s.cur.cells, s.cur.x, s.cur.y)) s.status = 'topout';
  };
  const move = (dx, dy) => {
    const s = g.current;
    if (s.status !== 'playing') return false;
    if (!collides(s.board, s.cur.cells, s.cur.x + dx, s.cur.y + dy)) {
      s.cur.x += dx;
      s.cur.y += dy;
      rerender();
      return true;
    }
    if (dy > 0) {
      lockAndNext();
      rerender();
      return false;
    }
    return false;
  };
  const rotate = () => {
    const s = g.current;
    if (s.status !== 'playing') return;
    const nc = rotateCells(s.cur.cells, s.cur.size);
    for (const k of [0, -1, 1, -2, 2]) {
      if (!collides(s.board, nc, s.cur.x + k, s.cur.y)) {
        s.cur.cells = nc;
        s.cur.x += k;
        rerender();
        return;
      }
    }
  };
  const hardDrop = () => {
    const s = g.current;
    if (s.status !== 'playing') return;
    let d = 0;
    while (!collides(s.board, s.cur.cells, s.cur.x, s.cur.y + d + 1)) d++;
    s.cur.y += d;
    lockAndNext();
    rerender();
  };
  const holdPiece = () => {
    const s = g.current;
    if (s.status !== 'playing' || !s.canHold) return;
    const curType = s.cur.type;
    if (s.hold == null) {
      s.hold = curType;
      const t = s.queue.shift();
      ensureQueue(s);
      s.cur = spawn(t);
    } else {
      const h = s.hold;
      s.hold = curType;
      s.cur = spawn(h);
    }
    s.canHold = false;
    if (collides(s.board, s.cur.cells, s.cur.x, s.cur.y)) s.status = 'topout';
    rerender();
  };

  // gravity loop (constant sprint speed)
  React.useEffect(() => {
    if (g.current.status !== 'playing') return;
    const id = setInterval(() => {
      if (g.current.status === 'playing') move(0, 1);
    }, 800);
    return () => clearInterval(id);
  }, [g.current.status]);

  // timer tick
  React.useEffect(() => {
    if (g.current.status !== 'playing') return;
    const id = setInterval(() => setClock(Date.now()), 50);
    return () => clearInterval(id);
  }, [g.current.status]);

  // keyboard
  React.useEffect(() => {
    const onKey = e => {
      const k = e.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(k)) e.preventDefault();
      if (k === 'Escape') {
        onClose();
        return;
      }
      const st = g.current.status;
      if (st === 'ready') {
        if (k === 'Enter' || k === ' ') startGame();
        return;
      }
      if (st === 'won' || st === 'topout') {
        if (k === 'Enter' || k === ' ') startGame();
        return;
      }
      if (k === 'ArrowLeft') move(-1, 0);else if (k === 'ArrowRight') move(1, 0);else if (k === 'ArrowDown') move(0, 1);else if (k === 'ArrowUp') rotate();else if (k === ' ') hardDrop();else if (k === 'Shift') holdPiece();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const s = g.current;
  const linesLeft = Math.max(0, SPRINT_LINES - s.lines);
  const elapsed = s.status === 'won' ? s.finishMs : s.status === 'playing' ? Date.now() - s.startTime : 0;

  // build display grid (board + ghost + active piece)
  const disp = s.board.map(row => row.slice());
  if (s.cur) {
    let gd = 0;
    while (!collides(s.board, s.cur.cells, s.cur.x, s.cur.y + gd + 1)) gd++;
    s.cur.cells.forEach(([cx, cy]) => {
      const by = s.cur.y + gd + cy,
        bx = s.cur.x + cx;
      if (by >= 0 && !disp[by][bx]) disp[by][bx] = `ghost-${s.cur.color}`;
    });
    s.cur.cells.forEach(([cx, cy]) => {
      const by = s.cur.y + cy,
        bx = s.cur.x + cx;
      if (by >= 0) disp[by][bx] = s.cur.color;
    });
  }
  const cells = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const v = disp[y][x];
    const ghost = typeof v === 'string' && v.startsWith('ghost-');
    const color = ghost ? v.slice(6) : v;
    cells.push(/*#__PURE__*/React.createElement("div", {
      key: `${x},${y}`,
      style: {
        width: CELL,
        height: CELL,
        background: ghost ? 'transparent' : color ? `var(--piece-${color})` : 'rgba(255,255,255,0.015)',
        boxShadow: ghost ? `inset 0 0 0 2px color-mix(in srgb, var(--piece-${color}) 45%, transparent)` : color ? 'inset 2px 2px 0 rgba(255,255,255,0.35), inset -2px -2px 0 rgba(0,0,0,0.35)' : 'inset 0 0 0 1px rgba(255,255,255,0.03)'
      }
    }));
  }
  const panel = {
    background: 'var(--ink-1000)',
    border: '2px solid var(--border-strong)'
  };
  const panelHead = {
    fontFamily: 'var(--font-pixel)',
    fontSize: 10,
    color: 'var(--text-faint)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 12,
    textAlign: 'center'
  };
  const bigStat = (label, val, color) => /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      ...panel,
      padding: '12px 8px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      color: 'var(--text-faint)',
      textTransform: 'uppercase'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 18,
      color,
      marginTop: 8
    }
  }, val));
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,9,0.86)',
      backdropFilter: 'blur(6px)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'stretch',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      width: 92
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: holdPiece,
    title: "Hold (Shift)",
    style: {
      ...panel,
      padding: 12,
      cursor: s.status === 'playing' ? 'pointer' : 'default',
      opacity: s.canHold ? 1 : 0.45,
      borderColor: s.canHold && s.hold ? 'var(--piece-t)' : 'var(--border-strong)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: panelHead
  }, "Hold"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 32
    }
  }, s.hold ? /*#__PURE__*/React.createElement(MiniPiece, {
    type: s.hold
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-faint)'
    }
  }, "SHIFT")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 6,
      background: 'var(--ink-1000)',
      backgroundImage: 'var(--grid-bg)',
      border: '4px solid var(--border-strong)',
      boxShadow: 'var(--shadow-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
      gap: 0
    }
  }, cells), s.status === 'ready' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      background: 'rgba(5,5,9,0.8)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 16,
      color: 'var(--piece-o)',
      textTransform: 'uppercase',
      textShadow: '0 3px 0 rgba(0,0,0,0.5)'
    }
  }, "20-Line Sprint"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)',
      textAlign: 'center',
      maxWidth: 180,
      lineHeight: 1.6
    }
  }, "Clear 20 lines as fast as you can."), /*#__PURE__*/React.createElement(TJButton, {
    size: "md",
    onClick: startGame,
    style: {
      '--b': 'var(--piece-o)',
      '--b-lit': 'var(--piece-o-lit)',
      '--b-dim': 'var(--piece-o-dim)',
      color: 'var(--text-on-piece)'
    }
  }, "Start")), s.status === 'won' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      background: 'rgba(5,5,9,0.86)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 18,
      color: 'var(--piece-s)',
      textTransform: 'uppercase',
      textShadow: '0 3px 0 rgba(0,0,0,0.5)'
    }
  }, "Finish!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 26,
      color: 'var(--piece-o)'
    }
  }, fmtTime(s.finishMs)), /*#__PURE__*/React.createElement(TJButton, {
    variant: "success",
    size: "sm",
    onClick: startGame
  }, "Play Again")), s.status === 'topout' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      background: 'rgba(5,5,9,0.86)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 18,
      color: 'var(--piece-z)',
      textTransform: 'uppercase',
      textShadow: '0 3px 0 rgba(0,0,0,0.5)'
    }
  }, "Top Out"), /*#__PURE__*/React.createElement(TJButton, {
    variant: "danger",
    size: "sm",
    onClick: startGame
  }, "Retry"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      width: COLS * CELL + 12
    }
  }, bigStat('Lines Left', linesLeft, linesLeft === 0 ? 'var(--piece-s)' : 'var(--piece-i)'), bigStat('Time', fmtTime(elapsed), 'var(--piece-o)'))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...panel,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: panelHead
  }, "Next"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, s.queue.slice(0, 5).map((t, i) => /*#__PURE__*/React.createElement(MiniPiece, {
    key: i,
    type: t,
    cell: i === 0 ? 13 : 11
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      lineHeight: 1.8,
      color: 'var(--text-faint)',
      textAlign: 'center'
    }
  }, "\u2190 \u2192 MOVE", /*#__PURE__*/React.createElement("br", null), "\u2191 ROTATE", /*#__PURE__*/React.createElement("br", null), "\u2193 SOFT DROP", /*#__PURE__*/React.createElement("br", null), "SPACE HARD", /*#__PURE__*/React.createElement("br", null), "SHIFT HOLD", /*#__PURE__*/React.createElement("br", null), "ESC QUIT")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 250,
      padding: 18,
      background: 'color-mix(in srgb, var(--ink-1000) 92%, transparent)',
      border: '2px solid var(--border-strong)',
      boxShadow: 'var(--shadow-soft)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 11,
      color: 'var(--text-strong)',
      textTransform: 'uppercase',
      textAlign: 'center',
      paddingBottom: 14,
      borderBottom: '2px solid var(--border-hairline)'
    }
  }, "Fastest Sprints"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      marginTop: 12
    }
  }, scores.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      background: row.you ? 'color-mix(in srgb, var(--piece-i) 16%, transparent)' : 'transparent',
      border: row.you ? '2px solid var(--piece-i)' : '2px solid transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 11,
      color: i === 0 ? 'var(--piece-o)' : 'var(--text-faint)',
      width: 26
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 11,
      color: row.you ? 'var(--piece-i)' : 'var(--text-body)',
      flex: 1
    }
  }, row.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, fmtTime(row.ms))))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 'auto',
      fontFamily: 'var(--font-pixel)',
      fontSize: 10,
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      background: 'transparent',
      border: '2px solid var(--border-strong)',
      padding: '12px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-1)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--piece-z)';
      e.currentTarget.style.color = 'var(--piece-z)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.color = 'var(--text-muted)';
    }
  }, "\u2715 Close [esc]"))));
}

/* ---- HOLD box (left rail of the site) ------------------------------------ */
function HoldBox({
  onPlay
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'fixed',
      top: '50%',
      left: 22,
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: 16,
      width: 224,
      background: 'color-mix(in srgb, var(--ink-1000) 90%, transparent)',
      backdropFilter: 'blur(8px)',
      border: '2px solid var(--border-strong)',
      borderRadius: 'var(--radius-1)',
      boxShadow: 'var(--shadow-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 13,
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      textAlign: 'center',
      padding: '4px 0 12px',
      borderBottom: '2px solid var(--border-hairline)'
    }
  }, "Hold"), /*#__PURE__*/React.createElement("button", {
    onClick: onPlay,
    title: "Play Tetris",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      padding: '20px 14px',
      cursor: 'pointer',
      backgroundColor: 'color-mix(in srgb, var(--piece-t) 20%, var(--bg-well))',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'var(--piece-t)',
      borderRadius: 'var(--radius-1)',
      boxShadow: '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = '0 0 22px color-mix(in srgb, var(--piece-t) 60%, transparent)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = '0 0 14px color-mix(in srgb, var(--piece-t) 45%, transparent)';
    }
  }, /*#__PURE__*/React.createElement(TJTetromino, {
    piece: "t",
    size: 14,
    bob: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-pixel)',
      fontSize: 14,
      color: 'var(--text-strong)',
      textTransform: 'uppercase'
    }
  }, "Play")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-faint)',
      textAlign: 'center',
      lineHeight: 1.6
    }
  }, "20-line sprint \u2014 beat the fastest time"));
}
Object.assign(window, {
  HoldBox,
  TetrisGame
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Tetris.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Tetromino = __ds_scope.Tetromino;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
