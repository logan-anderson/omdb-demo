import {
  Container,
  TextField,
  CircularProgress,
  Grid,
  Typography,
  Paper,
  Button,
  Snackbar,
} from "@material-ui/core";
import React, { useState } from "react";
import { Data, Search, useFetchIMDB } from "./hooks";

type OnClickFunc = (item: Search) => void;
const DisplayItem: React.FC<{
  searchItem: Search;
  onClick?: OnClickFunc;
  fullWidth?: boolean;
  buttonText: string;
  disabled?: boolean;
}> = ({
  searchItem,
  onClick = () => {},
  fullWidth = false,
  buttonText,
  disabled = false,
}) => {
  return (
    <Grid item xs={12} md={fullWidth ? 12 : 6} lg={fullWidth ? 12 : 4}>
      <Paper
        elevation={3}
        style={{
          padding: ".5rem",
        }}
      >
        <Typography align="center" variant="h1" is="h1">
          {searchItem.Title}
        </Typography>
        <Typography align="center" is="p">
          {searchItem.Year}
        </Typography>
        <Typography align="center" is="p">
          ID: {searchItem.imdbID}
        </Typography>
        <div>
          <img
            src={searchItem.Poster}
            alt="img"
            style={{
              width: "100%",
            }}
          />
        </div>
        <Grid container>
          <Button
            disabled={disabled}
            color="primary"
            onClick={() => {
              onClick(searchItem);
            }}
          >
            {buttonText}
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

const Movies: React.FC<{
  loading: boolean;
  data: Data | null;
  onClick: OnClickFunc;
  myList: Search[];
}> = ({ loading, data, onClick, myList }) => {
  if (loading || !data) {
    return <CircularProgress />;
  }
  return (
    <Grid container>
      {data?.Search?.map((item) => {
        return (
          <DisplayItem
            disabled={myList.includes(item)}
            buttonText="Add movie to list"
            onClick={onClick}
            key={item.imdbID}
            searchItem={item}
          />
        );
      })}
    </Grid>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const { loading, data } = useFetchIMDB({ search });
  const [myList, setMyList] = useState<Search[]>([]);
  const [open, setOpen] = useState(false);
  const onClick: OnClickFunc = (item) => {
    if (myList.length >= 5) {
      setOpen(true);
    } else {
      setMyList([...myList, item]);
    }
  };
  const genFilterFunc = (item: Search) => {
    return () => {
      const temp = [...myList];
      const newList = temp.filter((x) => x !== item);
      setMyList(newList);
    };
  };

  return (
    <>
      <Container>
        <TextField
          variant="filled"
          fullWidth
          label="Search by name"
          onChange={(e) => {
            console.log(e.target.value);
            setSearch(e.target.value);
          }}
          style={{
            marginTop: "1rem",
          }}
        />
        <Grid container direction="row">
          <Grid item sm={12} md={8}>
            <Movies
              myList={myList}
              onClick={onClick}
              loading={loading}
              data={data}
            />
          </Grid>
          <Grid item sm={12} md={4}>
            <Typography align="center" variant="h1" is="h1">
              Your Nomination List
            </Typography>
            {myList.map((item) => {
              return (
                <DisplayItem
                  buttonText="remove from list"
                  fullWidth
                  onClick={genFilterFunc(item)}
                  key={item.imdbID}
                  searchItem={item}
                />
              );
            })}
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={() => {
            setOpen(false);
          }}
          open={open}
          autoHideDuration={3000}
          message="You have reached the maximin amount of movies in your nomination list"
        />
      </Container>
    </>
  );
}

export default App;
