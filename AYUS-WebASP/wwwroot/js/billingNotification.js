let billingData = new Map();

const loadBilling = () => {

	setInterval(() => { updateTable() }, 500);
	setInterval(() => { callAPIBilling() }, 1000);
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

const updateTable = () => {
	const table = document.getElementById('billing-table');
	table.innerHTML = '';

	const mechanics = account_data.filter(a => a.accountStatus.Role.toLowerCase().includes('mechanic'));
	const filter_name = document.getElementById('billing-filter').value;

	billingData.forEach((v, k) => {
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