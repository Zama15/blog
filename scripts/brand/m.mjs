#!/usr/bin/env node
/*
  LETTER m

  <path d="M (cx-2r) (cy-h)
           V (cy+h) (cy-h-s)
           M (cx-2r) (cy-h)
           A r r 0 0 1 cx (cy-h)
           V (cy+h)
           M cx (cy-h)
           A r r 0 0 1 (cx+2r) (cy-h)
           V (cy+h)"/>

  cx  center x (where the middle stem is)
  cy  center y of the stems
  h   half the stem length (stems go from cy-h down to cy+h)
  r   radius of each arch (the letter is 4r wide)
  s   stem: how far the left stem goes up past where the arches start
        0          no stem (the first V has one value)
        same as r  stem ends level with the top of the arches
        bigger     stem pokes out above the arches

  Arch tops are at cy-h-r. Bottom of the letter is cy+h.

  node m.mjs --cx 16 --cy 16 --h 3 --r 6 --s 6
  node m.mjs --s 8 --svg > m.svg
*/

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    cx: { type: "string", default: "16" },
    cy: { type: "string", default: "16" },
    h: { type: "string", default: "3" },
    r: { type: "string", default: "6" },
    s: { type: "string", default: "0" },
    stroke: { type: "string", default: "2" },
    svg: { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

if (values.help) {
  console.log(
    "Usage: node m.mjs [--cx N] [--cy N] [--h N] [--r N] [--s N] [--svg] [--stroke N]",
  );
  process.exit(0);
}

// Turn each flag into a number, stop if it isn't one
const n = {};
for (const key of ["cx", "cy", "h", "r", "s", "stroke"]) {
  n[key] = Number(values[key]);
  if (!Number.isFinite(n[key])) {
    console.error(`--${key} must be a number`);
    process.exit(1);
  }
}
const { cx, cy, h, r, s, stroke } = n;

if (h <= 0 || r <= 0 || s < 0) {
  console.error("h and r must be greater than 0, s can be 0 or more");
  process.exit(1);
}

// Round to 3 decimals so we don't print 13.099999999998
const f = (x) => String(+x.toFixed(3));

const top = cy - h; // where the arches start
const bottom = cy + h; // baseline
const left = cx - 2 * r;
const right = cx + 2 * r;

// First stem: one value without a stem, two values with one
const firstV = s > 0 ? `V ${f(bottom)} ${f(top - s)}` : `V ${f(bottom)}`;

const d = [
  `M ${f(left)} ${f(top)}`,
  firstV,
  `M ${f(left)} ${f(top)}`,
  `A ${f(r)} ${f(r)} 0 0 1 ${f(cx)} ${f(top)}`,
  `V ${f(bottom)}`,
  `M ${f(cx)} ${f(top)}`,
  `A ${f(r)} ${f(r)} 0 0 1 ${f(right)} ${f(top)}`,
  `V ${f(bottom)}`,
];

if (!values.svg) {
  console.log(`<path d="${d.join("\n         ")}"/>`);
} else {
  // viewBox = letter size plus stroke width as padding on every side
  const highest = top - Math.max(r, s);
  const p = stroke;
  const vb = [
    left - p,
    highest - p,
    right - left + 2 * p,
    bottom - highest + 2 * p,
  ]
    .map(f)
    .join(" ");
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">`);
  console.log(`  <path d="${d.join("\n           ")}"`);
  console.log(
    `        fill="none" stroke="currentColor" stroke-width="${f(stroke)}"`,
  );
  console.log(`        stroke-linecap="round" stroke-linejoin="round"/>`);
  console.log("</svg>");
}
