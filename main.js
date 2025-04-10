const fieldIp = document.getElementById("fieldIp");
const btnSearch = document.getElementById("btnSearch");
const ipRegex =
  /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
const error = document.getElementById("error-message");
const apiKey = "at_fpbJKGNQtYZLEeEpyAtSsTlyvC5fZ";
const iconPosition = "./images/icon-location.svg";

document.addEventListener("DOMContentLoaded", () => {
  getClientIp().then((clientIp) => {
    fetchIpData(clientIp);
  });
});

function getClientIp() {
  return fetch("https://api64.ipify.org?format=json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch client IP");
      }
      return response.json();
    })
    .then((data) => data.ip)
    .catch((error) => {
      console.error("Error fetching client IP:", error);
      return "8.8.8.8"; // Fallback IP
    });
}

btnSearch.addEventListener("click", () => {
  const ipValue = fieldIp.value.trim();
  if (ipRegex.test(ipValue)) {
    error.style.display = "none";
    fetchIpData(ipValue);
  } else {
    error.style.display = "block";
  }
});

function fetchIpData(ipValue) {
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
      let timezone = data.location.timezone || "Unknown";
      let isp = data.isp || "Unknown";
      let lat = data.location.lat || 0;
      let lng = data.location.lng || 0;

      showData(ip_address, country, region, timezone, isp);
      getLocation(lat, lng);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function showData(ipcountry, country, region, timezone, isp) {
  const ipElement = document.getElementById("ipAddress");
  const countryElement = document.getElementById("country");
  const zoneElement = document.getElementById("timezone");
  const ispElement = document.getElementById("company");

  console.log(ipcountry, country, region, timezone, isp);

  ipElement.textContent = ipcountry;
  countryElement.textContent = `${country}, ${region}`;
  zoneElement.textContent = `UTC ${timezone}`;
  ispElement.textContent = isp;
}

function getLocation(lat, long) {
  let mapElement = document.getElementById("myMap");
  let map = L.map(mapElement, {
    center: [lat, long],
    zoom: 14,
    zoomControl: true, // Asegura que los controles de zoom estén habilitados
  });

  // Mover los controles de zoom a la esquina inferior izquierda
  map.zoomControl.setPosition("bottomleft");

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Crear un ícono personalizado
  let customIcon = L.icon({
    iconUrl: iconPosition, // Ruta de la imagen
    iconSize: [25, 41], // Tamaño del ícono
    iconAnchor: [12, 41], // Punto de anclaje del ícono
    popupAnchor: [1, -34], // Punto de anclaje del popup
  });

  // Usar el ícono personalizado en el marcador
  let marker = L.marker([lat, long], { icon: customIcon }).addTo(map);
  marker.bindPopup("You are here").openPopup();
}
