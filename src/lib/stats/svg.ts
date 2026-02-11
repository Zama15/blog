import type { StatsData } from "./data";
import { escapeXML } from "../utils";

export function generateSVG(stats: StatsData): string {
  // We explicitly inline the CSS here to ensure it works on GitHub
  const css = `
    :root {
      --bs-font-monospace:
        SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
      --bs-font-sans-serif:
        system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
        "Noto Sans", "Liberation Sans", Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji";
    }

    * {
      font-family: var(--bs-font-sans-serif);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes growChart {
      from {
        opacity: 0;
        stroke-width: 0;
      }
      to {
        opacity: 1;
        stroke-width: 10;
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .stats-card {
      animation: fadeIn 0.5s ease-out forwards;
    }
    .stats-card__bg {
      fill: #fff;
      stroke: #e9ecef;
      stroke-width: 1;
    }
    .stats-card__divider {
      stroke: #e9ecef;
      stroke-width: 1;
    }
    .stats-card__divider {
      stroke: #e9ecef;
      stroke-width: 1;
      stroke-dasharray: 450;
      stroke-dashoffset: 450;
      animation: drawLine 1s ease-out 0.2s forwards;
    }
    .stats-card__domain,
    .stats-card__title,
    .stats-card__label,
    .stats-card__value,
    .stats-card__chart-title,
    .stats-card__legend-text,
    .stats-card__footer {
      fill: #212529;
    }
    .stats-card__title,
    .stats-card__domain {
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }
    .stats-card__domain {
      font-size: 0.75rem;
      font-family: var(--bs-font-monospace);
      animation-delay: 0.1s;
    }
    .stats-card__title {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .stats-card__label,
    .stats-card__chart-title {
      font-weight: 600;
    }
    .stats-card__chart-title {
      font-size: 0.875rem;
      opacity: 0;
      animation: fadeInUp 0.6s ease-out 0.4s forwards;
    }
    .stats-card__legend-text {
      font-size: 0.7rem;
    }
    .stats-card__footer {
      font-family: var(--bs-font-monospace);
      font-size: 0.625rem;
      opacity: 0;
      animation: fadeIn 1s ease-out 1.5s forwards;
    }
    .stats-card__value--highlight {
      font-family: var(--bs-font-monospace);
      font-size: 0.875rem;
      fill: #40a02b;
    }
    .stats-card__metric-row > text {
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }
    .stats-card__metric-row:nth-child(1) > text {
      animation-delay: 0.4s;
    }
    .stats-card__metric-row:nth-child(2) > text {
      animation-delay: 0.5s;
    }
    .stats-card__metric-row:nth-child(3) > text {
      animation-delay: 0.6s;
    }
    .stats-card__metric-row:nth-child(4) > text {
      animation-delay: 0.7s;
    }
    .stats-card__metric-row:nth-child(5) > text {
      animation-delay: 0.8s;
    }
    .stats-card__metric-row:nth-child(6) > text {
      animation-delay: 0.9s;
    }
    .stats-card__chart-segment {
      fill: none;
      stroke-width: 10;
      opacity: 0;
      transform-origin: center;
      transform-box: fill-box;
      animation: growChart 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .stats-card__chart-segment--1 {
      stroke: #6610f2;
      animation-delay: 0.65s;
    }
    .stats-card__chart-segment--2 {
      stroke: #ffc107;
      animation-delay: 0.8s;
    }
    .stats-card__chart-segment--3 {
      stroke: #20c997;
      animation-delay: 0.95s;
    }
    .stats-card__chart-segment--4 {
      stroke: #0d6efd;
      animation-delay: 1.1s;
    }
    .stats-card__legend-marker,
    .stats-card__legend-text {
      opacity: 0;
      animation: fadeIn 0.5s ease-out forwards;
    }
    .stats-card__legend-marker--1,
    .stats-card__legend-text--1 {
      fill: #6610f2;
      animation-delay: 0.9s;
    }
    .stats-card__legend-marker--2,
    .stats-card__legend-text--2 {
      fill: #ffc107;
      animation-delay: 1s;
    }
    .stats-card__legend-marker--3,
    .stats-card__legend-text--3 {
      fill: #20c997;
      animation-delay: 1.1s;
    }
    .stats-card__legend-marker--4,
    .stats-card__legend-text--4 {
      fill: #0d6efd;
      animation-delay: 1.2s;
    }
    @media (prefers-color-scheme: dark) {
      .stats-card__bg {
        fill: #212529;
        stroke: #495057;
      }
      .stats-card__divider {
        stroke: #495057;
      }
      .stats-card__domain,
      .stats-card__title,
      .stats-card__label,
      .stats-card__value,
      .stats-card__chart-title,
      .stats-card__legend-text,
      .stats-card__footer {
        fill: #dee2e6;
      }
      .stats-card__value--highlight {
        fill: #a6da95;
      }
    }

    @keyframes drawLine {
      to {
        stroke-dashoffset: 0;
      }
    }
  `;

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg" class="stats-card" role="img">
      <style>${css}</style>

      <title id="cardTitle">Blog Statistics and Topics</title>

      <rect x="0.5" y="0.5" width="494" height="194" class="stats-card__bg"></rect>

      <g transform="translate(20, 35)"><text class="stats-card__title">Blog Stats</text></g>

      <g transform="translate(475, 35)"><text text-anchor="end" class="stats-card__domain">zama15.net</text></g>

      <line x1="20" y1="50" x2="475" y2="50" class="stats-card__divider"></line>

      <g transform="translate(20, 75)" class="stats-card__metrics">
        <g transform="translate(0, 0)" class="stats-card__metric-row">
          <text class="stats-card__label">Total Posts:</text>
          <text x="115" class="stats-card__value">${stats.totalPosts}</text>
        </g>

        <g transform="translate(0, 25)" class="stats-card__metric-row">
          <text class="stats-card__label">Total Topics:</text>
          <text x="115" class="stats-card__value">${stats.totalTopics}</text>
        </g>

        <g transform="translate(0, 50)" class="stats-card__metric-row">
          <text class="stats-card__label">Last Update:</text>
          <text x="115" class="stats-card__value">${escapeXML(stats.lastUpdate)}</text>
        </g>

        <g transform="translate(0, 75)" class="stats-card__metric-row">
          <text class="stats-card__label">Latest Post:</text>
          <text x="115" class="stats-card__value stats-card__value--highlight">${escapeXML(stats.latestPost)}</text>
        </g>
      </g>

      <g transform="translate(280, 75)" class="stats-card__chart-area">
        <text x="0" y="0" class="stats-card__chart-title"> Popular Topics </text>

        <g transform="translate(50, 42.5)" class="stats-card__chart">
          ${stats.chartSegments
            .map(
              (seg, i) => `
            <circle r="${stats.radius}" 
              stroke-dasharray="${seg.dashArray}" 
              stroke-dashoffset="${seg.dashOffset}" 
              class="stats-card__chart-segment stats-card__chart-segment--${i + 1}" 
            />
          `,
            )
            .join("")}
        </g>

        <g transform="translate(115, 15)" class="stats-card__legend">
          ${stats.chartSegments
            .map(
              (seg, i) => `
            <g transform="translate(0, ${i * 15})">
              <rect width="8" height="8" class="stats-card__legend-marker stats-card__legend-marker--${i + 1}" />
              <text x="15" y="8" class="stats-card__legend-text stats-card__legend-text--${i + 1}">${seg.name}</text>
            </g>
          `,
            )
            .join("")}
        </g>
      </g>

      <g transform="translate(475, 180)">
        <text text-anchor="end" class="stats-card__footer">
          ${escapeXML(stats.genTime)}
        </text>
      </g>
    </svg>
  `;
}
