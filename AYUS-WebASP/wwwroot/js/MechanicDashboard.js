let availableMechanics = [];
let mechanicMap = new Map();

const loadMechanics = () => {

    callAvailableMechanicAPI();

    setInterval(() => { callServiceAPI(); }, 2000);

    setInterval(() => { callAvailableMechanicAPI(); }, 5000);

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
            if (d.Status === 404)
                return;
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

// available-services table;

const callServiceAPI = () => {
    fetch(apiurl + '/api/System/Service', {
        headers: {
            'AYUS-API-KEY': apikey,
        }
    }).then(r => r.json())
    .then(d => {
        const table = document.getElementById('available-services');
        table.innerHTML = '';
        d.Services.forEach(service => {
            const trow = document.createElement('tr');

            const sname = document.createElement('td');
            sname.innerHTML = service.ServiceName;
            sname.title = service.ServiceDescription;

            const sdesc = document.createElement('td');
            sdesc.innerHTML = service.ServiceDescription;

            const sdel = document.createElement('td');

            const btn = document.createElement('button');
            btn.addEventListener('click', (e) => { deleteService(service.ServiceID); });
            btn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
            btn.classList.add('btn-whitish');
            sdel.appendChild(btn);

            trow.appendChild(sname);
            trow.appendChild(sdesc);
            trow.appendChild(sdel);
            table.appendChild(trow);
        });
    })
}

const deleteService = (serviceID) => {
    if (confirm('You are going to delete a service')) {
        fetch(apiurl + '/api/System/Service', {
            method: 'DELETE',
            headers: {
                'AYUS-API-KEY': apikey,
                'ServiceID': serviceID
            }
        }).then(r => r.json())
        .then(d => {
            if (d.Status === 200) {
                alert('Service was successfully deleted');
            }
        })
    }
}
const addService = () => {
    let service = document.getElementById('mechanic-services-input').value;
    let desc = document.getElementById('mechanic-services-desc').value;

    fetch(apiurl + '/api/System/Service', {
        method: 'POST',
        headers: {
            'AYUS-API-KEY': apikey,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            "ServiceName": `${service}`,
            "ServiceDescription": `${desc}`
        })
    }).then(r => r.json())
    .then(d => {
        if (d.Status === 201) {
            alert('Service was successfully added into the system');
            document.getElementById('mechanic-services-input').value = '';
            document.getElementById('mechanic-services-desc').value = '';
        }
    })
}