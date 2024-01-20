const fs = require('fs');
const path = require('path');
const rs = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';
rs.on('data', (chunk) => (data += chunk));
rs.on('end', () => console.log(data));
rs.on('error', (error) => console.log(error.message));
