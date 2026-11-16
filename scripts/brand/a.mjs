#!/usr/bin/env node
/**
 * LETTER a
 *
 * <path d="M (cx-r) cy
 *          A r r 0 1 0 (cx+r) cy
 *          A r r 0 1 0 (cx-r) cy
 *          M (cx+r) (cy-r)
 *          V (cy+r)"/>
 *
 * cx  center x of the circle
 * cy  center y of the circle
 * r   radius of the circle (the stem is as tall as the circle, 2r)
 *
 * The circle is two half circles: one arc can't start and end
 * at the same point, so it takes two.
 * The stem runs down the right side, from cy-r to cy+r.
 *
 * The letter is 2r wide and 2r tall.
 *
 * node a.mjs --cx 16 --cy 16 --r 8
 * node a.mjs --r 6 --svg > a.svg
 */

import { parseArgs } from "node:util";

const DEFAULTS = { cx: 16, cy: 16, r: 8, stroke: 2 };

const { values } = parseArgs({
  options: {
    cx: { type: "string" },
    cy: { type: "string" },
    r: { type: "string" },
    stroke: { type: "string" },
    svg: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help) {
  console.log(
    "Usage: node a.mjs [--cx N] [--cy N] [--r N] [--svg] [--stroke N]",
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
// Round to 3 decimals and drop trailing zeros (avoids 13.099999999998)
const f = (n) => String(+n.toFixed(3));

// ---------- inputs ----------
const cx = num("cx");
const cy = num("cy");
const r = num("r");
const stroke = num("stroke");
if (r <= 0) fail("--r must be greater than 0");

// ---------- path ----------
const d = [
  `M ${f(cx - r)} ${f(cy)}`,
  `A ${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}`,
  `A ${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)}`,
  `M ${f(cx + r)} ${f(cy - r)}`,
  `V ${f(cy + r)}`,
];

const box = { minX: cx - r, minY: cy - r, maxX: cx + r, maxY: cy + r };

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
