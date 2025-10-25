const { ethers } = require("hardhat");

async function main() {
  const BloodChain = await ethers.getContractFactory("BloodChain");
  const bloodChain = await BloodChain.deploy();

  await bloodChain.waitForDeployment(); // Updated for Hardhat 2.x+

  console.log("BloodChain deployed to:", await bloodChain.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });