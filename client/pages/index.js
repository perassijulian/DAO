import { useEffect } from "react";
import GetFreeGovernanceToken from "../components/GetFreeGovernanceToken";

export default function Home() {
  const changeNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x4",
        },
      ],
    });
  };

  useEffect(() => {
    if (window.ethereum.networkVersion !== 4) {
      changeNetwork();
    }
  }, []);

  return (
    <div className="flex flex-col items-center relative overflow-x-hidden">
      <GetFreeGovernanceToken />
    </div>
  );
}
