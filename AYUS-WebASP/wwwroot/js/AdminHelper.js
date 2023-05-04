const openEmailModal = (emailElementID, recepient, subject) => {

    const emailModalElement = document.querySelector('#user_email_modal');

    openWindow(emailModalElement);

    const recipientEmail = document.querySelector('#email-modal-recipient');
    recipientEmail.value = document.querySelector(`#${emailElementID}`).innerHTML;

    document.querySelector('#email-modal-subject').value = subject;
    document.querySelector('#email-modal-body').value = `Dear ${document.querySelector(`#${recepient}`).innerHTML},\n\n{ EMAIL BODY }\n\nBest Regards,\nAYUS ADMIN`;

}

const SendEmailAPI = () => {
    document.querySelector('#sendMail-btn').disabled = true;
    fetch("/SendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "Email": document.querySelector('#email-modal-recipient').value,
            "Body": document.querySelector('#email-modal-body').value,
            "Subject": document.querySelector('#email-modal-subject').value
        })
    }).then(r => r.json())
        .then(d => {
            if (d.Status === 200) {
                closeWindow(document.getElementById('user_email_modal'));
                document.querySelector('#sendMail-btn').disabled = false;
            }
        })
        .catch(e => {
            document.querySelector('#sendMail-btn').disabled = false;
        })
}

let OptionData = '';
let Option = '';

const ristrictAccount = (emailElementID, option) => {

    const ristrictAccountModalElement = document.querySelector('#user_confirm_modal');

    openWindow(ristrictAccountModalElement);

    const email = document.getElementById(emailElementID).innerHTML;

    const user_Data = account_data.filter(a => a.credential.Email === email)[0];

    Option = option;
    OptionData = user_Data;

    if (option === 'deleteAccount') {
        document.getElementById('user-confirm-message').innerHTML = `Would you like to delete '${user_Data.personalInformation.Lastname}' data?`
    } else if (option === 'restrictAccount') {
        document.getElementById('user-confirm-message').innerHTML = `Would you like to restrict user '${user_Data.personalInformation.Lastname}'?`
    }
}

const closeConfirmModal = (element) => {
    closeWindow(element);

    OptionData = '';
    Option = '';
}

const applyConfirmModal = (element) => {

    if (Option === 'restrictAccount') {
        fetch(apiurl + "/api/Account/AccountStatus", {
            method: 'PUT',
            headers: {
                'AYUS-API-KEY': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "UUID": OptionData.personalInformation.UUID,
                "isDeleted": OptionData.accountStatus.IsDeleted,
                "isLocked": !OptionData.accountStatus.IsLocked,
                "isOnline": OptionData.accountStatus.IsOnline
            })
        }).then(r => r.json())
            .then(d => console.log(d))
    } else if (Option === 'deleteAccount') {
        fetch(apiurl + "/api/Account/AccountStatus", {
            method: 'PUT',
            headers: {
                'AYUS-API-KEY': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "UUID": OptionData.personalInformation.UUID,
                "isDeleted": !OptionData.accountStatus.IsDeleted,
                "isLocked": OptionData.accountStatus.IsLocked,
                "isOnline": OptionData.accountStatus.IsOnline
            })
        }).then(r => r.json())
            .then(d => console.log(d))
    } else if (Option === 'changeAdminData') {
        fetch('/admin/AllowAdmins?allowAdmin=' + document.querySelector('#allow-admin-reg').checked, {method: 'PUT'})
            .then(r => r.json())
            .then(d => {
                document.querySelector('#allow-admin-reg').checked = d.AllowAdmin;
                console.log(d)
            });
    }

    closeConfirmModal(element);
}


const viewLicense = (fullnameID, licenseID) => {
    document.getElementById('license-owner').innerHTML = document.getElementById(fullnameID).innerHTML;
    document.getElementById('license-number').innerHTML = document.getElementById(licenseID).innerHTML;

    const image = document.getElementById('license-photo');
    

    fetch(apiurl + `/api/Upload/files/${tempuserID}/LICENSE`)
        .then(d => {
            image.src = apiurl + `/api/Upload/files/${tempuserID}/LICENSE`;
            image.style.width = '350';
            image.style.height = '258';
            image.width = '350';
            image.height = '258';
        })
        .catch(e => {
            image.src = "https://placehold.co/350x228";
            console.log("error")
        })

    openWindow(document.getElementById('license_modal'))
}


const loadAllowAdmin = () => {
    fetch('/admin/AllowAdmins')
        .then(r => r.json())
        .then(d => {
            document.querySelector('#allow-admin-reg').checked = d.AllowAdmin;
        });

    loadServicePrice();
}

const changeAllowAdmin = () => {
    const changeAdminSetting = document.querySelector('#user_confirm_modal');

    openWindow(changeAdminSetting);

    Option = 'changeAdminData';
    OptionData = 'allow-admin-reg';

    document.getElementById('user-confirm-message').innerHTML = `Are you sure you want to change the admin setting?`
}

const updateServicePrice = () => {
    const servicePrice = document.querySelector('#billing-price').value;

    if (servicePrice < 25) {
        alert("Minimum service price should be P25");
        return;
    }

    fetch(apiurl + `/api/System/ServicePrice?price=${servicePrice}`, {
        method: 'PUT',
        headers: {
            'AYUS-API-KEY': apikey,
        }
    }).then(r => r.json())
        .then(d => {
            if (d.Status === 201)
                alert('Service Price was updated to '+d.ServicePrice);
            else
                alert('Failed to update price');
        }).catch(e => alert('Failed to update price'));
}

const loadServicePrice = () => {
    fetch(apiurl + `/api/System/ServicePrice`, {
        method: 'GET',
        headers: {
            'AYUS-API-KEY': apikey,
        }
    }).then(r => r.json())
        .then(d => document.querySelector('#billing-price').value = d.ServicePrice);
}