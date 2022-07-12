/* eslint-disable @next/next/no-img-element */
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BookModal({ open, handleClose, selectedBook }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            fontWeight="bold"
          >
            {selectedBook?.volumeInfo.title}
          </Typography>
          <Box display="flex" justifyContent="center">
            <img
              src={selectedBook?.volumeInfo.imageLinks?.thumbnail}
              alt={selectedBook?.volumeInfo.title}
              width="200px"
            />
          </Box>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedBook?.volumeInfo.description
              ? selectedBook.volumeInfo.description
              : "No description available"}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default BookModal;
