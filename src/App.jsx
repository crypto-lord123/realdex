import { ToastContainer } from "react-toastify";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { ethers } from "ethers";
function App() {
  const { referral } = useParams();
  useEffect(() => {
    const valid = ethers.utils.isAddress(referral);
    console.log(valid);
    if (valid) {
      localStorage.setItem("referral", referral);
    } else {
      const valid = ethers.utils.isAddress(localStorage.getItem("referral"));
      console.log(valid);
      if (valid == false) {
        localStorage.setItem(
          "referral",
          "0x" //add creator address
        );
      }
    }
  }, [referral]);
  return (
    <div className="App">
      <ToastContainer />
      <HomeScreen />
    </div>
  );
}

export default App;
