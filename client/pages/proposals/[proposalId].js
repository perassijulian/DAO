import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

const Proposal = () => {
  const router = useRouter();
  const { proposalId } = router.query;
  return (
    <div>
      <Navbar />
      Proposal {proposalId}
    </div>
  );
};

export default Proposal;
