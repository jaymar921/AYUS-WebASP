const loadWallets = () => {

    setInterval(() => updateWalletTable(), 500);
}

const updateWalletTable = () => {

    const table = document.getElementById('billing-data');
    table.innerHTML = '';

    const filter_name = document.getElementById('wallet-search').value.toLowerCase();
    account_data.forEach(user => {

        const row = document.createElement('tr');

        const USER = document.createElement('td');
        USER.innerHTML = `${user.personalInformation.Firstname} ${user.personalInformation.Lastname}`;

        const Role = document.createElement('td');
        Role.innerHTML = user.accountStatus.Role;

        const Balance = document.createElement('td');
        Balance.innerHTML = `<i class="fa-solid fa-peso-sign"></i> ${user.wallet.Balance}`;

        row.appendChild(USER);
        row.appendChild(Role);
        row.appendChild(Balance);

        if (!user.personalInformation.Lastname.toLowerCase().includes(filter_name) &&
            !user.personalInformation.Firstname.toLowerCase().includes(filter_name) &&
            filter_name !== '') { }
        else {
            table.appendChild(row);
        }
        
    });
}