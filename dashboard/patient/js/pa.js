function modal() {
    $('#fenetre_message').modal('show');
}

function modal_Close() {
    $('#fenetre_message').modal('hide');
}

function checkToken() {
    if (sessionStorage.getItem("token") != null) {
        $.ajax({
            url: 'http://localhost:3000/api/auth/token/' + sessionStorage.getItem("token"),
            type: 'GET',
            dataType: 'html',
            success: function (data, statut) {
                const obj = JSON.parse(data);
                if (obj.token == true) {
                    if (sessionStorage.getItem("type") == 0) {
                        loadData();
                    } else {
                        window.location.href = '../dashboard/praticien/profil.html';
                    }
                } else {
                    window.location.href = '../../auth/auth.html';
                }
            },
            error: function (result, statut, erreur) {
                sendError("Une erreur s'est produite, veuillez réessayer");
                $("#li-submit").prop("disabled", false);
            }
        });
    } else {
        window.location.href = '../../auth/auth.html';
    }
}

function loadData() {
    $('#dash-content').show();
    $('#load').hide();
}

function updateUserInfo() {
    if ($("#update-user-info").text().indexOf("Modifier") != -1) {
        $("#user-email").prop("disabled", false);
        $("#user-email").css("border", "1px solid");
        $("#user-address").prop("disabled", false);
        $("#user-address").css("border", "1px solid");
        $("#user-city").prop("disabled", false);
        $("#user-city").css("border", "1px solid");
        $("#update-user-info").text("Valider")
    } else {
        $("#user-email").prop("disabled", true);
        $("#user-email").css("border", "none");
        $("#user-address").prop("disabled", true);
        $("#user-address").css("border", "none");
        $("#user-city").prop("disabled", true);
        $("#user-city").css("border", "none");
        $("#update-user-info").text("Modifier")
    }
}

function logout() {
    $.ajax({
        url: 'http://localhost:3000/api/auth/logout/' + sessionStorage.getItem('token'),
        type: 'DELETE',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);
            if (result.logout == true) {
                window.location.href = '../../index.html';
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}