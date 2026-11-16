# Brand scripts

One script per letter. Each prints the SVG `<path>` for that letter (or a full SVG with
`--svg`) from a few numbers. They use only Node built-ins and run only when you call them:
`pnpm build` and the Vercel deploy never touch them. The masters in `assets/brand/` are not
served by the site.

## The letters

All flags are numbers. `--stroke` only matters with `--svg`.

| Script  | Draws | Flags (defaults)                                          |
| ------- | ----- | --------------------------------------------------------- |
| `z.mjs` | z     | `--cx 16 --cy 16 --w 8 --h 12 --stroke 2 [--svg]`         |
| `a.mjs` | a     | `--cx 16 --cy 16 --r 8 --stroke 2 [--svg]`                |
| `m.mjs` | m     | `--cx 16 --cy 16 --h 3 --r 6 --s 0 --stroke 2 [--svg]`    |

- `z`: `w` and `h` are half the width and half the height. The pen never lifts.
- `a`: `r` is the radius of the circle. The stem is as tall as the circle (2r).
- `m`: `h` is half the stem length, `r` the radius of each arch (the letter is 4r wide), and
  `s` how far the left stem goes up past where the arches start (`0` none, `r` level with the
  arch tops).

`a.mjs` takes `-h` or `--help`. `z.mjs` and `m.mjs` take only `--help`, because `-h` would
clash with their `--h` flag.

```bash
node scripts/brand/z.mjs --cx 12 --cy 12 --w 6 --h 9
node scripts/brand/a.mjs --cx 24 --cy 17 --r 4
node scripts/brand/m.mjs --cx 38 --cy 19 --h 2 --r 4 --s 4 --svg > /tmp/m.svg
```

## Building a logo

There is no layout script. Place the letters by hand:

1. Run each letter script and copy its `<path d="...">`.
2. Paste it into `assets/brand/logo-*.svg` as a `<path class="line">`.
3. Place it in one of two ways. Pass the final position with `--cx/--cy` and use
   `translate(0 0)` (the examples above do this), or draw it with local coordinates and move it
   with `transform="translate(x y)"` (what `logo-social.svg` does).

## Alignment rules

These are the numbers used in `assets/brand/logo-social.svg` (viewBox `0 0 62 24`).

- Stroke is 1/12 of the Z height in both logos: mark 2 on 24, social 1.5 on 18. Both look
  equally heavy at their own size.
- The Z is `h = 1.5 * w`: mark `w 8 h 12`, social `w 6 h 9`.
- One shared baseline at y 21 and one x-height top at y 13. The "a" circles span 13..21, and
  the "m" arch tops and left stem top sit at 13.
- A 2-unit gap between letters (Z 6..18, a 20..28, m 30..46, a 48..56) and equal margins:
  6 left and right, 3 top and bottom.

## Export

- Social card: export `assets/brand/logo-social.svg` on your machine as a 1200x630 PNG in the
  dark theme (`#212529` background) to `public/og-default.png`. The background must be opaque:
  keep `rx="0"` on the background rect, or the corners come out transparent.
- Favicon set: upload `assets/brand/logo-mark.svg` to the favicon generator and copy the
  result into `public/`. Then bump `faviconVersion` in `src/components/BaseHead.astro` so
  browsers fetch the new files.
