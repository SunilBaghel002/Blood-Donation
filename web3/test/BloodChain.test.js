const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BloodChain", function () {
  let bloodChain;
  let owner, donor, bloodBank, hospital;

  beforeEach(async function () {
    [owner, donor, bloodBank, hospital] = await ethers.getSigners();

    const BloodChain = await ethers.getContractFactory("BloodChain");
    bloodChain = await BloodChain.deploy();
    await bloodChain.waitForDeployment();

    // Grant roles
    const ADMIN_ROLE = await bloodChain.ADMIN_ROLE();
    const DONOR_ROLE = await bloodChain.DONOR_ROLE();
    const BLOOD_BANK_ROLE = await bloodChain.BLOOD_BANK_ROLE();
    const HOSPITAL_ROLE = await bloodChain.HOSPITAL_ROLE();

    await bloodChain.grantRoleToUser(ADMIN_ROLE, owner.address);
    await bloodChain.grantRoleToUser(DONOR_ROLE, donor.address);
    await bloodChain.grantRoleToUser(BLOOD_BANK_ROLE, bloodBank.address);
    await bloodChain.grantRoleToUser(HOSPITAL_ROLE, hospital.address);
  });

  it("should grant roles correctly", async function () {
    expect(await bloodChain.hasRole(await bloodChain.DONOR_ROLE(), donor.address)).to.be.true;
    expect(await bloodChain.hasRole(await bloodChain.BLOOD_BANK_ROLE(), bloodBank.address)).to.be.true;
  });

  it("should record a donation", async function () {
    const tx = await bloodChain.connect(bloodBank).recordDonation(
      donor.address,
      "O+",
      1,
      "ipfs://QmExampleHash",
      42
    );
    await tx.wait();

    const unit = await bloodChain.getBloodUnit(1);
    expect(unit.id).to.equal(1);
    expect(unit.donor).to.equal(donor.address);
    expect(unit.bloodType).to.equal("O+");
    expect(unit.quantity).to.equal(1);
    expect(unit.ipfsHash).to.equal("ipfs://QmExampleHash");
    expect(unit.currentOwner).to.equal(bloodBank.address);
    expect(unit.used).to.be.false;

    // Check rewards
    expect(await bloodChain.getDonorRewards(donor.address)).to.equal(10);
  });

  it("should create a request", async function () {
    const tx = await bloodChain.connect(hospital).createRequest(
      bloodBank.address,
      "O+",
      1
    );
    await tx.wait();

    const req = await bloodChain.getRequest(1);
    expect(req.id).to.equal(1);
    expect(req.hospital).to.equal(hospital.address);
    expect(req.bloodBank).to.equal(bloodBank.address);
    expect(req.bloodType).to.equal("O+");
    expect(req.quantity).to.equal(1);
    expect(req.status).to.equal("Pending");
  });

  it("should approve a request and transfer units", async function () {
    // First, record a donation
    await bloodChain.connect(bloodBank).recordDonation(
      donor.address,
      "O+",
      1,
      "ipfs://QmExampleHash",
      42
    );

    // Create request
    await bloodChain.connect(hospital).createRequest(
      bloodBank.address,
      "O+",
      1
    );

    // Approve
    const unitIds = [1];
    const tx = await bloodChain.connect(bloodBank).approveRequest(1, unitIds);
    await tx.wait();

    const req = await bloodChain.getRequest(1);
    expect(req.status).to.equal("Approved");

    const unit = await bloodChain.getBloodUnit(1);
    expect(unit.currentOwner).to.equal(hospital.address);
  });

  it("should mark a unit as used", async function () {
    // Setup: record, request, approve
    await bloodChain.connect(bloodBank).recordDonation(
      donor.address,
      "O+",
      1,
      "ipfs://QmExampleHash",
      42
    );
    await bloodChain.connect(hospital).createRequest(
      bloodBank.address,
      "O+",
      1
    );
    await bloodChain.connect(bloodBank).approveRequest(1, [1]);

    // Mark as used
    const tx = await bloodChain.connect(hospital).markAsUsed(1);
    await tx.wait();

    const unit = await bloodChain.getBloodUnit(1);
    expect(unit.used).to.be.true;
  });

  it("should revert if non-role tries action", async function () {
    await expect(
      bloodChain.connect(donor).recordDonation(
        donor.address,
        "O+",
        1,
        "ipfs://QmExampleHash",
        42
      )
    ).to.be.revertedWith("AccessControl: account");
  });
});