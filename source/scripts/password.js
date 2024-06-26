async function init() {
    // check for password
    const button = document.querySelector('button');
    const password = document.getElementById('password');
    const createPassword = document.getElementById('createPassword');
    const alert = document.getElementById('invalidPassword');
    const rememberCheckbox = document.getElementById('rememberMe');
    // get password from json file
    const jsonPasswordFile = await window.api.readPassword('');
    const jsonPassword = JSON.parse(jsonPasswordFile);

    if (jsonPasswordFile !== '{}') {
        createPassword.textContent = '';
    } else {
        createPassword.textContent = 'Create Password';
    }

    if (jsonPassword.rememberMe === true) {
        window.api.loadHtmlFile('calendar.html');
    }

    // check if password matches
    const handleLogin = async () => {
        const newPass = await window.api.decryptData(jsonPassword.password);
        if (password.value === newPass) {
            const rememberMe = rememberCheckbox.checked;
            jsonPassword.rememberMe = rememberMe; // Update the JSON object
            window.api.loadHtmlFile('calendar.html');

            // Save the updated JSON object back to the file
            await window.api.writePassword(JSON.stringify(jsonPassword));
        } else {
            alert.style.color = 'red';
        }
    };

    button.addEventListener('click', handleLogin);

    password.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });

    const modal = document.getElementById('myModal');
    const img = document.getElementById('triggerPopup');
    const span = document.getElementsByClassName('close')[0];
    const container = document.querySelector('.container');
    // when ? button is clicked, dont display the password page underneath
    img.onclick = () => {
        modal.style.display = 'block';
        container.style.display = 'none';
    };

    span.onclick = () => {
        modal.style.display = 'none';
        container.style.display = 'flex';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            container.style.display = 'flex';
        }
    };
}

window.addEventListener('DOMContentLoaded', init);
