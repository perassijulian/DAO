import { CopyButton, Typography, useNotification } from "web3uikit";
import Navbar from "../../components/Navbar";
import { getAllProposalIds } from "../../utils/getAllProposalIds";
import shortenId from "../../utils/shortenId";

const Proposal = ({ data }) => {
  const notify = useNotification();
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <h1 className="font-bold text-3xl mt-6">PROPOSAL DETAILS</h1>
      <div className="grid grid-cols-2 bg-red-100 p-3 w-2/4 mt-4 gap-3">
        <div>Proposal ID</div>
        <div>
          <Typography variant="body18">{shortenId(data.proposalId)}</Typography>
          <CopyButton
            text={data.proposalId}
            revertIn={1500}
            onCopy={() =>
              notify({
                type: "success",
                message: "Complete ID copied to clipboard",
                title: "New Notification",
                position: "topR",
              })
            }
          />
        </div>
        <div>Description</div>
        <Typography variant="body18">{data.description}</Typography>
        <div>Deadline</div>
        <Typography variant="body18">{data.deadline}</Typography>
        <div>Calldatas</div>
        <div>
          <Typography variant="body18">
            {data.calldatas[0].slice(0, 25)}
          </Typography>
          <CopyButton
            text={data.calldatas[0]}
            revertIn={1500}
            onCopy={() =>
              notify({
                type: "success",
                message: "Complete calldata copied to clipboard",
                title: "New Notification",
                position: "topR",
              })
            }
          />
        </div>
        <div>Targets</div>
        <div>
          <Typography variant="body18">
            {data.targets[0].slice(0, 24)}
          </Typography>
          <CopyButton
            text={data.targets[0]}
            revertIn={1500}
            onCopy={() =>
              notify({
                type: "success",
                message: "Complete address copied to clipboard",
                title: "New Notification",
                position: "topR",
              })
            }
          />
        </div>
      </div>
      <div className="bg-red-100 mt-4 p-3 w-2/4">
      <h2>Calldata:</h2>
      </div>
    </div>
  );
};

export default Proposal;

export async function getStaticProps({ params }) {
  const res = await fetch(
    `http://localhost:3000/api/proposalId/${params.proposalId}`
  );
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
