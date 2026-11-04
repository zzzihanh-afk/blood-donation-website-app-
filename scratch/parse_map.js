const fs = require('fs');
const content = fs.readFileSync('scratch/bd_raw.svg', 'utf8');

const vb = content.match(/viewBox="([^"]+)"/);
console.log('viewBox:', vb ? vb[1] : 'none');

// Find all paths with id/name
const pathRegex = /<path([^>]+)>/g;
let m;
const paths = [];
while ((m = pathRegex.exec(content)) !== null) {
  const attrs = m[1];
  const idM = attrs.match(/id="([^"]+)"/);
  const nameM = attrs.match(/name="([^"]+)"/);
  const dM = attrs.match(/d="([^"]+)"/);
  paths.push({
    id: idM ? idM[1] : '',
    name: nameM ? nameM[1] : '',
    dLen: dM ? dM[1].length : 0,
    dStart: dM ? dM[1].slice(0, 60) : ''
  });
}

console.log('Total paths:', paths.length);
paths.forEach(p => console.log(p.id, p.name, 'Length:', p.dLen, 'Start:', p.dStart));
