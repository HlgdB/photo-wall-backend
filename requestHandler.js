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

function writeAlbumTagInfos(infos) {
  try {
    var data = fs.writeFileSync('./albumTagInfos.json', JSON.stringify(infos));
  } catch (err) {
    console.error(`Error write file from disk: ${err}`);
  }
}

function fetchAllTags(currentInfos) {
  return currentInfos.map((item) => ({
    idx: item.idx,
    value: item.value,
    label: item.label
  }));
}

function modifyTagInfos(filesPathList, tagValue) {
  var currentInfos = readAlbumTagInfos();
  currentInfos.every(element => {
    if(element.value === tagValue) {
      element.photosPathList = element.photosPathList.concat(filesPathList);
      return false;
    } else {
      return true;
    }
  });
  writeAlbumTagInfos(currentInfos);
  return currentInfos;
}

function addTag(value, label) {
  var currentInfos = readAlbumTagInfos();
  var newTag = {
    idx: currentInfos.length,
    value,
    label,
    photosPathList: []
  };
  currentInfos.push(newTag);
  writeAlbumTagInfos(currentInfos);
  return fetchAllTags(currentInfos);
}

function removeTag(value) {
  var currentInfos = readAlbumTagInfos();
  var removeIdx;
  currentInfos.every((item, idx) => {
    if(item.value === value) {
      removeIdx = idx;
      return false;
    } else return true;
  });
  currentInfos.splice(removeIdx, 1);
  writeAlbumTagInfos(currentInfos);
  return fetchAllTags(currentInfos);
}

exports.readAlbumTagInfos = readAlbumTagInfos;
exports.modifyTagInfos = modifyTagInfos;
exports.addTag = addTag;
exports.removeTag = removeTag;