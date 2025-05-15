const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blackjack Contract", function () {
  let Blackjack, blackjack, owner, user1, user2;
  const depositAmount = ethers.parseEther("1");
  const withdrawalAmount = ethers.parseEther("0.5");

  beforeEach(async function () {
    Blackjack = await ethers.getContractFactory("Blackjack");
    [owner, user1, user2] = await ethers.getSigners();
    blackjack = await Blackjack.deploy();
    await blackjack.waitForDeployment();
  });

  it("Should allow a user to deposit Quai", async function () {
    // await expect(() =>
    //   blackjack.connect(user1).deposit({ value: depositAmount })
    // ).to.changeEtherBalance(user1, -depositAmount);

    await expect(
      blackjack.connect(user1).deposit({ value: depositAmount })
    ).to.emit(blackjack, "Deposit").withArgs(user1.address, depositAmount);

    // // Move balance check to a separate deposit to avoid double counting
    // await blackjack.connect(user1).deposit({ value: depositAmount });
    // console.log(await blackjack.getContractBalance());
    expect(await blackjack.getContractBalance()).to.equal(depositAmount);
  });

  it("Should allow the owner to withdraw to a user", async function () {
    await blackjack.connect(user1).deposit({ value: depositAmount });

    await expect(() =>
      blackjack.connect(owner).withdrawToUser(user1.address, withdrawalAmount)
    ).to.changeEtherBalance(user1, withdrawalAmount);

    await expect(
      blackjack.connect(owner).withdrawToUser(user1.address, withdrawalAmount)
    ).to.emit(blackjack, "WithdrawalProcessed").withArgs(user1.address, withdrawalAmount);
  });

  it("Should allow the owner to withdraw rewards", async function () {
    await blackjack.connect(user1).deposit({ value: depositAmount });

    await expect(() =>
      blackjack.connect(owner).withdraw(withdrawalAmount)
    ).to.changeEtherBalance(owner, withdrawalAmount);

    await expect(
      blackjack.connect(owner).withdraw(withdrawalAmount)
    ).to.emit(blackjack, "OwnerWithdrawn").withArgs(owner.address, withdrawalAmount);
  });

  it("Should revert if non-owner tries to withdraw to a user", async function () {
    await blackjack.connect(user1).deposit({ value: depositAmount });
    await expect(
      blackjack.connect(user2).withdrawToUser(user1.address, withdrawalAmount)
    ).to.be.revertedWithCustomError(blackjack, "OwnableUnauthorizedAccount").withArgs(user2.address);
  });

  it("Should revert if non-owner tries to withdraw rewards", async function () {
    await blackjack.connect(user1).deposit({ value: depositAmount });
    await expect(
      blackjack.connect(user2).withdraw(withdrawalAmount)
    ).to.be.revertedWithCustomError(blackjack, "OwnableUnauthorizedAccount").withArgs(user2.address);
  });

  it("Should revert if withdrawal amount exceeds contract balance", async function () {
    await blackjack.connect(user1).deposit({ value: depositAmount });
    await expect(
      blackjack.connect(owner).withdrawToUser(user1.address, ethers.parseEther("2"))
    ).to.be.revertedWith("Contract has insufficient funds");

    await expect(
      blackjack.connect(owner).withdraw(ethers.parseEther("2"))
    ).to.be.revertedWith("Contract has insufficient funds");
  });
});