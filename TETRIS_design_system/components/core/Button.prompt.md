**Button** — the brand's primary call to action; a beveled tetromino block that locks down on press. Use for any commit action; reserve `primary` (cyan) for the single most important action per view.

```jsx
<Button variant="primary" size="lg" onClick={start}>Press Start</Button>
<Button variant="ghost">Read more</Button>
<Button variant="danger" size="sm">Delete</Button>
```

Variants: `primary` (cyan I), `secondary` (slate), `ghost` (outline), `danger` (red Z), `success` (green S), `warning` (orange L), `magic` (purple T). Sizes `sm | md | lg`. Props: `block`, `disabled`, `leftIcon`, `rightIcon`. Label renders in the pixel font, uppercased — keep it to 1–3 words.
