const fs = require('fs');
const path = require('path');
const fileTemplate = 'template.html';
const folderComponents = 'components';
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

async function copyFile(fromPath, toPath) {
  const rs = fs.createReadStream(fromPath);
  const ws = fs.createWriteStream(toPath);
  rs.pipe(ws).on('error', (err) => console.log(err.message));
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

  for (let file of files) {
    textHtml = await replaceComponents(file, textHtml);
  }
  await makeFolder(path.join(__dirname, newMainFolder));
  await writeFile(path.join(__dirname, newMainFolder, 'index.html'), textHtml);
}

main();
