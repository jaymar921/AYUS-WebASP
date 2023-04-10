/*
    Buttons listener
*/

let currentWindow = '';

const menu = (option) => {

    if(currentWindow){
        document.querySelector(`#${currentWindow}`).classList.remove('active');
    }

    try{
        closeWindow(document.querySelector(`#${currentWindow}-dashboard`));
    }catch{}
    try{
        openWindow(document.querySelector(`#${option}-dashboard`));
    }catch{}

    document.querySelector(`#${option}`).classList.add('active');
    currentWindow = option;

    
}

const closeWindow = (element) => {
    element.classList.add('hidden');
}

const openWindow = (element) => {
    element.classList.remove('hidden');
}

/*
    Globals
*/

let apikey = '';
let apiurl = '';
let account_data = [];
let report_data = [];

const initScript = (_apikey, _apiurl) => {
    apikey = _apikey;
    apiurl = _apiurl;
}

const loadScript = () => {

    loadAccounts();
    loadMechanics();
    loadNotifications();
    loadBilling();
    loadWallets();
    loadHistory();
    loadAllowAdmin();

}


/*
    Accounts Dashboard
*/

const loadAccounts = () => {
    callAccountsAPI();
    setInterval(() => callAccountsAPI(), 2000);

    callReportAPI();
    setInterval(() => callReportAPI(), 2000);

    setInterval(() => updateAccountsTable(), 500);
    setInterval(() => updateReportsTable(), 500);
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
            account_data = d.Accounts.filter(user => !user.accountStatus.IsDeleted);
        })
        .catch(e => account_data = []);
}

const callReportAPI = () => {
    if (currentWindow !== '' && currentWindow !== 'accounts')
        return;

    fetch(apiurl + "/api/Account/Report", {
        method: 'GET',
        headers: {
            'AYUS-API-KEY': apikey,
        }
    })
        .then(r => r.json())
        .then(d => {
            report_data = [];
            d.Data.forEach(o => {

                let complainer = account_data.filter(a => a.personalInformation.UUID === o.Complainer);
                complainer = `${complainer[0].personalInformation.Firstname} ${complainer[0].personalInformation.Lastname}`;
                let complainee = account_data.filter(a => a.personalInformation.UUID === o.Complainee);
                complainee = `${complainee[0].personalInformation.Firstname} ${complainee[0].personalInformation.Lastname}`;
                let reason = o.Reason;
                let status = o.Status;
                let ID = o.Id;

                report_data.push({
                    ID,
                    complainer,
                    complainee,
                    reason,
                    status
                })
            })
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

        row.addEventListener('click', (e) => {
            loadAccountModal(row.id);
        })

        const user = document.createElement('td');
        user.innerHTML = `${account.personalInformation.Firstname} ${account.personalInformation.Lastname}`;

        const role = document.createElement('td');
        role.innerHTML = `${account.accountStatus.Role}`;

        const rating = document.createElement('td');
        let stars = '';
        let rate = account.accountStatus.Rating;
        for (let i = 1; i <= 5; i++) {
            stars += (rate >= i ? `<i class="fa-solid fa-star">` : `<i class="fa-regular fa-star">`);
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

const updateReportsTable = () => {
    const reports_table = document.querySelector('#reports-data');
    reports_table.innerHTML = '';

    report_data.forEach(report => {
        const row = document.createElement('tr');
        row.id = report.ID;

        const id = document.createElement('td');
        id.innerHTML = report.ID;

        const complainer = document.createElement('td');
        complainer.innerHTML = report.complainer;

        const complainee = document.createElement('td');
        complainee.innerHTML = report.complainee;

        const reason = document.createElement('td');
        reason.innerHTML = report.reason;

        const status = document.createElement('td');
        status.innerHTML = report.status;

        row.appendChild(id);
        row.appendChild(complainer);
        row.appendChild(complainee);
        row.appendChild(reason);
        row.appendChild(status);

        reports_table.appendChild(row);
    })
}

let tempuserID;
const loadAccountModal = (userid) => {
    const modal = document.getElementById('user_detail_modal');

    // update the modal fields

    const fullname = document.getElementById('account-modal-fullname');
    const contact = document.getElementById('account-modal-contact');
    const address = document.getElementById('account-modal-address');
    const email = document.getElementById('account-modal-email');
    const license = document.getElementById('account-modal-license');
    const status = document.getElementById('account-modal-status');
    const role = document.getElementById('account-modal-role');
    const rating = document.getElementById('account-modal-rating');
    const image = document.getElementById('account-modal-photo');

    tempuserID = userid;

    const user_data = account_data.filter(a => a.personalInformation.UUID === userid)[0];

    fullname.innerHTML = `${user_data.personalInformation.Firstname} ${user_data.personalInformation.Lastname}`;
    contact.innerHTML = `${user_data.personalInformation.Contact}`;
    address.innerHTML = `${user_data.personalInformation.Address}`;
    email.innerHTML = `${user_data.credential.Email}`;
    license.innerHTML = `${user_data.personalInformation.LicenseNumber}`;
    status.innerHTML = user_data.accountStatus.IsLocked ? "RESTRICTED" : "OK";
    role.innerHTML = user_data.accountStatus.Role;

    if (user_data.accountStatus.IsLocked) {
        document.querySelector(`#restriction_button_modal`).innerHTML = `<i class="fa-solid fa-lock"></i> Unrestrict Account`;
    } else {
        document.querySelector(`#restriction_button_modal`).innerHTML = `<i class="fa-solid fa-lock"></i> Restrict Account`;
    }

    let stars = '';
    let rate = user_data.accountStatus.Rating;
    for (let i = 1; i <= 5; i++) {
        stars += (rate >= i ? `<i class="fa-solid fa-star">` : `<i class="fa-regular fa-star">`);
    }
    rating.innerHTML = stars;

    image.src = "https://placehold.co/128x128"

    const resourceUrl = `${apiurl}/api/Upload/files/${user_data.personalInformation.UUID}/PROFILE`;
    fetch(resourceUrl)
        .then(r => {
                image.src = resourceUrl;
                image.style.width = '128px';
                image.style.height = '128px';
            }
        )
        .catch(e => {
            image.src = "https://placehold.co/128x128"
        })

    openWindow(modal);
}




