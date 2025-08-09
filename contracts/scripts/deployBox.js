const hre = require("hardhat");

async function main() {
  const Box = await hre.ethers.getContractFactory("Box");
  const box = await Box.deploy();

  await box.waitForDeployment();
  console.log(`Box deployed to: ${await box.getAddress()}`);

  const tx = await box.store(123);
  await tx.wait();

  const value = await box.retrieve();
  console.log(`Stored value: ${value.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
