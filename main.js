const fieldIp = document.getElementById("fieldIp");
const btnSearch = document.getElementById("btnSearch");
const ipRegex =
  /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
const error = document.getElementById("error-message");
const apiKey = "at_fpbJKGNQtYZLEeEpyAtSsTlyvC5fZ";

btnSearch.addEventListener("click", () => {
  const ipValue = fieldIp.value.trim();
  if (ipRegex.test(ipValue)) {
    error.style.display = "none";
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipValue}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok" + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        let ip_address = data.ip || "Unknown";
        let country = data.location.country || "Unknown";
        let region = data.location.region || "Unknown";
        let city = data.location.city || "Unknown";
        let timezone = data.location.timezone || "Unknown";
        let isp = data.isp || "Unknown";

        showData(ip_address, country, region, city, timezone, isp);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  } else {
    error.style.display = "block";
  }
});

function showData(ipcountry, country, region, city, timezone, isp) {
  const ipElement = document.getElementById("ipAddress");
  const countryElement = document.getElementById("country");
  const zoneElement = document.getElementById("timezone");
  const ispElement = document.getElementById("company");

  console.log(ipcountry, country, region, city, timezone, isp);

  ipElement.textContent = ipcountry;
  countryElement.textContent = `${country}, ${region}, ${city}`;
  zoneElement.textContent = timezone;
  ispElement.textContent = isp;
}
