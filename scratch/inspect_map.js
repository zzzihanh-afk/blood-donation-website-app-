const https = require('https');
const fs = require('fs');
const url = 'https://simplemaps.com/static/svg/country/bd/admin1/bd.svg';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch/bd_raw.svg', data);
    console.log('Saved scratch/bd_raw.svg, size:', data.length);
  });
}).on('error', e => console.error(e));
