export const loadAccounts = () => {
    callAccountsAPI();
    setInterval(() => callAccountsAPI(), 10000);
    callReportAPI();
    setInterval(() => callReportAPI(), 10000);

    setInterval(() => updateAccountsTable(), 500);
}

const callAccountsAPI = () => {
    fetch(apiurl + "/api/Account", {
        method: 'GET',
        headers: {
            'AYUS-API-KEY': apikey,
            'option': 'all'
        }
    })
        .then(r => r.json())
        .then(d => {
            account_data = d.Accounts;
        })
        .catch(e => account_data = []);
}

const callReportAPI = () => {
    fetch(apiurl + "/api/Account/Report", {
        method: 'GET',
        headers: {
            'AYUS-API-KEY': apikey,
        }
    })
        .then(r => r.json())
        .then(d => {
            report_data = d.Data;
        })
        .catch(e => report_data = []);
}

const updateAccountsTable = () => {

    const accounts_table = document.querySelector('#accounts-data');
    const filter_name = document.querySelector('#account-search').value.toLowerCase();

    accounts_table.innerHTML = ''; // CLEARING THE CHILD NODES

    account_data.forEach(account => {

        const row = document.createElement('tr');
        row.id = account.personalInformation.UUID;

        const user = document.createElement('td');
        user.innerHTML = `${account.personalInformation.Firstname} ${account.personalInformation.Lastname}`;

        const role = document.createElement('td');
        role.innerHTML = `${account.accountStatus.Role}`;

        const rating = document.createElement('td');
        let stars = '';
        let rate = account.accountStatus.Rating;
        for (let i = 1; i <= 5; i++) {
            stars += rate >= i ? `<i class="fa-solid fa-star">` : `<i class="fa-regular fa-star">`;
        }
        rating.innerHTML = stars;

        const onlineStatus = document.createElement('td');
        onlineStatus.innerHTML = account.accountStatus.IsOnline ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`;

        const restricted = document.createElement('td');
        restricted.innerHTML = account.accountStatus.IsLocked ? 'YES' : 'NO';

        row.appendChild(user);
        row.appendChild(role);
        row.appendChild(rating);
        row.appendChild(onlineStatus);
        row.appendChild(restricted);



        if (!account.personalInformation.Lastname.toLowerCase().includes(filter_name) &&
            !account.personalInformation.Firstname.toLowerCase().includes(filter_name) &&
            filter_name !== '') { }
        else {
            accounts_table.appendChild(row);
        }
    });

}