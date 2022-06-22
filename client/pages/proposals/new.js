import { useEffect, useState } from "react";
import CreateProject from "../../components/CreateProject";
import Navbar from "../../components/Navbar";
import { getContractSigned } from "../../utils/getContract";

const New = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  
  const getContract = async () => {
    const { newProvider, newContract } = await getContractSigned("governor");
    setContract(newContract);
    setProvider(newProvider)
  };

  useEffect(() => {
    // getContract();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <CreateProject />
    </div>
  );
};

export default New;
