import GetFreeGovernanceToken from "../components/GetFreeGovernanceToken";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen">
      <Navbar />
      <GetFreeGovernanceToken />
    </div>
  );
}
