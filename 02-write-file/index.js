const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ws = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
let rli = readline.createInterface(process.stdin, process.stdout);

rli.setPrompt('Hello, friend! Please write some text:\n');
rli.prompt();
rli.on('line', (text) => {
  if (text === 'exit') {
    rli.close();
  } else {
    ws.write(`${text}\n`);
  }
});

rli.on('SIGINT', () => {
  rli.close();
});

rli.on('close', () => {
  console.log('Bye, friend!');
  ws.end();
});
