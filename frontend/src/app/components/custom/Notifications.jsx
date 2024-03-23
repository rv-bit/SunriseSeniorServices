import { MdClose } from 'react-icons/md';
import Snackbar from '@mui/material/Snackbar';

export const Notification = (props) => {
    const alertState = props.alertState;
    const setAlertState = props.setAlertState;
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertState({ ...alertState, open: false });
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={alertState.open}
            onClose={handleClose}
            autoHideDuration={2000}
            message={alertState.message}
            action={
                <MdClose className="cursor-pointer" onClick={handleClose} />
            }
        />
    );
}