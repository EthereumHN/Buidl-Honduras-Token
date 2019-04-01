require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

const SwagNFT = artifacts.require("./SwagNFT.sol");
const SwagStore = artifacts.require("./SwagStore.sol");
const BuidlHondurasToken = artifacts.require("./BuidlHondurasToken.sol");

contract("SwagNFT", accounts => {
  it("...should set the NFT Token Address.", async () => {
    const SwagNFTInstance = await SwagNFT.deployed();
    const SwagStoreInstance = await SwagStore.deployed();
    await SwagStoreInstance.setNFTAddress(SwagNFTInstance.address, {
      from: accounts[0]
    });
    const NFTAddress = await SwagStoreInstance.NFTTokenContractAddress();
    NFTAddress.should.be.equal(SwagNFTInstance.address);
  });

  it("...should create an NFT.", async () => {
    const SwagNFTInstance = await SwagNFT.deployed();
    const SwagStoreInstance = await SwagStore.deployed();
    const tokenUri =
      '{"name": "BUIDL Honduras Shirt", "description": "Shirt from BUIDL Honduras Community","price: "10","image": "https://gateway.ipfs.io/ipfs/Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u", "imageHash":"Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u" }';
    // Create NFT
    await SwagNFTInstance.createSwag(tokenUri, 10, {
      from: accounts[0]
    });

    // Get stored value
    const tokens = await SwagNFTInstance.tokensOfOwner(
      SwagStoreInstance.address
    );
    const swag = await SwagNFTInstance.tokenURI(tokens[0]);
    swag.should.be.equal(tokenUri);
  });

  it("...should transfer an NFT.", async () => {
    const SwagNFTInstance = await SwagNFT.deployed();
    const tokenUri =
      '{"name": "BUIDL Honduras Hoodie", "description": "Hoodie from BUIDL Honduras Community","price: "10","image": "https://gateway.ipfs.io/ipfs/Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u", "imageHash":"Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u" }';
    // Create NFT
    await SwagNFTInstance.createOwnedSwag(accounts[0], tokenUri, {
      from: accounts[0]
    });

    // Get stored value
    const tokens = await SwagNFTInstance.tokensOfOwner(accounts[0]);
    await SwagNFTInstance.safeTransferFrom(
      accounts[0],
      accounts[2],
      tokens[0],
      {
        from: accounts[0]
      }
    );
    let balance = await SwagNFTInstance.balanceOf(accounts[0]);
    balance.toNumber().should.equal(0);
    balance = await SwagNFTInstance.balanceOf(accounts[2]);
    balance.toNumber().should.equal(1);
  });

  it("...should create HCTs.", async () => {
    const BHTInstance = await BuidlHondurasToken.deployed();

    await BHTInstance.mint(accounts[1], 100, { from: accounts[0] });

    // Get stored value
    const balance = await BHTInstance.balanceOf(accounts[1]);
    balance.toNumber().should.be.equal(100);
  });

  it("...should sell swag for HCTs.", async () => {
    const SwagNFTInstance = await SwagNFT.deployed();
    const SwagStoreInstance = await SwagStore.deployed();
    const BHTInstance = await BuidlHondurasToken.deployed();

    let balance = await SwagNFTInstance.balanceOf(accounts[1]);
    balance.toNumber().should.equal(0);
    balance = await SwagNFTInstance.balanceOf(SwagStoreInstance.address);
    balance.toNumber().should.equal(1);

    // Get stored value
    const tokens = await SwagNFTInstance.tokensOfOwner(
      SwagStoreInstance.address
    );
    const receipt = await BHTInstance.transferAndCall(
      SwagStoreInstance.address,
      10,
      tokens[0],
      {
        from: accounts[1]
      }
    );
    balance = await SwagNFTInstance.balanceOf(accounts[1]);
    balance.toNumber().should.equal(1);
    balance = await SwagNFTInstance.balanceOf(SwagStoreInstance.address);
    balance.toNumber().should.equal(0);
  });
});
