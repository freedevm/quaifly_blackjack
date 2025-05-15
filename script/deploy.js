const hre = require("hardhat");

async function main() {
  // Deploy the Blackjack contract
  const Blackjack = await hre.ethers.getContractFactory("Blackjack");
  const blackjack = await Blackjack.deploy();

  await blackjack.waitForDeployment();
  const contractAddress = blackjack.target;
  console.log("Blackjack deployed to:", contractAddress);

  // Verify the contract on Quaiscan for Quai Orchard Testnet
//   if (hre.network.name === "quai_orchard" && process.env.QUAI_API_KEY) {
//     console.log("Verifying contract on Quaiscan for Quai Orchard Testnet...");
//     try {
//       await hre.run("verify:verify", {
//         address: contractAddress,
//         constructorArguments: [], // Blackjack constructor has no arguments
//       });
//       console.log("Contract verified successfully on Quaiscan!");
//     } catch (error) {
//       console.error(
//         "Verification failed:",
//         error.message,
//         "\nManually verify at https://quaiscan.io/verifyContract"
//       );
//     }
//   } else if (hre.network.name === "quai_orchard") {
//     console.log(
//       "Skipping verification: QUAI_API_KEY is missing. Manually verify at https://quaiscan.io/verifyContract using address:",
//       contractAddress
//     );
//   } else {
//     console.log(
//       "Skipping verification: Verification is only supported for quai_orchard network"
//     );
//   }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});