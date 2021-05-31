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
        displayName: 'John Doe'
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