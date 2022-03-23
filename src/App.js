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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import moment from "moment";
import { getDistance, getCompassDirection } from "geolib";

import translateCompass from "./lib/translateCompass";
import { ShareButton } from "./components/shareButton";

const citiesListFile = process.env.PUBLIC_URL + "/cities.json";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {" "}
      Made with ❤️ by Ingmar and Jure,
      <Link color="inherit" href="https://github.com/jzakotnik/hessenle">
        Impressum
      </Link>{" "}
      <div>
        Like it? Buy us a{" "}
        <Link color="inherit" href="https://ko-fi.com/jzakotnik">
          coffee
        </Link>{" "}
      </div>
    </Typography>
  );
}

const theme = createTheme();

function GuessIcon({ guessContent }) {
  if (guessContent === "open") return <HelpOutlineIcon color="primary" />;
  if (guessContent === "wrong") return <DangerousIcon color="secondary" />;
  if (guessContent === "correct") return <ThumbUpAltIcon color="success" />;
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
  const [gameOpen, setGameOpen] = useState(true);
  const [cities, setCities] = useState(["Kronberg im Taunus"]);
  const [distance, setDistance] = useState(0.0);
  const [bearing, setBearing] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [todaysCity, setTodaysCity] = useState("loading.gif");
  const [submitPossible, setSubmitPossible] = useState(false);
  const [guessData, setGuessData] = useState({
    guessNumber: 0,
    guessContent: ["open", "open", "open", "open", "open", "open"],
    guessResult: [],
  });
  const [showMap, setShowMap] = useState(false);
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
      {
        latitude: selectedCityData[0].lat,
        longitude: selectedCityData[0].lng,
      },
      { latitude: todaysCity.lat, longitude: todaysCity.lng }
    );
    setDistance(dist);
    setBearing(translateCompass(bear));

    const newGuessContent = guessData.guessContent;
    const newGuessResult = guessData.guessResult;
    if (dist > 1) {
      newGuessContent[guessData.guessNumber] = "wrong";
      newGuessResult[guessData.guessNumber] = {
        selectedCity: selectedCityData[0].name,
        bearing: translateCompass(bear),
        distance: dist,
      };
    } else {
      newGuessContent[guessData.guessNumber] = "correct";
      setGameOpen(false);
    }
    const newGuessNumber = guessData.guessNumber + 1;
    if (newGuessNumber > 5) setGameOpen(false);
    const newGuessData = {
      guessNumber: newGuessNumber,
      guessContent: newGuessContent,
      guessResult: newGuessResult,
    };

    setGuessData(newGuessData);

    console.log("Distance, Bearing: ", dist, bear);
  };

  const changeMap = () => {
    if (showMap) setShowMap(false);
    else setShowMap(true);
  };

  const ConditionalButton = ({ gameOpen }) => {
    if (gameOpen) {
      return (
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
      );
    } else {
      return <ShareButton guessData={guessData} enabled={true} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh", justifyContent: "center" }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={showMap ? 4 : false}
          md={showMap ? 6 : false}
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
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Button
            variant="outlined"
            startIcon={<ChevronLeftIcon />}
            onClick={changeMap}
          >
            Karte
          </Button>
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
                width="100%"
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
              <ConditionalButton gameOpen={gameOpen} />

              <Score guessData={guessData} />
              <Grid container>
                <Grid item xs>
                  <div>
                    {guessData.guessResult[0]
                      ? guessData.guessResult.map((result, index) => (
                          <div key={index}>
                            {index + 1}. {result.selectedCity} - Distanz zum
                            Ziel: {result.distance}km nach {result.bearing}
                          </div>
                        ))
                      : null}
                  </div>
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
