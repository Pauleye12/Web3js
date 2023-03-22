import { Contract, ethers, formatEther } from "ethers";
import React, { useState } from "react";
import SimpleStore_abi from "./SimpleStore_abi.json";
import "@metamask/legacy-web3";
function WalletCards() {
  const contractAddress = "0x4a767dfFD0e1d143E4cBE7e942D6Bea01bA14A73";
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAcct, setDefaultAcct] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect wallet");
  const [currentContractVal, setCurrentContractVal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText("wallet connected 1");
          accountChangedHandler(result[0]);
          setConnButtonText("wallet connected");
        });
    } else {
      setErrorMessage("install metamask");
    }
  };

  const getuserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(formatEther(balance));
      });
  };

  const accountChangedHandler = (newAccount) => {
    console.log(newAccount);
    setDefaultAcct(newAccount);
    getuserBalance(newAccount.toString());
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new Contract(
      contractAddress,
      SimpleStore_abi,
      tempSigner
    );
    setContract(tempContract);
  };

  const getCurrentVal = async () => {
    let val = await contract.retrieve();
    setCurrentContractVal(val);
  };

  const setHandler = (e) => {
    e.preventDefault();
    console.log("clicked");
    console.log(contract);
    contract.store.window.ethereum({
      method: "eth_sendTransaction",
      params: [e.target.setText.value],
    });
  };
  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);
  return (
    <div>
      <h1>{"connect to metamask using window.ethereum methods"}</h1>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <div className="acctDisplay">
        <h2>Address:{defaultAcct}</h2>
      </div>
      <div className="balanceDisplay">
        <h3>Balance: {userBalance}</h3>
      </div>

      <form onSubmit={setHandler}>
        <input type="text" id="setText" />
        <input type="submit" value="Add Value" />
      </form>

      <button onClick={getCurrentVal}>Get Latest value</button>
      <p>{currentContractVal}</p>
      {errorMessage}
    </div>
  );
}

export default WalletCards;
