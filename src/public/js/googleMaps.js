import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, get, child, limitToLast, query, onValue } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";

var map;
var firebaseConfig = {
  apiKey: "AIzaSyDeawHKlf1NBvPDIUer0sYDxn7WrIIL3ag",
  authDomain: "mysensorinfo.firebaseapp.com",
  databaseURL: "https://mysensorinfo-default-rtdb.firebaseio.com",
  projectId: "mysensorinfo",
  storageBucket: "mysensorinfo.appspot.com",
  messagingSenderId: "72274332118",
  appId: "1:72274332118:web:b0ee741dcfe8604fa13c77",
  measurementId: "G-RZMGVP8RQT"
};

// Initialize Firebase
initializeApp(firebaseConfig);


let marker
function initMap() {
  const coords = {
    lat: 4.7499,
    lng: -74.0333
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: coords,
    zoom: 16,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  const icaCounts = [0.0, 51.0, 101.0, 151.0, 201.0, 301.0, 500.0]
  const pm25Counts = [0.0, 12.0, 37.0, 55.0, 150.0, 250.0, 500.0]

  const db = getDatabase()
  const myRef = query(ref(db, 'sensors/modulairPm'), limitToLast(1))
  onValue(myRef, (data) => {
    data.forEach((doc) => {
      const modulair = doc.val()
      let ica
      for(let i = 0; i < icaCounts.length - 1; i++) {
        if(modulair.pm25 >= pm25Counts[i] && modulair.pm25 < pm25Counts[i + 1]) {
          ica = ((modulair.pm25 - pm25Counts[i]) * (icaCounts[i + 1] - icaCounts[i]) / (pm25Counts[i + 1] - pm25Counts[i])) + icaCounts[i]
        }
      }

      const info =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h4 id="firstHeading" class="firstHeading">Datos en tiempo real</h4>' +
        '<div id="bodyContent">' +
        `<p>Índice de calidad de aire ICA: ${ica.toFixed(0)}  </p>` +
        `<p>Temperatura: ${modulair.temperature} °C </p>` +
        `<p>Humedad: ${modulair.temperature} (%) </p>` +
        `<p>PM1: ${modulair.pm1} µg/m3 </p>` +
        `<p>PM10: ${modulair.pm10} µg/m3 </p>` +
        `<p>PM2.5: ${modulair.pm25} µg/m3 </p>` +
        `<p>Fecha: ${modulair.date} </p>` +
        `<p>Hora: ${modulair.hour} </p>` +
        "</div>" +
        "</div>";
      
      const infowindow = new google.maps.InfoWindow({
        content: info,
        maxWidth: 400,
      });
      
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: 'Sensor'
      })
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      })
      marker.addListener('click', () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        })
      })
      marker.setAnimation(google.maps.Animation.BOUNCE)
    })
  }, { onlyOnce: true })
}

export default initMap()