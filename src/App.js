import "./css/Crypto.css";
import { useEffect, useState } from "react";
import flashLogo from "./icons/flashyield.png";

import FlashLoanLabel from "./components/FlashLoanLabel";
import FormScreen from "./components/FormScreen";
import SubmitScreen from "./components/SubmitScreen";
import loadWindowEthereum from "./helpers/loadWindowEthereum";
import getLoanEstimates from "./helpers/getLoanEstimates";
import { oeb, ubx } from "./constants";

function App() {
  const [sumbit, setSubmit] = useState(false);
  const [account, setAccount] = useState("");
  const [submitStateData, setSubmitStateData] = useState({
    ivm: "",
    dex: "",
    currency: "",
  });
  const [loanData, setLoanData] = useState({
    amount: 25,
    tokenFee: 0.01,
    swapFee: 0,
    totalFee: 0,
    gain: 0,
  });

  const [ethereumErr, setEthereumErr] = useState("");
  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    network: true,
  });


  const setCryptoType = (value) => {
    setFormData((prevState) => {
      let newState = { ...prevState };
      newState.network = value;
      return newState;
    });
  };
  const Initiate = () => {
    setSubmitStateData((prevState) => {
      let newState = { ...prevState };
      newState.currency = formData.network ? "ETH" : "BNB";
      newState.dex = formData.network ? "Uniswap" : "PancakeSwap";
      newState.ivm = formData.network ? oeb : ubx;
      return newState;
    });
    setLoanData((prevState) => {
      let newState = { ...prevState };
      newState = {
        ...getLoanEstimates(prevState, formData.network),
        tokenFee: 0.01,
      };
      return newState;
    });
    setSubmit(true);
  };
  if (ethereumErr)
    return (
      <div>
        <p className="error-text-mesg f26 show-ethereum-err">{ethereumErr}</p>
      </div>
    );
  else
    return (
      <div>
        <div className="crypto-app">
          <div className="crypto-icon">
            <img src={flashLogo} alt="flash-yield" />
          </div>
          <div className="crypto-body">
            <FlashLoanLabel />
            <div className="crypto">
              {!sumbit ? (
                <FormScreen
                  setCryptoType={setCryptoType}
                  onInitiate={Initiate}
                  formData={formData}
                  handleFormChange={(value, type) => {
                    setFormData((prevState) => {
                      let newState = { ...prevState };
                      newState[type] = value;
                      return newState;
                    });
                  }}
                />
              ) : (
                <SubmitScreen
                  accountAddress={account}
                  network={formData.network}
                  submitState={submitStateData}
                  loanData={loanData}
                  setLoanAmount={(amount) =>
                    setLoanData((prevState) => {
                      let newState = { ...prevState };
                      newState.amount = Number(amount);
                      newState = {
                        ...newState,
                        ...getLoanEstimates(newState, formData?.network),
                      };
                      return newState;
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>
        <span className="copyright-text">© 2020-2021 FlashYield</span>
      </div>
    );
}

export default App;
