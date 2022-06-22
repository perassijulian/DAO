import CreateProject from "../../components/CreateProject";
import Navbar from "../../components/Navbar";

const New = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <CreateProject />
    </div>
  );
};

export default New;
