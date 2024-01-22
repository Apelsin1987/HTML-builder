const fs = require('fs');
const path = require('path');
const folderName = 'files';
const folderPath = path.join(__dirname, folderName);
const newFolderPath = path.join(__dirname, `${folderName}-copy`);

function copyFolder(folder, newFolder) {
  fs.mkdir(newFolder, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    fs.readdir(folder, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log(err.message);
        return;
      }
      files.forEach((file) => {
        if (file.isFile()) {
          fs.copyFile(
            path.join(folder, file.name),
            path.join(newFolder, file.name),
            (err) => {
              if (err) {
                console.log(err.message);
              }
            },
          );
        } else if (file.isDirectory()) {
          copyFolder(
            path.join(folder, file.name),
            path.join(newFolder, file.name),
          );
        }
      });
    });
  });
}

fs.access(newFolderPath, (err) => {
  if (!err) {
    fs.rm(newFolderPath, { recursive: true }, (err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      copyFolder(folderPath, newFolderPath);
    });
  } else {
    copyFolder(folderPath, newFolderPath);
  }
});
