import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";

const Notification = ({ show, setShow, content }) => {
  const { message, type } = content;
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow(false);
      }, 4000);
    }
  }, [show]);

  return (
    <div
      className={`bg-white w-80 flex absolute top-0 -right-80 p-3 mt-2 mr-1 gap-3 rounded-2xl shadow-2xl transition-all ease-in-out ${
        show ? "-translate-x-80" : ""
      }`}
    >
      <NotificationsActiveIcon color={type} />
      <div className="w-full">
        <div
          className={`font-bold text-lg ${
            type === "error" ? "text-red-500" : "text-green-600"
          }`}
        >
          New Notification
        </div>
        <p className="text-gray-500">{message}</p>
      </div>
      <div className="cursor-pointer" onClick={() => setShow(false)}>
        <CloseIcon color="disabled" />
      </div>
    </div>
  );
};

export default Notification;
