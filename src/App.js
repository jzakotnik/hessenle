import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DangerousIcon from "@mui/icons-material/Dangerous";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import moment from "moment";
import { getDistance, getCompassDirection } from "geolib";

import translateCompass from "./lib/translateCompass";
import { ShareButton } from "./components/shareButton";

const citiesListFile = process.env.PUBLIC_URL + "/cities_small.json";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      <Link color="inherit" href="https://github.com/jzakotnik/hessenle">
        Impressum: Hessenle Github
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

function GuessIcon({ guessContent }) {
  if (guessContent === "open") return <HelpOutlineIcon />;
  if (guessContent === "wrong") return <DangerousIcon />;
  if (guessContent === "correct") return <ThumbUpAltIcon />;
}

function Score({ guessData }) {
  console.log("Guess Data, ", guessData);
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={{ xs: 2, md: 2 }}
    >
      <Grid item>
        <GuessIcon guessContent={guessData.guessContent[0]} />
      </Grid>
      <Grid item>
        <GuessIcon guessContent={guessData.guessContent[1]} />
      </Grid>
      <Grid item>
        <GuessIcon guessContent={guessData.guessContent[2]} />
      </Grid>
      <Grid item>
        <GuessIcon guessContent={guessData.guessContent[3]} />
      </Grid>
      <Grid item>
        <GuessIcon guessContent={guessData.guessContent[4]} />
      </Grid>
      <Grid item>
        <GuessIcon guessContent={guessData.guessContent[5]} />
      </Grid>
    </Grid>
  );
}

export default function Quiz() {
  const [cities, setCities] = useState(["Kronberg im Taunus"]);
  const [distance, setDistance] = useState(0.0);
  const [bearing, setBearing] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [todaysCity, setTodaysCity] = useState("loading.gif");
  const [submitPossible, setSubmitPossible] = useState(false);
  const [guessData, setGuessData] = useState({
    guessNumber: 0,
    guessContent: ["open", "open", "open", "open", "open", "open"],
  });
  useEffect(() => {
    const dayOfYear = moment().dayOfYear();
    /*setDistance(
      Math.floor(
        getDistance(
          { latitude: 51.5103, longitude: 7.49347 },
          { latitude: 55.5103, longitude: 6.49347 }
        ) / 1000
      )
    );*/
    fetch(citiesListFile)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);
        setCities(data.cities);
        const nrCities = data.cities.length;
        const city = data.cities[dayOfYear % nrCities];
        setTodaysCity(city);
      })
      .catch(function (err) {
        console.log(err, " error");
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Handled guess...", event);
    console.log("Todays City: ", todaysCity);
    console.log("Selected city", selectedCity);
    const selectedCityData = cities.filter((c) => c.id === selectedCity);
    console.log("Selected city data, ", selectedCityData[0]);
    const dist = Math.floor(
      getDistance(
        { latitude: todaysCity.lat, longitude: todaysCity.lng },
        {
          latitude: selectedCityData[0].lat,
          longitude: selectedCityData[0].lng,
        }
      ) / 1000
    );
    const bear = getCompassDirection(
      { latitude: todaysCity.lat, longitude: todaysCity.lng },
      {
        latitude: selectedCityData[0].lat,
        longitude: selectedCityData[0].lng,
      }
    );
    setDistance(dist);
    setBearing(translateCompass(bear));

    const newGuessContent = guessData.guessContent;
    if (dist > 1) {
      newGuessContent[guessData.guessNumber] = "wrong";
    } else {
      newGuessContent[guessData.guessNumber] = "correct";
    }
    const newGuessData = {
      guessNumber: guessData.guessNumber + 1,
      guessContent: newGuessContent,
    };

    setGuessData(newGuessData);

    console.log("Distance, Bearing: ", dist, bear);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(./hessen-background.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography component="h1" variant="h5">
                Wo bin ich in Hessen?
              </Typography>{" "}
            </Box>
            <Box>
              <img
                src={process.env.PUBLIC_URL + "/cityImages/" + todaysCity.image}
                height="200"
              />
            </Box>
            <Box sx={{ mt: 1, width: "100%" }}>
              <Autocomplete
                clearOnEscape
                id="city-autocomplete"
                disableClearable
                onChange={(event, newValue) => {
                  setSubmitPossible(true);
                  setSelectedCity(newValue.id); //use the ID of the city name
                }}
                options={cities.map((option) => ({
                  id: option.id,
                  key: option.id,
                  label: option.name,
                }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Städte-Suche"
                    id="city-input"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
              <Button
                startIcon={<LocationOnIcon />}
                onClick={handleSubmit}
                disabled={!submitPossible}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Meinen Tipp abgeben..
              </Button>

              <Score guessData={guessData} />
              <Grid container>
                <Grid item xs>
                  Distanz zum Ziel: {distance} Kilometer {bearing}
                </Grid>
                <Grid item></Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
