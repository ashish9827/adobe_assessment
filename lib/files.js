const fs = require('fs');
const path = require('path');
// I learnt it from from scotch.io, and updated itself 
module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  }
};