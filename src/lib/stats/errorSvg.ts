export function generateSVG(): string {
  // We explicitly inline the CSS here to ensure it works on GitHub
  const css = `
    <style>
      .stats-error__bg {
        fill: rgb(248, 214.6, 217.8);
        stroke: rgb(241, 174.2, 180.6);
        stroke-width: 5;
      }
      .stats-error__title,
      .stats-error__message {
        fill: rgb(88, 21.2, 27.6);
      }
      .stats-error__title {
        font-size: 1.25rem;
        font-weight: 700;
        font-family:
          SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
          "Courier New", monospace;
      }
      .stats-error__message {
        font-size: 0.875rem;
        font-family:
          SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
          "Courier New", monospace;
      }
      @media (prefers-color-scheme: dark) {
        .stats-error__bg {
          fill: rgb(44, 10.6, 13.8);
          stroke: rgb(132, 31.8, 41.4);
          stroke-width: 5;
        }
        .stats-error__title,
        .stats-error__message {
          fill: rgb(234, 133.8, 143.4);
        }
      }
    </style>
  `;

  return `
    <svg
      width="495" height="195" viewBox="0 0 495 195" role="img" class="stats-error" xmlns="http://www.w3.org/2000/svg">
      <style>${css}</style>

      <title id="cardTitle">Error Loading Status</title>

      <rect x="0.5" y="0.5" width="494" height="194" class="stats-error__bg"
      ></rect>

      <text x="50%" y="50%" text-anchor="middle" class="stats-error__title">
        Failed to load status
      </text>

      <text x="50%" y="65%" text-anchor="middle" class="stats-error__message">
        Check server logs
      </text>
    </svg>
  `;
}
