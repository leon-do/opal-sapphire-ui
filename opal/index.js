import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";
import * as sapphire from "@oasisprotocol/sapphire-paratime";
const constants = require("./constants");

class Opal {
  constructor() {
    this.contract = null;
  }

  /**
   * @returns {boolean} true if connected, false if not
   * @description Connects the user to their wallet
   */
  async connectWallet() {
    const onboard = Onboard({
      wallets: [injectedModule()],
      chains: [
        {
          id: "0x5AFF",
          token: "tROSE",
          label: "Oasis Sapphire Testnet",
          rpcUrl: "https://testnet.sapphire.oasis.dev",
        },
      ],
    });
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      // set signer
      const signer = new ethers.providers.Web3Provider(sapphire.wrap(wallets[0].provider)).getSigner();
      // set contract
      this.contract = new ethers.Contract(constants.contract, constants.abi, signer);
      return true;
    }
    return false;
  }

  /**
   * @description Checks if the user is connected to wallet
   **/
  async isConnected() {
    return this.contract ? true : false;
  }

  /**
   * @param {string} _hash - hash of the preimage to lock ROSE
   * @returns {string} _wei - amount of wei to deposit
   * @description Deposits the specified amount of ROSE into the Opal contract
   **/
  async deposit(_hash, _wei) {
    if (isNaN(_wei)) return console.error("Deposit failed. Invalid amount");
    // call deposit function
    const receipt = await this.contract["deposit"](_hash, { value: _wei });
    return receipt.hash;
  }

  /**
   * @param {string} _preimage - preimage of the hash to unlock withdraw
   * @returns {string} _to - address to withdraw to
   * @description Withdraws amount of ROSE from the Opal contract
   **/
  async withdraw(_preimage, _to) {
    if (isNaN(_preimage)) return console.error("Deposit failed. Invalid preimage");
    if (!ethers.utils.isAddress(_to)) return console.error("Withdraw failed. Invalid address");
    // call withdraw function
    const receipt = await this.contract["withdraw"](_preimage, _to);
    return receipt.hash;
  }

  /**
   * @returns {string} generates and returns a random uint256 preimage
   **/
  preimage() {
    const bytes32 = ethers.utils.randomBytes(32);
    return ethers.BigNumber.from(bytes32).toString();
  }

  /**
   *
   * @param {string} _preimage - uint256
   * @returns hash of preimage
   * @description return keccak256(abi.encodePacked(_preimage));
   */
  hash(_preimage) {
    if (isNaN(_preimage)) return console.error("Hash failed. Invalid preimage");
    // hash the preimage
    return ethers.utils.solidityKeccak256(["uint256"], [_preimage]);
  }
}

export default Opal;
