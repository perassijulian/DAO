import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import { Table, useNotification } from "web3uikit";
import checkIfMember from "../utils/checkIfMember";
import { getContractSigned } from "../utils/getContract";
import shortenId from "../utils/shortenId";

const ProposalsTable = ({ proposals, action }) => {
  return (
    <Table
      key="table"
      columnsConfig="100px 4fr 1fr 1fr 80px"
      data={proposals.map((p) => {
        const button =
          action === "vote" ? (
            <VotingButton key="vote" proposalId={p.proposalId} />
          ) : (
            <ActionButton key="action" proposal={p} action={action} />
          );
        return [
          shortenId(p.proposalId),
          p.description,
          p.values[0],
          button,
          "<button key=detailsBut>Details</button>",
        ];
      })}
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
  const [isLoading, setIsLoading] = useState(false);

  const handleNewNotification = (type, message) => {
    dispatch({
      type,
      message,
      title: "New Notification",
      icon: "bell",
      position: "topR",
    });
  };

  const castVote = async (voteWay, proposalId) => {
    setIsLoading(true);
    const isMember = await checkIfMember();
    if (!isMember) {
      handleNewNotification(
        "error",
        "You need to have at least 1 governance token to be able to vote"
      );
      setIsLoading(false);
      return;
    }
    try {
      const { provider, contract } = await getContractSigned("governor");
      const voteTx = await contract.castVote(proposalId, voteWay);
      await voteTx.wait(1);
      const voted =
        voteWay == 0 ? "DECLINE" : voteWay == 1 ? "APPROVE" : "ABSTAIN on";
      const id = shortenId(proposalId);
      handleNewNotification(
        "success",
        `You succesfully voted to ${voted} project ${id}`
      );
    } catch (mainError) {
      try {
        let e = mainError.message.split("execution reverted: ");
        e = e[1].split('"');
        handleNewNotification("error", e[0]);
      } catch (error) {
        handleNewNotification("error", mainError.message);
      }
    }
    setIsLoading(false);
  };
  if (isLoading)
    return (
      <div className="animate-spin p-2 h-2 w-2 border-b-4 border-red-500 rounded-full"></div>
    );
  return (
    <div className="flex gap-3">
      <button onClick={() => castVote(1, proposalId)}>✔️</button>
      <button onClick={() => castVote(0, proposalId)}>❌</button>
      <button onClick={() => castVote(2, proposalId)}>❓</button>
    </div>
  );
};

const ActionButton = ({ action, proposal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useNotification();

  const handleNewNotification = (type, message) => {
    dispatch({
      type,
      message,
      title: "New Notification",
      icon: "bell",
      position: "topR",
    });
  };

  const handleAction = async () => {
    setIsLoading(true);
    const isMember = await checkIfMember();
    if (!isMember) {
      handleNewNotification(
        "error",
        "You need to have at least 1 governance token to be able to do this"
      );
      setIsLoading(false);
      return;
    }

    try {
      const { provider, contract } = await getContractSigned("governor");
      const descriptionHash = ethers.utils.id(proposal.description);
      switch (action) {
        case "QUEUE":
          const queueTx = await contract.queue(
            proposal.targets,
            proposal.values,
            proposal.calldatas,
            descriptionHash
          );
          await queueTx.wait(1);

          break;
        case "EXECUTE":
          const executeTx = await contract.queue(
            proposal.targets,
            proposal.values,
            proposal.calldatas,
            descriptionHash
          );
          await executeTx.wait(1);
          break;
        default:
          break;
      }
      handleNewNotification(
        "success",
        `You succesfully ${action} project ${shortenId(proposal.proposalId)}`
      );
      setTimeout(() => {
        router.reload(window.location.pathname);
      }, 4000);
    } catch (mainError) {
      try {
        let e = mainError.message.split("execution reverted: ");
        e = e[1].split('"');
        handleNewNotification("error", e[0]);
      } catch (error) {
        handleNewNotification("error", mainError.message);
      }
    }
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <div className="bg-green-600 h-8 w-24 rounded-md flex items-center justify-center">
        <div className="animate-spin h-2 w-2 p-2 border-b-4 border-white rounded-full"></div>
      </div>
    );

  return (
    <button
      className="bg-green-600 h-8 w-24 text-white font-bold rounded-md"
      onClick={handleAction}
    >
      {action}
    </button>
  );
};

export default ProposalsTable;
