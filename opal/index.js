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
   * @param {string} amount - amount to deposit in wei
   * @returns {string} transaction hash
   * @description Deposits the specified amount of ROSE into the Opal contract
   * @example deposit("1000000000000000000")
   **/
  async deposit(_hash, _wei) {
    await this.#isConnected();
    if (isNaN(_wei)) return console.error("Deposit failed. Invalid amount");
    // call deposit function
    const data = await this.contract["deposit"](_hash, { value: _wei });
    console.log(data);

    // return receipt.hash;
  }

  /**
   * @description Checks if the user is connected to wallet
   **/
  async #isConnected() {
    if (!this.provider) {
      const connected = await this.connectWallet();
      if (!connected) return console.error("Deposit failed. Wallet not connected");
    }
  }
}

export default Opal;
