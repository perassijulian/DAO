import { ethers } from "ethers";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import checkIfMember from "../utils/checkIfMember";
import { getContractSigned } from "../utils/getContract";
import shortenId from "../utils/shortenId";
import Notification from "./Notification";
import Spinner from "./Spinner";

const ProposalsTable = ({ proposals, action }) => {
  return (
    <div className="p-4 border-gray-300 rounded-xl border">
      <div className="grid grid-cols-12 font-bold border-b-gray-300 border-b-2 pb-2">
        <div className="col-span-2">Proposal Id</div>
        <div className="col-span-6">Description</div>
        <div>Value</div>
        <div className="col-span-2">Action</div>
        <div></div>
      </div>
      {proposals.map((p) => {
        const button =
          action === "vote" ? (
            <VotingButton key="vote" proposalId={p.proposalId} />
          ) : (
            <ActionButton key="action" proposal={p} action={action} />
          );
        return (
          <div
            className="grid grid-cols-12 mt-4"
            key={`tablerow-${p.proposalId}`}
          >
            <div className="col-span-2">{shortenId(p.proposalId)}</div>
            <div className="col-span-6">{p.description}</div>
            <div>{ethers.utils.formatEther(p.values[0])}</div>
            <div className="col-span-2">{button}</div>
            <div>
              <Link href={`/proposals/${p.proposalId}`}>
                <a>Details</a>
              </Link>
            </div>
          </div>
        );
      })}
      {proposals.length === 0 && (
        <p className="text-center pt-4">No proposals to display</p>
      )}
    </div>
  );
};

const VotingButton = ({ proposalId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const notificate = (message, type) => {
    setShowNotification(true);
    setNotificationContent({ message, type });
  };

  const castVote = async (voteWay, proposalId) => {
    setIsLoading(true);
    const isMember = await checkIfMember();
    if (!isMember) {
      setIsLoading(false);
      notificate(
        "You need to have at least 1 governance token to be able to vote",
        "error"
      );
      return;
    }
    try {
      const { provider, contract } = await getContractSigned("governor");
      const voteTx = await contract.castVote(proposalId, voteWay);
      await voteTx.wait(1);
      const voted =
        voteWay == 0 ? "DECLINE" : voteWay == 1 ? "APPROVE" : "ABSTAIN on";
      const id = shortenId(proposalId);
      notificate(`You succesfully voted to ${voted} project ${id}`, "success");
    } catch (mainError) {
      try {
        let e = mainError.message.split("execution reverted: ");
        e = e[1].split('"');
        notificate(e[0], "error");
      } catch (error) {
        notificate(mainError.message, "error");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-3">
      <Notification
        show={showNotification}
        setShow={setShowNotification}
        content={notificationContent}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <button onClick={() => castVote(1, proposalId)}>✔️</button>
          <button onClick={() => castVote(0, proposalId)}>❌</button>
          <button onClick={() => castVote(2, proposalId)}>❓</button>
        </>
      )}
    </div>
  );
};

const ActionButton = ({ action, proposal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationContent, setNotificationContent] = useState({});
  const notificate = (message, type) => {
    setShowNotification(true);
    setNotificationContent({ message, type });
  };
  const router = useRouter();
  const handleAction = async () => {
    setIsLoading(true);
    const isMember = await checkIfMember();
    if (!isMember) {
      setIsLoading(false);
      notificate(
        "You need to have at least 1 governance token to be able to do this",
        "error"
      );
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
          const executeTx = await contract.execute(
            proposal.targets,
            proposal.values,
            proposal.calldatas,
            descriptionHash
          );
          await executeTx.wait(1);
          break;
        case "DETAILS":
          router.push(`/proposals/${proposal.proposalId}`);
          return;
        default:
          break;
      }

      notificate(
        `You succesfully ${action} project ${shortenId(proposal.proposalId)}`,
        "success"
      );
      setTimeout(() => {
        router.reload(window.location.pathname);
      }, 4000);
    } catch (mainError) {
      try {
        let e = mainError.message.split("execution reverted: ");
        e = e[1].split('"');
        notificate(e[0], "error");
      } catch (error) {
        notificate(mainError.message, "error");
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Notification
        show={showNotification}
        setShow={setShowNotification}
        content={notificationContent}
      />
      <div className="bg-green-600 h-8 w-24 rounded-md text-white font-bold flex items-center justify-center">
        {isLoading ? (
          <Spinner color="white"/>
        ) : (
          <button className="w-full h-full" onClick={handleAction}>{action}</button>
        )}
      </div>
    </div>
  );
};

export default ProposalsTable;
