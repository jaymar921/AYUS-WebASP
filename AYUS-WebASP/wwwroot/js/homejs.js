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



