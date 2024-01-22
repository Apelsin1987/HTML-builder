const fs = require('fs');
const path = require('path');
const readFolder = 'styles';
const writeFolder = 'project-dist';
const outputCss = 'bundle.css';

fs.readdir(
  path.join(__dirname, readFolder),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log(err.message);
      return;
    }
    const ws = fs.createWriteStream(
      path.join(__dirname, writeFolder, outputCss),
      'utf-8',
    );
    ws.on('error', (err) => console.log(err.message));
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name).toLowerCase() === '.css') {
        let rs = fs.createReadStream(
          path.join(__dirname, readFolder, file.name),
          'utf-8',
        );
        rs.pipe(ws, { end: false });
        rs.on('end', () => {
          rs.close();
        });
        rs.on('error', (err) => console.log(err.message));
      }
    });
  },
);
