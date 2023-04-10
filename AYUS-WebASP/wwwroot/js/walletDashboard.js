const loadWallets = () => {

    setInterval(() => updateWalletTable(), 500);
}

const updateWalletTable = () => {

    const table = document.getElementById('billing-data');
    table.innerHTML = '';

    const filter_name = document.getElementById('wallet-search').value.toLowerCase();
    account_data.forEach(user => {

        const row = document.createElement('tr');
        row.addEventListener('click', (e) => {
            openWalletModal(user.personalInformation.UUID, `${user.personalInformation.Firstname} ${user.personalInformation.Lastname}`.toUpperCase(), `<i class="fa-solid fa-peso-sign"></i> ${user.wallet.Balance}` )
        })

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

let tempUserId = undefined;
let tempUserBal = undefined;

const openWalletModal = (uuid, fullname, balance) => {
    openWindow(document.getElementById('wallet_modal'))
    tempUserId = uuid;
    tempUserBal = balance;
    document.getElementById('wallet-account').innerHTML = fullname;
    document.getElementById('wallet-balance').innerHTML = balance;
}

function addBalance(element) {
    element.disabled = true;
    const newBalance = parseInt(document.getElementById('wallet-amount').value) + parseInt(tempUserBal.replace('<i class="fa-solid fa-peso-sign"></i> ',''));
    fetch(apiurl + "/api/Wallet?uuid="+tempUserId, {
        method: "PUT",
        headers: {
            "AYUS-API-KEY": apikey,
            "newbalance": parseInt(newBalance)
        }
    }).then(r => r.json())
        .then(d => {
            closeWindow(document.getElementById('wallet_modal'))
            element.disabled = false;
        })
        .catch(e => {
            element.disabled = false;
        })

}