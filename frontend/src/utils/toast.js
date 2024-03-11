import { Zoom, toast } from 'react-toastify';

const options = {
    position: 'bottom-left',
    autoClose: 3000, // Close the toast after 3 seconds
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
};

export const showToast = (type, message) => {
    switch (type) {
        case "SUCCESS":
            return toast.success(message, options);
        case "WARNING":
            return toast.warning(message, options);
        case "ERROR":
            return toast.error(message, options);
        default:
            return;
    }
};