
let history_data = []
const loadHistory = () => {
	setInterval(() => loadHistoryAPI(), 1000);
	setInterval(() => updateUI(), 1000);
}

const updateUI = () => {
	const tableData = document.getElementById('history-data');
	tableData.innerHTML = '';

	const filter_name = document.querySelector('#log-search').value.toLowerCase();

	history_data.forEach(log => {
		const row = document.createElement('tr');

		const id = document.createElement('td');
		id.innerHTML = log.Id;

		const dt = document.createElement('td');
		dt.innerHTML = log.Date;

		const info = document.createElement('td');
		info.innerHTML = log.Info;

		row.appendChild(id);
		row.appendChild(dt);
		row.appendChild(info);

		if (!log.Info.toLowerCase().includes(filter_name) &&
			filter_name !== '') { }
		else {
			tableData.appendChild(row);
		}
		
	})
}

const loadHistoryAPI = () => {
	fetch(apiurl + "/api/System/Logs", {
		method: 'GET',
		headers: {
			"AYUS-API-KEY": apikey,
		}
	}).then(r => r.json())
		.then(d => history_data=d.Data);
}