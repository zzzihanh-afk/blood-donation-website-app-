const fs = require('fs');
const content = fs.readFileSync('scratch/bd_raw.svg', 'utf8');

const regex = /<path\s+d="([^"]+)"\s+id="([^"]+)"\s+name="([^"]+)">/g;
let m;
const divisions = [];
while ((m = regex.exec(content)) !== null) {
  divisions.push({
    d: m[1],
    id: m[2],
    name: m[3]
  });
}

console.log('Divisions found:', divisions.length);

let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

function parsePathToPoints(dStr) {
  const subpaths = [];
  let currentSubpath = [];
  let curX = 0, curY = 0;

  const tokens = dStr.match(/[MmLlZz]|[-+]?[0-9]*\.?[0-9]+/g);
  if (!tokens) return [];
  let cmd = '';
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MmLlZz]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === 'z' || cmd === 'Z') {
        if (currentSubpath.length > 0) {
          subpaths.push(currentSubpath);
          currentSubpath = [];
        }
      }
    } else {
      if (cmd === 'M') {
        curX = parseFloat(t);
        curY = parseFloat(tokens[i+1]);
        i += 2;
        currentSubpath.push([curX, curY]);
        cmd = 'L';
      } else if (cmd === 'm') {
        curX += parseFloat(t);
        curY += parseFloat(tokens[i+1]);
        i += 2;
        currentSubpath.push([curX, curY]);
        cmd = 'l';
      } else if (cmd === 'L') {
        curX = parseFloat(t);
        curY = parseFloat(tokens[i+1]);
        i += 2;
        currentSubpath.push([curX, curY]);
      } else if (cmd === 'l') {
        curX += parseFloat(t);
        curY += parseFloat(tokens[i+1]);
        i += 2;
        currentSubpath.push([curX, curY]);
      } else {
        i++;
      }
      if (curX < minX) minX = curX;
      if (curX > maxX) maxX = curX;
      if (curY < minY) minY = curY;
      if (curY > maxY) maxY = curY;
    }
  }
  if (currentSubpath.length > 0) subpaths.push(currentSubpath);
  return subpaths;
}

function getSqSegDist(p, p1, p2) {
  let x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2[0]; y = p2[1];
    } else if (t > 0) {
      x += dx * t; y += dy * t;
    }
  }
  dx = p[0] - x; dy = p[1] - y;
  return dx * dx + dy * dy;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance, index;
  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }
  if (maxSqDist > sqTolerance) {
    if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

function simplifyPoints(points, tolerance) {
  if (points.length <= 2) return points;
  const sqTolerance = tolerance * tolerance;
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);
  return simplified;
}

const simplifiedDivisions = [];
const TOLERANCE = 1.0;

divisions.forEach(div => {
  const subpaths = parsePathToPoints(div.d);
  let totalOrigPts = 0;
  let totalSimpPts = 0;
  const simpSubpaths = [];

  subpaths.forEach(sp => {
    totalOrigPts += sp.length;
    if (sp.length >= 3) {
      const simp = simplifyPoints(sp, TOLERANCE);
      if (simp.length >= 3) {
        totalSimpPts += simp.length;
        simpSubpaths.push(simp);
      }
    }
  });

  let dOut = '';
  simpSubpaths.forEach(sp => {
    dOut += `M${sp[0][0].toFixed(1)} ${sp[0][1].toFixed(1)}`;
    for (let k = 1; k < sp.length; k++) {
      dOut += `L${sp[k][0].toFixed(1)} ${sp[k][1].toFixed(1)}`;
    }
    dOut += 'Z';
  });

  console.log(`${div.name}: ${totalOrigPts} -> ${totalSimpPts} points (${dOut.length} chars)`);
  simplifiedDivisions.push({
    id: div.id,
    name: div.name,
    d: dOut
  });
});

console.log('Bounding Box: X:', minX.toFixed(1), 'to', maxX.toFixed(1), 'Y:', minY.toFixed(1), 'to', maxY.toFixed(1));
const width = maxX - minX;
const height = maxY - minY;
console.log('Dimension:', width.toFixed(1), 'x', height.toFixed(1));

fs.writeFileSync('scratch/simplified_divisions.json', JSON.stringify({
  viewBox: `${Math.floor(minX - 10)} ${Math.floor(minY - 10)} ${Math.ceil(width + 20)} ${Math.ceil(height + 20)}`,
  divisions: simplifiedDivisions
}, null, 2));

console.log('Saved scratch/simplified_divisions.json');
