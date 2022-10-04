import Opal from "../opal";
import downloadPreimage from "../opal/downloadPreimage";

export default function Home() {
  const opal = new Opal();

  const handleDeposit = async () => {
    if (!(await opal.isConnected())) {
      const connected = await opal.connectWallet();
      if (!connected) return console.error("Failed to connect to wallet");
    }
    const preimage = opal.preimage();
    const hash = opal.hash(preimage);
    const wei = "1000000000000000000";
    downloadPreimage(`opal-${new Date()}.txt`, preimage);
    try {
      const txHash = await opal.deposit(hash, wei);
      console.log(txHash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={() => handleDeposit()}>Deposit</button>
    </div>
  );
}
