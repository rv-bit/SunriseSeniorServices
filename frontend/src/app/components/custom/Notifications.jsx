import { MdClose } from 'react-icons/md';
import Snackbar from '@mui/material/Snackbar';

export const Notification = ({ open, handleClose, message }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={open}
            onClose={handleClose}
            autoHideDuration={2000}
            message={message}
            action={
                <MdClose className="cursor-pointer" onClick={handleClose} />
            }
        />
    );
}