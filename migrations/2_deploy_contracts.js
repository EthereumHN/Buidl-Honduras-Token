var HondurasCommunityToken = artifacts.require("./HondurasCommunityToken.sol");

module.exports = function(deployer) {
  deployer.deploy(HondurasCommunityToken, "Honduras Community Token", "HCT", 0);
};
