import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export default function BasicTable({ searchResults, handleOpen }) {
  const formatAuthors = (authors) => {
    let authorsString = "";

    for (let i = 0; i < authors?.length; i++) {
      authorsString = authorsString + authors[i];

      if (authors.length === i + 1) {
        break;
      }

      authorsString += " [, ";
    }

    for (let i = 0; i < authors?.length - 1; i++) {
      authorsString += "]";
    }

    return authorsString;
  };

  const tableContents = searchResults?.items?.map((book) => (
    <TableRow
      key={book.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {formatAuthors(book.volumeInfo.authors)}
      </TableCell>

      <TableCell>{book.volumeInfo.title}</TableCell>
      <TableCell>
        <Button variant="contained" onClick={() => handleOpen(book)}>
          Details
        </Button>
      </TableCell>
    </TableRow>
  ));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Author(s)</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>More Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableContents}</TableBody>
      </Table>
    </TableContainer>
  );
}
