const Spinner = ({color}) => {
  return (
    <div className={`animate-spin p-2 border-b-4 rounded-full w-2 h-2 ${color === "white" ? "border-white" : "border-red-500"}`}></div>
  );
};

export default Spinner;
