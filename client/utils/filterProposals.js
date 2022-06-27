import { getContractSigned } from "./getContract";

export default async (proposals) => {
  const filtered = {
    0: [], // Pending,
    1: [], // Active,
    2: [], // Canceled,
    3: [], // Defeated,
    4: [], // Succeeded,
    5: [], // Queued,
    6: [], // Expired,
    7: [], // Executed
  };
  try {
    const { provider, contract } = await getContractSigned("governor");
    await Promise.all(
      proposals.map(async (p) => {
        const state = await contract.state(p.proposalId);
        await state;
        filtered[state] = [...filtered[state], p];
      })
    );
    return filtered;
  } catch (mainError) {
    console.log(mainError)
  }

};
