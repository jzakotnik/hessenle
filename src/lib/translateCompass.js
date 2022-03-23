import {
  ArrowUpCircle,
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  ArrowDownRightCircle,
  ArrowDownLeftCircle,
  ArrowUpRightCircle,
  ArrowUpLeftCircle,
} from "react-bootstrap-icons";

export default function translateCompass(direction) {
  const dir = direction;
  switch (dir) {
    case "NNE":
      return <ArrowUpRightCircle />;
    case "NE":
      return <ArrowUpRightCircle />;
    case "ENE":
      return <ArrowUpRightCircle />;
    case "E":
      return <ArrowRightCircle />;
    case "ESE":
      return <ArrowDownRightCircle />;
    case "SE":
      return <ArrowDownRightCircle />;
    case "SSE":
      return <ArrowDownRightCircle />;
    case "S":
      return <ArrowDownCircle />;
    case "SSW":
      return <ArrowDownLeftCircle />;
    case "SW":
      return <ArrowDownLeftCircle />;
    case "WSW":
      return <ArrowDownLeftCircle />;
    case "W":
      return <ArrowLeftCircle />;
    case "WNW":
      return <ArrowUpLeftCircle />;
    case "NW":
      return <ArrowUpLeftCircle />;
    case "NNW":
      return <ArrowUpLeftCircle />;
    default:
      return <ArrowUpCircle />;
  }
}
