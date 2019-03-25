var HondurasCommunityToken = artifacts.require("./HondurasCommunityToken.sol");
var SwagNFT = artifacts.require("./SwagNFT.sol");
var SwagStore = artifacts.require("./SwagStore.sol");

module.exports = function(deployer) {
  deployer
    .deploy(HondurasCommunityToken, "Honduras Community Token", "HCT", 0)
    .then(async tokenInstance => {
      await deployer
        .deploy(SwagStore, tokenInstance.address)
        .then(async swagStoreInstance => {
          await deployer.deploy(
            SwagNFT,
            "BUIDL Honduras Swag",
            "BHNSWAG",
            swagStoreInstance.address
          );
        });
    });
};
