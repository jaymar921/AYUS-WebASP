let pendingRequests = new Map();
let completedRequests = new Map();
let ongoingRequests = new Map();
const loadNotifications = () => {

	setInterval(() => loadNotifAPI(), 2000);

	setInterval(() => updateRequestTable(), 1000);

	setInterval(() => loadNotifCompletedAPI(), 1000);
	setInterval(() => updateCompletedTable(), 1000);
}

const updateRequestTable = () => {
	const table = document.getElementById('notif-requests');
	table.innerHTML = '';

	pendingRequests.forEach((v, k) => {
		v.forEach(req => {
			let clientData = account_data.filter(a => a.personalInformation.UUID === req.Requestor)[0];
			let mechanicData = account_data.filter(a => a.personalInformation.UUID === req.Recepient)[0];


			let { Service, Status } = req;

			const row = document.createElement('tr');

			const client = document.createElement('td');
			client.innerHTML = `${clientData.personalInformation.Firstname} ${clientData.personalInformation.Lastname}`;

			const mechanic = document.createElement('td');
			mechanic.innerHTML = `${mechanicData.personalInformation.Firstname} ${mechanicData.personalInformation.Lastname}`;

			const service = document.createElement('td');
			service.innerHTML = Service;

			const status = document.createElement('td');
			status.innerHTML = Status;

			row.appendChild(client);
			row.appendChild(mechanic);
			row.appendChild(service);
			row.appendChild(status);

			table.appendChild(row);
		})
	});

}

const loadNotifAPI = () => {
	if (currentWindow !== '' && currentWindow !== 'notifications')
		return;
    const mechanics = account_data.filter(a => a.accountStatus.Role.toLowerCase().includes('mechanic'));
    mechanics.forEach(m => {
		fetch(apiurl + "/api/ServiceRequest", {
			method: "GET",
			headers: {
				"AYUS-API-KEY": apikey,
				"MechanicUUID": m.personalInformation.UUID
			}
		}).then(r => r.json())
			.then(d => {
				if (d.ServiceRequests.length > 0) {
					pendingRequests.set(m.personalInformation.UUID, d.ServiceRequests)
				}
			})
    })
}

const updateCompletedTable = () => {
	// notif-completed

	const table = document.querySelector('#notif-completed');
	table.innerHTML = '';

	completedRequests.forEach((v, k) => {
		v.forEach(request => {
			const { ClientUUID, MechanicUUID, TimeEnd, SessionID } = request;

			const clientData = account_data.filter(a => a.personalInformation.UUID === ClientUUID)[0];
			const mechanicData = account_data.filter(a => a.personalInformation.UUID === MechanicUUID)[0];

			const row = document.createElement('tr');
			row.addEventListener('click', (e) => {
				openCompleteDetails(request);
			})

			const client = document.createElement('td');
			client.innerHTML = `${clientData.personalInformation.Firstname} ${clientData.personalInformation.Lastname}`;

			const mechanic = document.createElement('td');
			mechanic.innerHTML = `${mechanicData.personalInformation.Firstname} ${mechanicData.personalInformation.Lastname}`;

			const date = document.createElement('td');
			date.innerHTML = new Date(TimeEnd).toDateString();
			date.title = new Date(TimeEnd).toTimeString();

			const completed = document.createElement('td');
			completed.innerHTML = 'DONE';

			row.appendChild(client);
			row.appendChild(mechanic);
			row.appendChild(date);
			row.appendChild(completed);

			table.appendChild(row);

		})
	})
}

const loadNotifCompletedAPI = () => {
	if (currentWindow !== '' && currentWindow !== 'notifications')
		return;
	const mechanics = account_data.filter(a => a.accountStatus.Role.toLowerCase().includes('mechanic'));

	mechanics.forEach(m => {
		fetch(apiurl + "/api/history", {
			method: "GET",
			headers: {
				"AYUS-API-KEY": apikey,
				"UserID": m.personalInformation.UUID,
				'option': 'session',
				"limit": 20 
			}
		}).then(r => r.json())
			.then(d => {
				if (d.data.length > 0) {
					ongoingRequests.set(m.personalInformation.UUID, d.data.filter(a => a.isActive));
					completedRequests.set(m.personalInformation.UUID, d.data.filter(a => !a.isActive && a.TimeEnd != null));
				}
			})
	})
}

const openCompleteDetails = (Session) => {

	// modal 
	openWindow(document.querySelector('#notif_completed_modal'));


	const clientData = account_data.filter(a => a.personalInformation.UUID === Session.ClientUUID)[0];
	const mechanicData = account_data.filter(a => a.personalInformation.UUID === Session.MechanicUUID)[0];

	const client = document.getElementById('notif-client');
	const mechanic = document.getElementById('notif-mechanic');
	const service = document.getElementById('notif-service');
	const details = document.getElementById('notif-details')
	const date = document.getElementById('notif-date');
	const price = document.getElementById('notif-price');
	const remark = document.getElementById('notif-remark');

	// populate

	client.innerHTML = `${clientData.personalInformation.Firstname} ${clientData.personalInformation.Lastname}`.toUpperCase();
	mechanic.innerHTML = `${mechanicData.personalInformation.Firstname} ${mechanicData.personalInformation.Lastname}`.toUpperCase();

	details.innerHTML = Session.SessionDetails;

	// get the transaction
	fetch(apiurl + "/api/Transaction", {
		method: "GET",
		headers: {
			"AYUS-API-KEY": apikey,
			"TransactionID": Session.TransactionID,
		}
	}).then(r => r.json())
		.then(d => {
			const { DateOfTransaction, Remark, ServicePrice, ServiceName } = d.Info;

			service.innerHTML = ServiceName;
			date.innerHTML = new Date(DateOfTransaction).toDateString();
			date.title = new Date(DateOfTransaction).toTimeString();
			remark.innerHTML = Remark;
			price.innerHTML = "P"+ServicePrice;
		})
}