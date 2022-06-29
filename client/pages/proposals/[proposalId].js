import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import { getAllProposalIds } from "../../utils/getAllProposalIds";

const Proposal = ({ data }) => {
  const router = useRouter();
  const { proposalId } = router.query;
  console.log(data);
  return (
    <div>
      <Navbar />
      Proposal {proposalId}
    </div>
  );
};

export default Proposal;

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/proposalId/${params.proposalId}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllProposalIds();
  return {
    paths,
    fallback: false,
  };
}
