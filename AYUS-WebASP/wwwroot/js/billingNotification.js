let billingData = new Map();

const loadBilling = () => {

	setInterval(() => { updateTable() }, 500);
	setInterval(() => { callAPIBilling() }, 1000);
	setTimeout(() => { updateGraph() }, 3000);
	setInterval(() => { updateGraph() }, 25000);
}

const callAPIBilling = () => {
	if (currentWindow !== '' && currentWindow !== 'billing')
		return;
	const mechanics = account_data.filter(a => a.accountStatus.Role.toLowerCase().includes('mechanic'));

	mechanics.forEach(m => {
		fetch(apiurl + "/api/history", {
			method: "GET",
			headers: {
				"AYUS-API-KEY": apikey,
				"UserID": m.personalInformation.UUID,
				'option': 'billing',
				"limit": 100
			}
		}).then(r => r.json())
			.then(d => {
				if (d.data.length > 0) {
					billingData.set(m.personalInformation.UUID, d.data);
				}
			})
	})
}

const updateGraph = () => {
	const revenueData = new Map();
	const services = new Map();
	billingData.forEach(d => {


		d.forEach(bill => {
			// get the billing date
			const month = new Date(bill.BillingDate).getMonth();
			if (revenueData.has(month))
				revenueData.set(month, revenueData.get(month) + bill.ServiceFee);
			else
				revenueData.set(month, bill.ServiceFee);

			let service = bill.ServiceRemark;
			service = service.split(' at ')[0];
			service = service.replace('Billing for service ', '');
			service = service.trim();
			if (service !== 'B') {
				if (services.has(service)) {
					services.set(service, services.get(service) + 1);
				} else {
					services.set(service, 1);
				}
			}
		})
	})
	const revenueDataArr = new Array();
	let total = 0;
	for (let i = 0; i < 12; i++) {
		revenueDataArr.push(revenueData.get(i));
		if(revenueData.has(i))
			total += revenueData.get(i);
	}

	let demandAmt = 0;
	let demandKey = '';
	services.forEach((v, k) => {
		if (v > demandAmt) {
			demandAmt = v;
			demandKey = k;
		}
	})

	document.getElementById('billing-total-revenue').innerHTML = `Total Revenue: PHP ${total}`;
	document.getElementById('billing-total-services').innerHTML = `Service Demand: ${demandKey}`;
	
	const chart = document.getElementById('billing-chart').getContext('2d');
	const data = {
		labels: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],
		datasets: [{
			label: 'Revenue',
			data: revenueDataArr,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)',
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)',
			],
			borderColor: [
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)',
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)',
			],
			borderWidth: 1
		}]
	};

	const serviceChart = document.getElementById('service-chart').getContext('2d');
	const data2 = {
		labels: [...services.keys()],
		datasets: [{
			label: 'Services',
			data: [...services.values()],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)',
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)',
			],
			borderColor: [
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)',
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)',
			],
			borderWidth: 1
		}]
	};

	new Chart(chart, { type: 'bar', data });
	new Chart(serviceChart, { type: 'pie', data: data2 });
}

const updateTable = () => {
	
	const table = document.getElementById('billing-table');
	table.innerHTML = '';

	const mechanics = account_data.filter(a => a.accountStatus.Role.toLowerCase().includes('mechanic'));
	const filter_name = document.getElementById('billing-filter').value;

	const sortedMap = new Map([...billingData.entries()].sort((a, b) => a[1].BillingDate - b[1].BillingDate));

	sortedMap.forEach((v, k) => {
		v.forEach(bill => {

			const mechanicData = mechanics.filter(i => i.accountStatus.Shop.ShopID === bill.ShopID)[0];

			const row = document.createElement('tr');

			const mechanic = document.createElement('td');
			mechanic.innerHTML = `${mechanicData.personalInformation.Firstname} ${mechanicData.personalInformation.Lastname}`;

			const shop = document.createElement('td');
			shop.innerHTML = mechanicData.accountStatus.Shop.ShopName;

			const date = document.createElement('td');
			date.innerHTML = new Date(bill.BillingDate).toDateString();
			date.title = new Date(bill.BillingDate).toTimeString();

			const fee = document.createElement('td');
			fee.innerHTML = "P"+bill.ServiceFee;

			const remark = document.createElement('td');
			remark.innerHTML = bill.ServiceRemark;

			row.appendChild(mechanic);
			row.appendChild(shop);
			row.appendChild(date);
			row.appendChild(fee);
			row.appendChild(remark);

			if (!mechanicData.personalInformation.Lastname.toLowerCase().includes(filter_name) &&
				!mechanicData.personalInformation.Firstname.toLowerCase().includes(filter_name) &&
				filter_name !== '') { }
			else {
				table.appendChild(row);
			}
			
		})
	})
}

updateGraph();

