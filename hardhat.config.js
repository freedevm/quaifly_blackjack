require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    quai_orchard: {
      url: process.env.QUAI_ORCHARD_RPC_URL || "http://rpc.sandbox.quai.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    local_quai: {
      url: process.env.LOCAL_QUAI_RPC_URL || "http://localhost:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 9000,
    },
  },
  etherscan: {
    // Quaiscan configuration for Quai Orchard Testnet
    customChains: [
      {
        network: "quai_orchard",
        chainId: 9000, // Orchard Testnet chain ID (may need adjustment)
        urls: {
          apiURL: process.env.QUAI_API_URL || "https://api.quaiscan.io/api",
          browserURL: "https://quaiscan.io",
        },
      },
    ],
    apiKey: {
      quai_orchard: process.env.QUAI_API_KEY || "YOUR_QUAI_API_KEY",
    },
  },
};