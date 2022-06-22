import { useState } from "react";

const CreateProject = () => {
  const [project, setProject] = useState("");
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <h1 className="font-bold text-3xl">CREATE A NEW PROJECT</h1>
      <div className="bg-red-100 w-2/4 flex flex-col items-center">
        <textarea
          className="w-11/12 h-64 m-4 p-2"
          onChange={(e) => {
            setProject(e.target.value);
          }}
        />
        <button className="bg-red-500 px-8 py-1 mb-4 rounded-md font-bold text-white">ADD</button>
      </div>
    </div>
  );
};

export default CreateProject;
