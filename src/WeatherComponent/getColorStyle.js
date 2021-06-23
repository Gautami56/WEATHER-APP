export default function getcolorUpdated(rowCell) {
  let colorUpdated = "";
  if (rowCell && rowCell.row.aqi) {
    let aqi = rowCell.row.aqi;
    if (aqi >= 0 && aqi <= 50) {
      colorUpdated = "#32CD32";
    } else if (aqi >= 51 && aqi <= 100) {
      colorUpdated = "#ADFF2F";
    } else if (aqi >= 101 && aqi <= 200) {
      colorUpdated = "yellow";
    } else if (aqi >= 201 && aqi <= 300) {
      colorUpdated = "orange";
    } else if (aqi >= 301 && aqi <= 400) {
      colorUpdated = "red";
    } else if (aqi >= 401 && aqi <= 500) {
      colorUpdated = "brown";
    }
    return colorUpdated;
  }
}
