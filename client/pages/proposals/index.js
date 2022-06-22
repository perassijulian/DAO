import Navbar from "../../components/Navbar";
import ProposalsTable from "../../components/ProposalsTable";
import { getContractSigned } from "../../utils/getContract";

const proposals = () => {
  const { provider, contract } = getContractSigned("holi");
  return (
    <div>
      <Navbar />
      <div className="m-5">
        <div>
          <h2>Proposals you can vote</h2>
          <ProposalsTable />
        </div>
        <div>
          <h2>Proposals already voted</h2>
          <ProposalsTable />
        </div>
      </div>
    </div>
  );
};

export default proposals;
