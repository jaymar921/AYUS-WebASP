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

    const option = document.getElementById('wallet-option').value;
    console.log(option)
    const balance = parseInt(tempUserBal.replace('<i class="fa-solid fa-peso-sign"></i> ', ''));
    if (option === 'reload') {
        const newBalance = parseInt(document.getElementById('wallet-amount').value) + balance;
        fetch(apiurl + "/api/Wallet?uuid=" + tempUserId, {
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
    } else {
        const amount = parseInt(document.getElementById('wallet-amount').value);
        if (amount > balance) {
            element.disabled = false;
            alert('Amount to cashout should not be\ngreater than balance');
            return;
        }
        if (balance <= 0) {
            element.disabled = false;
            alert('Could not cashout on 0 balance');
            return;
        }
        const fullname = document.getElementById('wallet-account').innerHTML;
        // url = http://localhost:5043/gcash?merchant=AYUS@ICTEAM&amount=100&redirecturl=AYUS_UID_2029bdd8-a44f-4e53-93dd-5b6d07a199be_AMT_100
        window.open(`/gcash?merchant=${fullname}&amount=${amount}&redirecturl=AYUS_UID_${tempUserId}_AMT_${-amount}`);
        element.disabled = false;
    }
    
    document.getElementById('wallet-amount').value = '';
}