import { useState } from "react";
import Opal from "../opal";
import downloadPreimage from "../opal/downloadPreimage";

export default function Home() {
  const [amountInput, setAmountInput] = useState("100000000000000000");
  const [preimageInput, setPreimageInput] = useState("");
  const [toInput, setToInput] = useState("");
  const opal = new Opal();

  const handleDeposit = async () => {
    if (!(await opal.isConnected())) {
      const connected = await opal.connectWallet();
      if (!connected) return console.error("Failed to connect to wallet");
    }
    const preimage = opal.preimage();
    const hash = opal.hash(preimage);
    // downloadPreimage(`opal-${new Date()}.txt`, preimage);
    try {
      const txHash = await opal.deposit(hash, amountInput);
      console.log(txHash);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    if (!(await opal.isConnected())) {
      const connected = await opal.connectWallet();
      if (!connected) return console.error("Failed to connect to wallet");
    }
    try {
      const txHash = await opal.withdraw(preimageInput, toInput);
      console.log(txHash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input value={amountInput} onChange={(e) => setAmountInput(e.target.value)} />
      <button onClick={() => handleDeposit()}>Deposit</button>
      <hr />
      <input value={preimageInput} onChange={(e) => setPreimageInput(e.target.value)} placeholder="123" />
      <input value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="0xalice" />
      <button onClick={() => handleWithdraw()}>Withdraw</button>
    </div>
  );
}
