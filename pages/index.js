import React from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Table from "../components/Table";
import BookModal from "../components/BookModal";

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [prevSearchTerm, setPrevSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [mostCommonAuthor, setMostCommonAuthor] = React.useState(null);
  const [earliestPubDate, setEarliestPubDate] = React.useState(null);
  const [mostRecentPubDate, setMostRecentPubDate] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [serverResponseTime, setServerResponseTime] = React.useState(null);

  React.useEffect(() => {
    const findMostCommonAuthor = () => {
      let authorsArray = [];

      if (searchResults) {
        const resultsArray = [...searchResults.items];

        for (let i = 0; i < resultsArray.length; i++) {
          for (let j = 0; j < resultsArray[i].volumeInfo.authors.length; j++) {
            authorsArray.push(resultsArray[i].volumeInfo.authors[j]);
          }
        }

        const hashmap = authorsArray.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});
        setMostCommonAuthor(
          Object.keys(hashmap).reduce((a, b) =>
            hashmap[a] > hashmap[b] ? a : b
          )
        );
      }
    };

    findMostCommonAuthor();
    console.log("Most Common Author: ", mostCommonAuthor);
  }, [mostCommonAuthor, searchResults]);

  React.useEffect(() => {
    const findEarliestPubDate = () => {
      if (searchResults) {
        const resultsArray = [...searchResults.items];

        let datesArray = [];

        for (let i = 0; i < resultsArray.length; i++) {
          datesArray.push(new Date(resultsArray[i].volumeInfo?.publishedDate));
          console.log("published date: ", datesArray[i]);
        }

        const minDate = new Date(Math.min(...datesArray));
        console.log("Earliest Publication Date: ", minDate);
        setEarliestPubDate(minDate);

        const maxDate = new Date(Math.max(...datesArray));
        console.log("Most Recent Publication Date: ", maxDate);
        setMostRecentPubDate(maxDate);
      }
    };

    findEarliestPubDate();
    console.log("Earliest Pub Date: ", earliestPubDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults]);

  const handleOpen = (book) => {
    setOpen(true);
    setSelectedBook(book);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    console.log("Submit Clicked");
    if (searchTerm.length === 0) {
      return;
    }

    try {
      setError(null);

      const startTime = performance.now();

      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
      );

      const result = await res.json();

      const endTime = performance.now();

      setServerResponseTime(endTime - startTime);

      setSearchResults(result);

      setPrevSearchTerm(searchTerm);

      setSearchTerm("");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <Head>
        <title>Google Books App</title>
        <meta name="description" content="Google Books App Search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Typography variant="h2" textAlign="center" marginTop="2rem">
          Google Books Search
        </Typography>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
          noValidate
          autoComplete="off"
        >
          {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          <TextField id="filled-basic" label="Filled" variant="filled" /> */}
          <TextField
            id="standard-basic"
            label="Search"
            variant="standard"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Search
          </Button>
        </Box>
        <Container maxWidth="md" sx={{ marginTop: "1rem" }}>
          {error && (
            <Typography
              textAlign="center"
              sx={{ margin: "1.5rem 0 0 0", color: "red" }}
            >
              Error: {error}
            </Typography>
          )}
          {searchResults && (
            <Typography textAlign="center" sx={{ margin: "1.5rem 0 0 0" }}>
              Total Results for &quot;{prevSearchTerm}&quot;:{" "}
              {searchResults.totalItems}
            </Typography>
          )}
          {mostCommonAuthor && (
            <Typography textAlign="center">
              Most Common Author: {mostCommonAuthor}
            </Typography>
          )}
          {earliestPubDate && (
            <Typography textAlign="center">
              Earliest Publication: {earliestPubDate.toString()}
            </Typography>
          )}
          {mostRecentPubDate && (
            <Typography textAlign="center">
              Most Recent Publication: {mostRecentPubDate.toString()}
            </Typography>
          )}
          {serverResponseTime && (
            <Typography textAlign="center">
              Server Response Time: {serverResponseTime.toFixed(2)} milliseconds
            </Typography>
          )}
          {searchResults && (
            <Box margin="2rem 0 0 0">
              <Table
                searchResults={searchResults}
                handleOpen={handleOpen}
                setSelectedBook={setSelectedBook}
              />
            </Box>
          )}
        </Container>
        <BookModal
          open={open}
          handleClose={handleClose}
          selectedBook={selectedBook}
        />
        {/* <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal> */}
      </Box>
    </div>
  );
}
