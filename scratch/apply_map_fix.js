const fs = require('fs');

const orig = fs.readFileSync('apps/web/src/components/id-card/LandmarkIllustrations.tsx', 'utf8');
const newComponent = fs.readFileSync('scratch/bd_component.tsx', 'utf8');

// Find the boundaries of BangladeshMapSVG
const startMarker = '// 9. Bangladesh Map Vector Outline';
const endMarker = '// 10. Official Role Emblem Badge';

const startIndex = orig.indexOf(startMarker);
const endIndex = orig.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers:', startIndex, endIndex);
  process.exit(1);
}

const updated = orig.slice(0, startIndex) + newComponent + '\n' + orig.slice(endIndex);
fs.writeFileSync('apps/web/src/components/id-card/LandmarkIllustrations.tsx', updated);
console.log('Successfully updated LandmarkIllustrations.tsx!');
