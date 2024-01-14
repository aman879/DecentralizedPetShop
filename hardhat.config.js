/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-verify")
const fs = require("fs"); 

const etherscanKey = fs.readFileSync(".etherscan").toString().trim();
const polygonAPIKey = fs.readFileSync(".api").toString().trim();
const accountPrivateKey = fs.readFileSync(".account").toString().trim();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {},
    polygon_mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/" + polygonAPIKey,
      accounts: [accountPrivateKey]
    }
  },
  etherscan : {
    apiKey: etherscanKey,
  },
  sourcify: {
    enabled: true
  }
}; 