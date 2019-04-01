var BuidlHondurasToken = artifacts.require("./BuidlHondurasToken.sol");
var SwagNFT = artifacts.require("./SwagNFT.sol");
var SwagStore = artifacts.require("./SwagStore.sol");
var OldTokenMigrator = artifacts.require("./OldTokenMigrator.sol");

module.exports = async function(deployer) {
  await deployer
    .deploy(BuidlHondurasToken, "Buidl Honduras Token", "BHT", 0)
    .then(async tokenInstance => {
      await deployer
        .deploy(SwagStore, tokenInstance.address)
        .then(async swagStoreInstance => {
          await deployer.deploy(
            SwagNFT,
            "BUIDL Honduras Swag",
            "SWAG",
            swagStoreInstance.address
          );
        });
    });
  await deployer.deploy(
    OldTokenMigrator,
    "0x902c68ed3bde2e270a747a507bf59329ba33fbfc"
  );
};
