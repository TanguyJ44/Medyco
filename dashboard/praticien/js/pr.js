var refDate = null;

function modal() {
    $('#valid-med').modal('show');
}

function modal_Close() {
    $('#valid-med').modal('hide');
}

function execAppli() {
    window.location.href = "mailto:" + paSelectEmail + "?body=Voici votre facture et vos ordonnances en pièce jointes ! passé une agréable journée";
}

function checkToken(page) {
    if (sessionStorage.getItem("token") != null) {
        $.ajax({
            url: 'http://localhost:3000/api/auth/token/' + sessionStorage.getItem("token"),
            type: 'GET',
            dataType: 'html',
            success: function (data, statut) {
                const obj = JSON.parse(data);
                if (obj.token == true) {
                    if (sessionStorage.getItem("type") == 1) {
                        loadData(page);
                    } else {
                        window.location.href = '../patient/profil.html';
                    }
                } else {
                    window.location.href = '../../auth/auth.html';
                }
            },
            error: function (result, statut, erreur) {
                console.log(erreur);
            }
        });
    } else {
        window.location.href = '../../auth/auth.html';
    }
}

function loadData(page) {
    switch (page) {
        case 1: // profil
            break;
        case 2: // agenda
            refDate = new Date();
            displayDate();
            break;
        case 3: // patients
            getPaList();
            break;
        case 4: // msg
            getUserMsg();
            break;
        case 5: // accounting
            getUserTodayRdv();
            break;
        default:
            break;
    }

    $('#dash-content').show();
    $('#load').hide();
}

function updateUserInfo() {
    if ($('#update-userinfo').text().indexOf("Modifier") != -1) {
        $('#user-spe, .contact-users').css({ "border": "solid", "border-width": "1px" });
        $('#user-spe, .contact-users').prop('disabled', false);
        $('#update-userinfo').text("Sauvegarder");
    } else {
        $('#user-spe, .contact-users').css({ "border": "none" });
        $('#user-spe, .contact-users').prop('disabled', true);
        $('#update-userinfo').text("Modifier");
    }
}

function saveWorkDay() {
    $('#save-alert').show();
}

function changeDate(type) {
    const ref = new Date();
    if (type == 0) {
        if (!(refDate.getDate() == ref.getDate() && refDate.getMonth() == ref.getMonth())) {
            refDate.setDate(refDate.getDate() - 6);
        } else {
            return;
        }
    } else {
        refDate.setDate(refDate.getDate() + 6);
    }
    displayDate();
}

function displayDate() {
    let nextDay = new Date(refDate);

    slotsDate = [];

    $('#rdv-day1').text(getDayName(refDate.getDay()));
    $('#rdv-date-day1').text(refDate.getDate() + " " + getMonthName(refDate.getMonth()));

    nextDay.setDate(refDate.getDate() + 1);
    $('#rdv-day2').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day2').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day3').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day3').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day4').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day4').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day5').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day5').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day6').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day6').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
}

var listPa = null;
function getPaList() {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/pa-list',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).paList != false) {
                $("#insert-patient").empty();
                listPa = JSON.parse(data);
                $.each(JSON.parse(data), function (i, obj) {
                    $("#insert-patient").append("<p class='patient-name' onclick='getPaInfo(" + obj.id + ")')><i class='bi bi-person-lines-fill'></i> " + obj.firstname.charAt(0).toUpperCase() + obj.firstname.substring(1) + " " + obj.lastname.toUpperCase() + "</p>");
                });
                $("#search-patient").prop("disabled", false);
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

$("#search-patient").on('input', function (event) {
    let paNotFound = false;

    $("#insert-patient").empty();
    if ($(this).val().length > 0) {
        $.each(listPa, function (i, obj) {
            if (obj.firstname.indexOf($("#search-patient").val()) != -1 || obj.lastname.indexOf($("#search-patient").val()) != -1) {
                $("#insert-patient").append("<p class='patient-name' onclick='getPaInfo(" + obj.id + ")')><i class='bi bi-person-lines-fill'></i> " + obj.firstname.charAt(0).toUpperCase() + obj.firstname.substring(1) + " " + obj.lastname.toUpperCase() + "</p>");
                paNotFound = true;
            }
        });
        if (paNotFound == false) {
            $("#insert-patient").append("<p class='text-center'>Aucun patient trouvé</p>");
        }
    } else {
        $.each(listPa, function (i, obj) {
            $("#insert-patient").append("<p class='patient-name' onclick='getPaInfo(" + obj.id + ")')><i class='bi bi-person-lines-fill'></i> " + obj.firstname.charAt(0).toUpperCase() + obj.firstname.substring(1) + " " + obj.lastname.toUpperCase() + "</p>");
        });
    }
});

var paSelectEmail = null;
function getPaInfo(id) {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/pa-info/' + id,
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).paInfo != false) {
                const result = JSON.parse(data);
                const gender = result[0].gender == 0 ? "Homme" : "Femme";

                if (result[0].gender == 0) {
                    $("#pa-info-img").attr('src', '../assets/man.png');
                } else {
                    $("#pa-info-img").attr('src', '../assets/woman.png');
                }

                $("#pa-info-name").text(result[0].firstname.charAt(0).toUpperCase() + result[0].firstname.substring(1) + " " + result[0].lastname.toUpperCase());
                $("#pa-info-birth").text(formatDate(result[0].birthDate));
                $("#pa-info-gender").text(gender);
                $("#pa-info-email").text(result[0].email);

                paSelectEmail = result[0].email;

                getPaRdv(id);
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getPaRdv(id) {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/pa-rdv/' + id,
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).paRdv != false) {
                $("#old-consult-insert").empty();
                $.each(JSON.parse(data), function (i, obj) {
                    let rdvType = obj.type == 0 ? "consultation au cabinet" : "consultation en visioconférence";
                    $("#old-consult-insert").append("<p class='consult-view'><i class='bi bi-file-earmark-person'></i>" + formatDate(obj.date) + " à " + obj.time.substring(0, 5).replace(":", "h") + " - " + rdvType + "</p>");
                });
                $("#no-patient").empty();
                $("#view-patient-details").removeAttr('hidden');
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function modalMsg(id) {
    $.each(rdvMsg, function (i, obj) {
        if (obj.id == id) {
            $('#msg-name').text(obj.name);
            $('#msg-date').text(obj.date);
            $('#msg-time').text(obj.time);
            $('#remove-msg').prop("onclick", null).off("click");
            $('#remove-msg').on("click", function () { removeMsg(obj.id); });
        }
    });
    $('#msg-gui').modal('show');
}

function modalCloseMsg() {
    $('#msg-gui').modal('hide');
}

var rdvMsg = null;
function getUserMsg() {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/msg',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).msg != false) {
                $("#insert-msg").empty();
                rdvMsg = JSON.parse(data);
                $.each(JSON.parse(data), function (i, obj) {
                    $("#insert-msg").append("<div class='messages-card' data-toggle='modal' data-target='#msg-gui'><i class='bi bi-chat-square-quote'></i><div class='row' onclick='modalMsg(" + obj.id + ")'><label class='form-check-label'>Votre rendez-vous avec " + obj.name + " à été annulé ! <span style='float:right;margin-right:40px;font-style:italic;color:gray;'>Cliquer sur ce message pour l'ouvrir</span></label></div></div>");
                });
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function removeMsg(id) {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/remove/msg/' + id,
        type: 'DELETE',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).removeMsg != false) {
                modalCloseMsg();
                document.location.reload();
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getUserTodayRdv() {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/today-rdv',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).todayRdv != false) {
                $("#insert-today-consult").empty();
                $.each(JSON.parse(data), function (i, obj) {
                    let msgDate = new Date(obj.date);
                    $("#insert-today-consult").append("<p class='histo-patient'>" + ('00' + msgDate.getDate()).slice(-2) + "/" + ('00' + (msgDate.getMonth() + 1)).slice(-2) + "/" + msgDate.getFullYear() + " " + obj.time.substring(0, 5).replace(":", "h") + " - " + obj.firstname.charAt(0).toUpperCase() + obj.firstname.substring(1) + " " + obj.lastname.toUpperCase() + "</p>");
                });
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function sendConsult() {
    $('#consult-gui').modal({ backdrop: "static", keyboard: false });
    $('#consult-gui').modal('show');

    setTimeout(function () {
        $('#consult-gui').modal('hide');
    }, 5000);
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

function formatDate(reqDate) {
    const date = new Date(reqDate);
    let df1 = date.getDate();
    let df2 = date.getMonth();

    if (df1 < 10) {
        df1 = "0" + df1;
    }

    df2 += 1;
    if (df2 < 10) {
        df2 = "0" + df2;
    }

    return df1 + "/" + df2 + "/" + date.getFullYear();
}

function getDayName(day) {
    switch (day) {
        case 0:
            return "Dimanche";
        case 1:
            return "Lundi";
        case 2:
            return "Mardi";
        case 3:
            return "Mercredi";
        case 4:
            return "Jeudi";
        case 5:
            return "Vendredi";
        case 6:
            return "Samedi";
        default:
            return "Error";
    }
}

function getMonthName(month) {
    switch (month) {
        case 0:
            return "Janvier";
        case 1:
            return "Février";
        case 2:
            return "Mars";
        case 3:
            return "Avril";
        case 4:
            return "Mai";
        case 5:
            return "Juin";
        case 6:
            return "Juillet";
        case 7:
            return "Août";
        case 8:
            return "Septembre";
        case 9:
            return "Octobre";
        case 10:
            return "Novembre";
        case 11:
            return "Décembre";
        default:
            return "Error";
    }
}