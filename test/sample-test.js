const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    // We get the contract to deploy
    const BoredMillennials = await ethers.getContractFactory("BoredMillennials");
    const boredmillennials = await BoredMillennials.deploy();
    await boredmillennials.deployed();

    const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const metadataURI = "cid/test.png";

    let balance = await boredmillennials.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await boredmillennials.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther("0.05")});
    
    await newlyMintedToken.wait();
    balance = await boredmillennials.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect (await boredmillennials.isContentOwned(metadataURI)).to.equal(true);

  });
});
