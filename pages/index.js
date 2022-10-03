import Opal from "../opal";

export default function Home() {
  const opal = new Opal();

  const handleConnect = async () => {
    const connected = await opal.connectWallet();
    console.log(connected);
  };

  const handleDeposit = async () => {
    const hash = "0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6";
    const wei = "1000000000000000000";
    const txHash = await opal.deposit(hash, wei);
    console.log(txHash);
  };

  return (
    <div>
      <button onClick={() => handleConnect()}>Connect</button>
      <button onClick={() => handleDeposit()}>Deposit</button>
    </div>
  );
}
