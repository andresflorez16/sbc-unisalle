const modulairPM = (data, info) => {
    const tiempo = data.timestamp_local
    const fullDate = new Date(data.timestamp_local)
    const test = fullDate.toLocaleString('es-MX', { timeZone: 'America/Guayaquil' }).split(' ')
    const date = test[0]
    const hora = tiempo.slice(11, 16)

    return sensor = {
        'id': tiempo,
        'temperature': data.met.temp.toFixed(1),
        'rh': data.met.rh,
        'pm1' : data.pm1.toFixed(2),
        'pm10' : data.pm10.toFixed(2),
        'pm25' : data.pm25.toFixed(2),
        'date': date,
        'hour' : hora,
        'model': info.model,
        'description': info.description,
        'country' : info.country,
        'city' : info.city,
        'status' : info.status,
        'sn': info.sn,
        'battery' : 'NA',
        'lat': info.geo.lat,
        'lon' : info.geo.lon
    }
}
module.exports = modulairPM