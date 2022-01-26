const fs = require("fs");

function readAlbumTagInfos() {
  try {
    const data = fs.readFileSync("./albumTagInfos.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }
}


exports.readAlbumTagInfos = readAlbumTagInfos;