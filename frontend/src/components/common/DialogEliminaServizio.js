import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ToastContainer, toast } from 'react-toastify';
import {ServizioAPI} from "../../API/ServizioAPI";

toast.configure();

export default function DialogEliminaServizio({currentServiceInfo, updateServicesList, disabled}) {
  const [open, setOpen] = React.useState(false);
  const servizioAPI = new ServizioAPI();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleRemove = () => {
    servizioAPI.deleteMedicalService(currentServiceInfo.id);
    updateServicesList(currentServiceInfo);
    toast.success("Servizio eliminato con successo.");
    setOpen(false);
  };

  const handleNotRemove = () => {
    setOpen(false);
  };

  return (
    <div>

      <Tooltip title={(disabled)?"Impossibile eliminare il servizio. Esso ha delle assegnazioni.":"Elimina servizio"}>
        <span>
          <IconButton variant="outlined" aria-label="delete" disabled={disabled} color="error" onClick={handleClickOpen}>
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleNotRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Conferma eliminazione servizio"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Eliminare il servizio {currentServiceInfo.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotRemove} color="primary">
            No
          </Button>
          <Button onClick={handleRemove} color="error" autoFocus>
            Sì
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
