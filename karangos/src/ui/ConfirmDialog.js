import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmDialog({ title = 'Alerta', isOpen = false, onClose, children }) {
  /*
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  */

  const handleClose = (result) => {
    // Só chama a função onClose se a prop correspondente tiver sido passada
    if (onClose) onClose(result);
  };

  return (
    <div>
      {/*<Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button>*/}
      <Dialog
        open={isOpen}
        onClose={() => handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)} color="primary">
            Ok
          </Button>
          <Button onClick={() => handleClose(false)} color="primary" autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}