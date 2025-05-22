import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '90%',
    maxWidth: '1000px',
    height: '90vh',
    maxHeight: '90vh',
    margin: '0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
}));

const PDFViewer = ({ open, onClose, url }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load PDF. Please try again.');
  };

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
    }
  }, [open, url]);

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="pdf-viewer-dialog-title"
    >
      <DialogTitle id="pdf-viewer-dialog-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">PDF Preview</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', width: '100%', zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        <iframe
          src={url}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </DialogContent>
    </StyledDialog>
  );
};

export default PDFViewer;