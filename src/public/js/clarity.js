import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getDatabase, ref, onChildAdded, get, child, limitToLast, query, onValue } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
var ctx = document.getElementById('myChartClarity').getContext('2d');
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

const inputDatesClarity = document.querySelector('.p-dates-clarity')

const selectClarity = document.querySelector('.select-measuresClarity')

const temp = document.getElementById('temperatureClarity');
const rh = document.getElementById('rhClarity');
const no2 = document.getElementById('no2Clarity');
const pm1mass = document.getElementById('pm1massClarity');
const pm1num = document.getElementById('pm1numClarity');
const pm10mass = document.getElementById('pm10massClarity');
const pm10num = document.getElementById('pm10numClarity');
const pm25mass = document.getElementById('pm25massClarity');
const pm25num = document.getElementById('pm25numClarity');
const date = document.getElementById('dateClarity');
const hour = document.getElementById('hourClarity');
const idClarity = document.getElementById('idClarity');
const battery = document.getElementById('batteryClarity');
const model = document.getElementById('modelClarity');
const signal = document.getElementById('signalClarity');
const status = document.getElementById('stateClarity');
const lat = document.getElementById('latClarity');
const lon = document.getElementById('lonClarity');

let clarity = []
const allDates = []

const dbRef = getDatabase();
const commentsRef = ref(dbRef, 'sensors/clarity')
onChildAdded(commentsRef, (data) => {
    clarity = data.val()
    temp.innerHTML = clarity.temperature
    rh.innerHTML = clarity.rh
    no2.innerHTML = clarity.NO2
    pm1mass.innerHTML = clarity.pm1Mass
    pm1num.innerHTML = clarity.pm1Num
    pm10mass.innerHTML = clarity.pm10Mass
    pm10num.innerHTML = clarity.pm10Num
    pm25mass.innerHTML = clarity.pm2_5Mass
    pm25num.innerHTML = clarity.pm2_5Num
    date.innerHTML = clarity.date
    hour.innerHTML = clarity.hour
    model.innerHTML = clarity.model
    idClarity.innerHTML = clarity.deviceID
    status.innerHTML = clarity.batteryStatus
    battery.innerHTML = clarity.batteryValue
    signal.innerHTML = clarity.signal
    lat.innerHTML = clarity.lat
    lon.innerHTML = clarity.lon
}, {
    onlyOn: true
})

const allHours = []
const allTemperatures = []
const allNO2 = []
const allRh = []
const allPm1Mass = []
const allPm1Num = []
const allPm10Mass = []
const allPm10Num = []
const allPm25Mass = []
const allPm25Num = []

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: `Temperatura °C`,
            data: [],
            backgroundColor: 'rgb(255, 0, 0)',
            borderColor: 'rgb(255, 255, 255)',
            tension: 0
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: `Datos tomados clarity`,
                font: { size: 30 },
                color: '#fff'
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 15,
                    font: { size: 16 },
                    color: '#fff'
                }
            },
            tooltips: {
                enabled: true,
                backgroundColor: 'red'
            }
        },
        elements: {
            line: {
                borderWidth: 5,
                borderColor: '#fff'
            },
            point: {
                radius: 7,

            }
        },
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#fff'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#fff'
                }
            }
        },
        layout: {
            padding: {
                bottom: 40
            },
            color: '#fff'
        },
        responsive: true
    }
});

let datesReduced = []

const reference = ref(dbRef, 'sensors/clarity')
onValue(reference, (snap) => {
    const data = snap.val()
    for (const key in data) {
        allDates.push(data[key].date)
        allHours.push(data[key].hour)
        allTemperatures.push(data[key].temperature)
        allNO2.push(data[key].NO2)
        allRh.push(data[key].rh)
        allPm1Mass.push(data[key].pm1Mass)
        allPm1Num.push(data[key].pm1Num)
        allPm10Mass.push(data[key].pm10Mass)
        allPm10Num.push(data[key].pm10Num)
        allPm25Mass.push(data[key].pm2_5Mass)
        allPm25Num.push(data[key].pm2_5Num)
    }
    const hour = allHours.reverse().filter((el, i) => i < 9).reverse()
    const temperature = allTemperatures.reverse().filter((el, i) => i < 9).reverse()
    const no2 = allNO2.reverse().filter((el, i) => i < 9).reverse()
    const rh = allRh.reverse().filter((el, i) => i < 9).reverse()
    const pm1Mass = allPm1Mass.reverse().filter((el, i) => i < 9).reverse()
    const pm1Num = allPm1Num.reverse().filter((el, i) => i < 9).reverse()
    const pm10Mass = allPm10Mass.reverse().filter((el, i) => i < 9).reverse()
    const pm10Num = allPm10Num.reverse().filter((el, i) => i < 9).reverse()
    const pm25Mass = allPm25Mass.reverse().filter((el, i) => i < 9).reverse()
    const pm25Num = allPm25Num.reverse().filter((el, i) => i < 9).reverse()
    datesReduced = allDates.reverse().filter((el, i) => i < 9).reverse()
    const dates = myDates(datesReduced)
    inputDatesClarity.innerHTML = `Fecha de los datos tomados: ${dates}`

    selectClarity.value = "0"
    myChart.data.datasets[0].data = temperature
    myChart.data.datasets[0].label = `Temperatura °C`
    myChart.data.labels = hour
    myChart.update()
    selectClarity.addEventListener('change', updateSelect)
    function updateSelect() {
        const measureClarity = selectClarity.value
        switch (measureClarity) {
            case "0":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = temperature
                myChart.data.datasets[0].label = `Temperatura °C`
                myChart.update()
                break;
            case "1":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = rh
                myChart.data.datasets[0].label = `Humedad Rel. (%)`
                myChart.update()
                break;
            case "2":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = no2
                myChart.data.datasets[0].label = `PPB`
                myChart.update()
                break;
            case "3":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = pm1Mass
                myChart.data.datasets[0].label = `PM1 concentración de masas µg/m3`
                myChart.update()
                break;
            case "4":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = pm1Num
                myChart.data.datasets[0].label = `PM1 concentración de números µg/m3`
                myChart.update()
                break;
            case "5":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = pm10Mass
                myChart.data.datasets[0].label = `PM10 concentración de masas µg/m3`
                myChart.update()
                break;
            case "6":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = pm10Num
                myChart.data.datasets[0].label = `PM10 concentración de números µg/m3`
                myChart.update()
                break;
            case "7":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = pm25Mass
                myChart.data.datasets[0].label = `PM2.5 concentración de masas µg/m3`
                myChart.update()
                break;
            case "8":
                myChart.data.labels = hour
                myChart.data.datasets[0].data = pm25Num
                myChart.data.datasets[0].label = `PM2.5 concentración de números µg/m3`
                myChart.update()
                break;
        }
    }
})
let myDates = (dates) => {
    const datesReduced = dates.reduce((acc, el) => {
        if (!acc[el]) acc[el] = el
        return acc
    }, {})
    const datesFiltered = []
    for (let date in datesReduced) {
        datesFiltered.push(datesReduced[date])
    }
    return datesFiltered
}



