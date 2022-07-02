import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CloseIcon from "@mui/icons-material/Close";

const Notification = ({ show, setShow, message }) => {
  return (
    <div
      className={`bg-white w-72 flex absolute top-0 -right-80 p-3 mt-2 mr-2 gap-3 rounded-2xl shadow-2xl transition-all ease-in-out ${
        show ? "-translate-x-80" : ""
      }`}
    >
      <NotificationsActiveIcon color="primary" />
      <div className="w-full">
        <div className="font-bold text-blue-600">New Notification</div>
        <p className="text-gray-500">{message}</p>
      </div>
      <div className="cursor-pointer" onClick={() => setShow(false)}>
        <CloseIcon color="disabled" />
      </div>
    </div>
  );
};

export default Notification;
