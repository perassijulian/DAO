import { Table } from "web3uikit";

const ProposalsTable = () => {
  return (
    <Table
      columnsConfig="100px 4fr 1fr 1fr 80px"
      data={[
        ["132..245", " asd description1 asd description1 asd description1 asd description1 asd description1 asd description1 asd description1 asd description1", 0, <VotingButton key="123" />, <button key="detailsBut">Details</button>],
        [132, "description1", 0, <VotingButton key="123" />, <button key="detailsBut">Details</button>],
        [132, "description1", 0, <VotingButton key="123" />, <button key="detailsBut">Details</button>],
        [132, "description1", 0, <VotingButton key="123" />, <button key="detailsBut">Details</button>],
        [132, "description1", 0, <VotingButton key="123" />, <button key="detailsBut">Details</button>],
        [132, "description1", 0, <VotingButton key="123" />, <button key="detailsBut">Details</button>],
      ]}
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

const VotingButton = () => {
  return (
    <div className="flex gap-3">
      <button>✔️</button>
      <button>❌</button>
      <button>❓</button>
    </div>
  );
};

export default ProposalsTable;
