#!/usr/bin/env node
/**
 * LETTER z
 *
 * <path d="M (cx-w) (cy-h)
 *          H (cx+w)
 *          L (cx-w) (cy+h)
 *          H (cx+w)"/>
 *
 * cx  center x of the letter
 * cy  center y of the letter
 * w   half the width  (the letter is 2w wide)
 * h   half the height (the letter is 2h tall)
 *
 * Top bar, diagonal down to the bottom left, bottom bar.
 * All one line, the pen never lifts.
 * Don't end it with Z, that would draw a line back to the start.
 *
 * w = h        square z, same height as the a when both equal r
 * h = 1.5 * w  taller z (the default)
 *
 * node z.mjs --cx 16 --cy 16 --w 8 --h 12
 * node z.mjs --w 6 --h 6 --svg > z.svg
 */

import { parseArgs } from "node:util";

const DEFAULTS = { cx: 16, cy: 16, w: 8, h: 12, stroke: 2 };

const { values } = parseArgs({
  options: {
    cx: { type: "string" },
    cy: { type: "string" },
    w: { type: "string" },
    h: { type: "string" },
    stroke: { type: "string" },
    svg: { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

if (values.help) {
  console.log(
    "Usage: node z.mjs [--cx N] [--cy N] [--w N] [--h N] [--svg] [--stroke N]",
  );
  process.exit(0);
}

// ---------- helpers ----------
function num(name) {
  const raw = values[name];
  if (raw === undefined) return DEFAULTS[name];
  const n = Number(raw);
  if (!Number.isFinite(n)) fail(`--${name} must be a number, got "${raw}"`);
  return n;
}
function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}
const f = (n) => String(+n.toFixed(3));

// ---------- inputs ----------
const cx = num("cx");
const cy = num("cy");
const w = num("w");
const h = num("h");
const stroke = num("stroke");
if (w <= 0) fail("--w must be greater than 0");
if (h <= 0) fail("--h must be greater than 0");

// ---------- path ----------
const d = [
  `M ${f(cx - w)} ${f(cy - h)}`,
  `H ${f(cx + w)}`,
  `L ${f(cx - w)} ${f(cy + h)}`,
  `H ${f(cx + w)}`,
];

const box = { minX: cx - w, minY: cy - h, maxX: cx + w, maxY: cy + h };

// ---------- output ----------
function pathTag(lines, indent, attrs = "") {
  const prefix = `${indent}<path d="`;
  const pad = " ".repeat(prefix.length);
  return `${prefix}${lines.join(`\n${pad}`)}"${attrs}/>`;
}

if (!values.svg) {
  console.log(pathTag(d, ""));
} else {
  const p = stroke;
  const vb = [
    box.minX - p,
    box.minY - p,
    box.maxX - box.minX + 2 * p,
    box.maxY - box.minY + 2 * p,
  ]
    .map(f)
    .join(" ");
  const attrs = ` fill="none" stroke="currentColor" stroke-width="${f(stroke)}" stroke-linecap="round" stroke-linejoin="round"`;
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">`);
  console.log(pathTag(d, "  ", attrs));
  console.log("</svg>");
}
