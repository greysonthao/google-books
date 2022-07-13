import React from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Table from "../components/Table";
import BookModal from "../components/BookModal";
import Pagination from "@mui/material/Pagination";

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
  const [pageNumber, setPageNumber] = React.useState(1);
  const [startIndex, setStartIndex] = React.useState(0);

  React.useEffect(() => {
    const findMostCommonAuthor = () => {
      let authorsArray = [];

      if (searchResults) {
        const resultsArray = [...searchResults.items];

        for (let i = 0; i < resultsArray.length; i++) {
          for (let j = 0; j < resultsArray[i].volumeInfo.authors?.length; j++) {
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
  }, [mostCommonAuthor, searchResults]);

  React.useEffect(() => {
    const findPubDates = () => {
      if (searchResults) {
        const resultsArray = [...searchResults.items];

        let datesArray = [];

        for (let i = 0; i < resultsArray.length; i++) {
          datesArray.push(new Date(resultsArray[i].volumeInfo?.publishedDate));
        }

        const minDate = new Date(Math.min(...datesArray));
        setEarliestPubDate(minDate);

        const maxDate = new Date(Math.max(...datesArray));
        setMostRecentPubDate(maxDate);
      }
    };

    findPubDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults]);

  /* React.useEffect(() => {
    updatePage();
  }, [startIndex]); */

  const handleOpen = (book) => {
    setOpen(true);
    setSelectedBook(book);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    setStartIndex(0);
    setPageNumber(1);
    console.log("Submit Clicked");
    if (searchTerm.length === 0) {
      return;
    }

    try {
      setError(null);

      const startTime = performance.now();

      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?startIndex=${startIndex}&q=${searchTerm}`
      );

      console.log(
        `https://www.googleapis.com/books/v1/volumes?startIndex=${startIndex}&q=${searchTerm}`
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

  const updatePage = async () => {
    try {
      setError(null);

      const startTime = performance.now();

      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?startIndex=${startIndex}&q=${prevSearchTerm}`
      );

      console.log(
        `https://www.googleapis.com/books/v1/volumes?startIndex=${startIndex}&q=${prevSearchTerm}`
      );

      const result = await res.json();

      const endTime = performance.now();

      setServerResponseTime(endTime - startTime);

      setSearchResults(result);
    } catch (err) {
      setError(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    if (value === 1) {
      //FETCH DATA AT START INDEX OF 0
      console.log("page number: ", value);
      const newStartIndex = value * 0;
      setStartIndex(newStartIndex);
      updatePage();
    } else {
      //FETCH DATA AT START INDEX OF 10
      console.log("page number: ", value);
      const newStartIndex = (value - 1) * 10;
      setStartIndex(newStartIndex);
      console.log("search results: ", searchResults);
      updatePage();
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
            Submit
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
        <Box display="flex" justifyContent="center" margin="2rem 0 8rem 0">
          {searchResults && (
            <Pagination
              count={Math.ceil(searchResults.totalItems / 10)}
              color="primary"
              page={pageNumber}
              onChange={handlePageChange}
            />
          )}
        </Box>
      </Box>
    </div>
  );
}
