const fs = require('fs');
const path = require('path');
const fileTemplate = 'template.html';
const folderComponents = 'components';
const folderStyles = 'styles';
const folderAssets = 'assets';
const newMainFolder = 'project-dist';

async function readFolder(folderPath) {
  try {
    const files = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });
    return files;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

async function makeFolder(folderPath) {
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

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

function copyFolders() {
  fs.mkdir(path.join(__dirname, newMainFolder), { recursive: true }, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    const newFolderPath = path.join(__dirname, newMainFolder, folderAssets);
    const folderPath = path.join(__dirname, folderAssets);
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
  });
}

async function readFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

async function writeFile(filePath, text) {
  try {
    await fs.promises.writeFile(filePath, text);
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

function mergeStyleFiles() {
  fs.mkdir(path.join(__dirname, newMainFolder), { recursive: true }, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }
    fs.readdir(
      path.join(__dirname, folderStyles),
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          console.log(err.message);
          return;
        }
        const ws = fs.createWriteStream(
          path.join(__dirname, newMainFolder, 'style.css'),
          'utf-8',
        );
        ws.on('error', (err) => console.log(err.message));
        files.forEach((file) => {
          if (
            file.isFile() &&
            path.extname(file.name).toLowerCase() === '.css'
          ) {
            let rs = fs.createReadStream(
              path.join(__dirname, folderStyles, file.name),
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
  });
}

async function replaceComponents(file, textHtml) {
  const fileParse = path.parse(file.name);
  if (
    file.isFile() &&
    fileParse.ext.toLowerCase() === '.html' &&
    typeof textHtml === 'string' &&
    textHtml.includes(`{{${fileParse.name}}}`)
  ) {
    let data = await readFile(
      path.join(__dirname, folderComponents, file.name),
    );
    textHtml = textHtml.replace(`{{${fileParse.name}}}`, data.toString());
  }
  return textHtml;
}

async function main() {
  let textHtml = await readFile(path.join(__dirname, fileTemplate));
  let files = await readFolder(path.join(__dirname, folderComponents));
  let file;

  for (file of files) {
    textHtml = await replaceComponents(file, textHtml);
  }
  await makeFolder(path.join(__dirname, newMainFolder));
  await writeFile(path.join(__dirname, newMainFolder, 'index.html'), textHtml);
}

main();
mergeStyleFiles();
copyFolders();
