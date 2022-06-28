import { getContractSigned } from "./getContract";

export default async () => {
  try {
    const { provider, contract } = await getContractSigned("governorToken");
    const signerAddress = window.ethereum._state.accounts[0];
    const balance = await contract.balanceOf(signerAddress);
    return balance.toString() > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};
