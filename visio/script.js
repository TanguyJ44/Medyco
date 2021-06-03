const urlParams = new URLSearchParams(window.location.search);
const domain = 'meet.medyco.fr';
const options = {
    roomName: urlParams.get('tag'),
    parentNode: document.querySelector('#meet'),
    configOverwrite: {
        prejoinPageEnabled: false
    },
    interfaceConfigOverwrite: {
        HIDE_DEEP_LINKING_LOGO: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat', 'settings']
    },
    userInfo: {
        displayName: 'Invité'
    }
};
const api = new JitsiMeetExternalAPI(domain, options);

function onLoad() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('tag') != null) {
        document.getElementById("meet").style.height = (screen.height - 300) + 'px';
    } else {
        document.location.href = "../index.html";
    }
}

api.on('readyToClose', () => {
    document.location.href = "../auth/auth.html";
});

if (sessionStorage.getItem('token') != null) {
    getDisplayName();
}

function getDisplayName() {
    if (sessionStorage.getItem('type') != null) {
        $.ajax({
            url: 'http://localhost:3000/api/rdv/display/' + sessionStorage.getItem('token') + '/name/' + sessionStorage.getItem('type'),
            type: 'GET',
            dataType: 'html',
            success: function (data, statut) {
                const obj = JSON.parse(data);
                if (sessionStorage.getItem('type') == 0) {
                    api.executeCommand('displayName', obj[0].firstname.toUpperCase() + ' ' + obj[0].lastname.toUpperCase());
                } else {
                    api.executeCommand('displayName', 'Dr. ' + obj[0].name.toUpperCase());
                }
            },
            error: function (result, statut, erreur) {
                console.log(erreur);
            }
        });
    }
}