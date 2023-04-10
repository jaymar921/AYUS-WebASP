let availableMechanics = [];
let mechanicMap = new Map();

const loadMechanics = () => {

    callAvailableMechanicAPI();

    setInterval(() => callAvailableMechanicAPI(), 2000);

    setInterval(() => updateAvailableMechanicTable(), 500);

    setInterval(() => updateMap(), 1000);

}

const updateMap = () => {
    availableMechanics.forEach(({ lat, lon, personalInformation }) => {
        if (lat !== 0 && lon !== 0) {
            if (mechanicMap.has(personalInformation.UUID)) {
                mechanicMap.get(personalInformation.UUID).setLatLng(new L.LatLng(lat, lon))
            } else {
                
                let marker = L.marker([lat, lon]).addTo(leafletMap);
                mechanicMap.set(personalInformation.UUID, marker )
            }
            
        }
    })
   
}

const updateAvailableMechanicTable = () => {

    const tableElement = document.querySelector('#available-mechanics-data');
    tableElement.innerHTML = '';

    const filter_name = document.querySelector(`#available-mechanic-search`).value;

    availableMechanics.forEach(mechanic => {

        let USER_DATA = account_data.filter(s => s.personalInformation.UUID === mechanic.personalInformation.UUID)[0];
        const row = document.createElement('tr');
        row.addEventListener('click', (e) => {
            // This moves the map to a single LatLng
            var pos = mechanicMap.get(USER_DATA.personalInformation.UUID).getLatLng();
            leafletMap.setView([pos.lat, pos.lng]);
        })

        const user = document.createElement('td');
        user.innerHTML = `${USER_DATA.personalInformation.Firstname} ${USER_DATA.personalInformation.Lastname}`;


        const rating = document.createElement('td');
        let stars = '';
        let rate = USER_DATA.accountStatus.Rating;
        for (let i = 1; i <= 5; i++) {
            stars += (rate >= i ? `<i class="fa-solid fa-star">` : `<i class="fa-regular fa-star">`);
        }
        rating.innerHTML = stars;

        const onlineStatus = document.createElement('td');
        onlineStatus.innerHTML = USER_DATA.accountStatus.IsOnline ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`;

        const restricted = document.createElement('td');
        restricted.innerHTML = USER_DATA.accountStatus.IsLocked ? 'YES' : 'NO';

        row.appendChild(user);
        row.appendChild(rating);
        row.appendChild(onlineStatus);
        row.appendChild(restricted);

        if (!USER_DATA.personalInformation.Lastname.toLowerCase().includes(filter_name) &&
            !USER_DATA.personalInformation.Firstname.toLowerCase().includes(filter_name) &&
            filter_name !== '') { }
        else {
            tableElement.appendChild(row);
        }
        
    })
}


const callAvailableMechanicAPI = () => {
    if (currentWindow !== '' && currentWindow !== 'mechanics')
        return;
    fetch(apiurl + "/api/Sessions/AvailableMechanics", {
        method: 'GET',
        headers: {
            'AYUS-API-KEY': apikey,
        }
    })
        .then(r => r.json())
        .then(d => {
            availableMechanics = [];
            d.forEach(mechanic => {
                fetch(apiurl + "/api/TemporaryRoute/MapLocation", {
                    method: 'GET',
                    headers: {
                        'AYUS-API-KEY': apikey,
                        "UUID": mechanic.personalInformation.UUID,
                    }
                }).then(r => r.json())
                    .then(dd => {
                        let lat = 0;
                        let lon = 0;
                        let adData = '';
                        if (dd.Status === 200) {
                            lat = dd.Data.Latitude;
                            lon = dd.Data.Longitude;
                            adData = dd.Data.AdditionData;
                        }
                        availableMechanics.push({
                            ...mechanic,
                            lat,
                            lon,
                            adData
                        })
                    })
            })
        });

}