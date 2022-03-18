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
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import moment from "moment";

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

export default function Quiz() {
  const [cities, setCities] = useState(["Kronberg im Taunus"]);
  const [dayOfYear, setDayOfYear] = useState(0);

  useEffect(() => {
    setDayOfYear(moment().dayOfYear());
    fetch("./cities.json")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);
        setCities(data.cities);
      })
      .catch(function (err) {
        console.log(err, " error");
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Handled guess...", event);
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LocationOnIcon />
            </Avatar>
            <Box>
              <img src="/cityImages/city77.jpg" height="200" alt="City image" />
            </Box>
            <Typography component="h1" variant="h5">
              Wo bin ich in Hessen?
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Autocomplete
                freeSolo
                id="city-autocomplete"
                disableClearable
                options={cities}
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
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Das ist es!
              </Button>
              <Grid container>
                <Grid item xs></Grid>
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
