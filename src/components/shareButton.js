import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import moment from "moment";

//import { UAParser } from "ua-parser-js";

//const webShareApiDeviceTypes: string[] = ["mobile", "smarttv", "wearable"];
//const parser = new UAParser();
//const browser = parser.getBrowser();
//const device = parser.getDevice();

const canonical = document.querySelector("link[rel=canonical]");
let url = canonical ? canonical.href : document.location.href;

const getEmojiTiles = (isDarkMode, isHighContrastMode) => {
  let tiles = [];
  tiles.push(isHighContrastMode ? "🟧" : "🟩");
  tiles.push(isHighContrastMode ? "🟦" : "🟨");
  tiles.push(isDarkMode ? "⬛" : "⬜");
  return tiles;
};

function createEmojiGrid(guessContent) {
  const emojiArray = guessContent.map((g) => {
    if (g === "open") return "🟦";
    if (g === "wrong") return "🔴";
    if (g === "correct") return "✅";
  });
  console.log("Emoji Array composed: ", emojiArray);
  const dayOfYear = moment().dayOfYear();
  const resultString =
    "Hessenle Quiz " + dayOfYear + ": \n" + emojiArray + "\n";

  return resultString;
}

const handleSharing = async (guessData) => {
  console.log("Sharing game result ", guessData);
  const shareDetails = {
    url,
    title: "Hessenle.de",
    text: createEmojiGrid(guessData.guessContent),
  };
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
        onClick={() => handleSharing(guessData)}
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
