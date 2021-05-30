const domain = 'meet.medyco.fr';
const options = {
    roomName: 'MedycoTest',
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

document.getElementById("meet").style.height = (screen.height - 300) + 'px';

api.on('readyToClose', () => {
    // redirection
});