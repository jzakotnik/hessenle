export default function translateCompass(direction) {
  const dir = direction;
  switch (dir) {
    case "NNE":
      return "Nord-Ost";
    case "NE":
      return "Nord-Ost";
    case "ENE":
      return "Nord-Ost";
    case "E":
      return "Ost";
    case "ESE":
      return "Süd-Ost";
    case "SE":
      return "Süd-Ost";
    case "SSE":
      return "Süd-Ost";
    case "S":
      return "Süd";
    case "SSW":
      return "Süd-West";
    case "SW":
      return "Süd-West";
    case "WSW":
      return "Süd-West";
    case "W":
      return "West";
    case "WNW":
      return "Nord-West";
    case "NW":
      return "Nord-West";
    case "NNW":
      return "Nord-West";
    default:
      return "Nord";
  }
}
