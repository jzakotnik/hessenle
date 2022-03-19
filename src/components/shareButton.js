import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";

import { UAParser } from "ua-parser-js";

const webShareApiDeviceTypes: string[] = ["mobile", "smarttv", "wearable"];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

const attemptShare = (shareData) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf("FIREFOX") === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? "") !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  );
};

const handleShare = (handleShareToClipboard: () => void) => {
  const textToShare = "hallo share";

  const shareData = { text: textToShare };

  let shareSuccess = false;

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare);
    handleShareToClipboard();
  }
};

export function ShareButton(props) {
  return (
    <Button
      startIcon={<ShareIcon />}
      onClick={handleShare}
      disabled={false}
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      Teilen
    </Button>
  );
}
