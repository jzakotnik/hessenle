import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";

//import { UAParser } from "ua-parser-js";

//const webShareApiDeviceTypes: string[] = ["mobile", "smarttv", "wearable"];
//const parser = new UAParser();
//const browser = parser.getBrowser();
//const device = parser.getDevice();

const canonical = document.querySelector("link[rel=canonical]");
let url = canonical ? canonical.href : document.location.href;
const shareDetails = { url, title: "Hessenle.de", text: "Tag 23" };

const handleSharing = async (guessData) => {
  console.log("Sharing game result ", guessData);
  if (navigator.share) {
    try {
      await navigator
        .share(shareDetails)
        .then(() =>
          console.log("Hooray! Your content was shared to tha world")
        );
    } catch (error) {
      console.log(`Oops! I couldn't share to the world because: ${error}`);
    }
  } else {
    // fallback code
    console.log(
      "Web share is currently not supported on this browser. Please provide a callback"
    );
  }
};

export function ShareButton({ enabled, guessData }) {
  if (enabled) {
    return (
      <Button
        startIcon={<ShareIcon />}
        onClick={handleSharing}
        disabled={false}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Teilen
      </Button>
    );
  } else return <div></div>;
}
