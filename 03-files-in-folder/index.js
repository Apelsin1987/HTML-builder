const fs = require('fs');
const path = require('path');
const folder = 'secret-folder';

fs.readdir(
  path.join(__dirname, folder),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log(err.message);
      return;
    }
    let fileParse;
    let fileSize;
    files.forEach((file) => {
      if (file.isFile()) {
        fs.stat(path.join(file.path, file.name), (err, stats) => {
          if (err) {
            console.log(err.message);
            return;
          }
          fileParse = path.parse(file.name);
          fileSize = (stats.size / 1024).toFixed(2);
          console.log(
            `${fileParse.name} - ${fileParse.ext.slice(1)} - ${fileSize}kb`,
          );
        });
      }
    });
  },
);
