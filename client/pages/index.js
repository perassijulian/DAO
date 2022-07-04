import GetFreeGovernanceToken from "../components/GetFreeGovernanceToken";

export default function Home() {
  //TDB MANAGE WHEN YOU START WITH AN ACCOUNT NOT CONNECTED TO RINKEBY
  return (
    <div className="flex flex-col items-center relative overflow-x-hidden">
      <GetFreeGovernanceToken />
    </div>
  );
}
