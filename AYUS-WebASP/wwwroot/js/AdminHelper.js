const openEmailModal = (emailElementID, recepient, subject) => {

    const emailModalElement = document.querySelector('#user_email_modal');

    openWindow(emailModalElement);

    const recipientEmail = document.querySelector('#email-modal-recipient');
    recipientEmail.value = document.querySelector(`#${emailElementID}`).innerHTML;

    document.querySelector('#email-modal-subject').value = subject;
    document.querySelector('#email-modal-body').value = `Dear ${document.querySelector(`#${recepient}`).innerHTML},\n\n{ EMAIL BODY }\n\nBest Regards,\nAYUS ADMIN`;

}

const SendEmailAPI = () => {
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
            }
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

    console.log(OptionData)
    if (Option === 'restrictAccount') {
        fetch(apiurl + "/api/Account/AccountStatus", {
            method: 'PUT',
            headers: {
                'AYUS-API-KEY': apikey,
                'Content-Type':'application/json'
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
    }

    closeConfirmModal(element);
}