const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/simplified_divisions.json', 'utf8'));

let svg = `<svg viewBox="${data.viewBox}" xmlns="http://www.w3.org/2000/svg" width="600" height="850" fill="none">
  <defs>
    <style>
      .division { fill: #580F1A; fill-opacity: 0.16; stroke: #580F1A; stroke-width: 1.5; stroke-opacity: 0.7; stroke-linejoin: round; }
      .division:hover { fill-opacity: 0.35; }
    </style>
  </defs>
  <g>
`;

data.divisions.forEach(d => {
  svg += `    <path id="${d.id}" name="${d.name}" class="division" d="${d.d}">\n      <title>${d.name}</title>\n    </path>\n`;
});

svg += `  </g>
</svg>`;

fs.writeFileSync('apps/web/public/branding/bangladesh-map-authentic.svg', svg);
console.log('Saved apps/web/public/branding/bangladesh-map-authentic.svg');
