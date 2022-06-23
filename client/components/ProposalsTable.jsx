import { Table, useNotification } from "web3uikit";
import { getContractSigned } from "../utils/getContract";

const ProposalsTable = ({ proposals }) => {
  const shortenId = (id) => {
    return id.slice(0, 3) + " .. " + id.slice(-3);
  };

  return (
    <Table
      columnsConfig="100px 4fr 1fr 1fr 80px"
      data={proposals.map((p) => [
        shortenId(p.proposalId),
        p.description,
        p.values[0],
        <VotingButton key="vote" proposalId={p.proposalId} />,
        "<button key=detailsBut>Details</button>",
      ])}
      header={[
        <span key="id">ID</span>,
        <span key="description">Description</span>,
        <span key="value">Value</span>,
        <span key="vote">Vote</span>,
        <span key="details"></span>,
      ]}
      isColumnSortable={[true, false, true, false, false]}
      maxPages={5}
      onPageNumberChanged={function noRefCheck() {}}
      pageSize={5}
    />
  );
};

const VotingButton = ({ proposalId }) => {
  const dispatch = useNotification();

  const handleNewNotification = (message) => {
    dispatch({
      type: "error",
      message,
      title: "New Notification",
      icon: "bell",
      position: "topR",
    });
  };

  const castVote = async (voteWay, proposalId) => {
    try {
      const { provider, contract } = await getContractSigned("governor");
      const voteTx = await contract.castVote(proposalId, voteWay);
      const receipt = await voteTx.wait(1);
      const res = receipt.events[0].args;
      console.log(res);
      console.log(voteWay);
      console.log(proposalId);
    } catch (error) {
      handleNewNotification(error.message);
    }
  };
  return (
    <div className="flex gap-3">
      <button onClick={() => castVote(1, proposalId)}>✔️</button>
      <button onClick={() => castVote(0, proposalId)}>❌</button>
      <button onClick={() => castVote(2, proposalId)}>❓</button>
    </div>
  );
};

export default ProposalsTable;
