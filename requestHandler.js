const fs = require("fs");
const config = require("./config");

function readAlbumTagInfos() {
  try {
    const data = config.mock ? fs.readFileSync("./mock.json", "utf8") : fs.readFileSync("./albumTagInfos.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }
}

function modifyTagInfos(filesPathList, tagValue) {
  var currentInfos = readAlbumTagInfos();
  currentInfos.every(element => {
    if(element.value === tagValue) {
      element.photosPathList = element.photosPathList.concat(filesPathList);
    };
    return false;
  });

  try {
    var data = fs.writeFileSync('./albumTagInfos.json', JSON.stringify(currentInfos));
  } catch (err) {
    console.error(err);
  }
}

exports.readAlbumTagInfos = readAlbumTagInfos;
exports.modifyTagInfos = modifyTagInfos;