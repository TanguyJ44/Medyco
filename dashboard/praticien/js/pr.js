var refDate = null;
var slotsDate = [];
var newWorkTime = true;

function modal() {
    $('#valid-med').modal('show');
}

function modal_Close() {
    $('#valid-med').modal('hide');
}

function modalCloseRdv() {
    $('#info-rdv').modal('hide');
}

function execAppli() {
    window.location.href = "mailto:" + paSelectEmail + "?body=Voici votre facture et vos ordonnances en pièce jointes ! Passez une agréable journée";
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
            getUserInfo();
            getWorkTime();
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
        $('#user-spe, #user-visio, .contact-users').prop('disabled', false);
        $('#update-userinfo').text("Sauvegarder");
    } else {
        $('#user-spe, .contact-users').css({ "border": "none" });
        $('#user-spe, #user-visio, .contact-users').prop('disabled', true);
        $('#update-userinfo').text("Modifier");
        changeUserInfo();
    }
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
    saveAllCurrentDate(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());

    nextDay.setDate(refDate.getDate() + 1);
    $('#rdv-day2').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day2').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
    saveAllCurrentDate(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day3').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day3').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
    saveAllCurrentDate(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day4').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day4').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
    saveAllCurrentDate(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day5').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day5').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
    saveAllCurrentDate(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());

    nextDay.setDate(nextDay.getDate() + 1);
    $('#rdv-day6').text(getDayName(nextDay.getDay()));
    $('#rdv-date-day6').text(nextDay.getDate() + " " + getMonthName(nextDay.getMonth()));
    saveAllCurrentDate(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());

    getDateRdvSlot(0);
}

function getUserInfo() {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/info',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).userInfo != false) {
                const result = JSON.parse(data);

                if (result[0].gender == 0) {
                    $("#user-img").attr('src', '../assets/man-doctor.png');
                    $('#user-gender').text("Homme");
                } else {
                    $("#user-img").attr('src', '../assets/woman-doctor.png');
                    $('#user-gender').text("Femme");
                }
                $('#user-name').text("Dr. " + result[0].name);
                $('#user-rpps').text("RPPS " + result[0].RPPS);
                $('#user-spe').val(result[0].specialties);
                $('#user-email').val(result[0].email);
                if (result[0].visio == 0) {
                    $('#user-visio').prop("checked", false);
                } else {
                    $('#user-visio').prop("checked", true);
                }
                $('#user-address').val(result[0].address);
                $('#user-zipcode').val(result[0].zipcode);
                $('#user-city').val(result[0].city);
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function changeUserInfo() {
    if ($("#user-spe").val().length > 1 && $("#user-email").val().length > 1 && $("#user-address").val().length > 1 && $("#user-zipcode").val().length == 5 && $("#user-city").val().length > 1) {
        if ($("#user-email").val().match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
            $("#update-userinfo").prop("disabled", true);
            let visioValue = null;
            if ($("#user-visio").prop('checked') == true) {
                visioValue = 1;
            } else {
                visioValue = 0;
            }
            $.ajax({
                url: 'http://localhost:3000/api/pr/update/info',
                data: {
                    token: sessionStorage.getItem('token'),
                    spe: $("#user-spe").val(),
                    email: $("#user-email").val(),
                    address: $("#user-address").val(),
                    zipcode: $("#user-zipcode").val(),
                    city: $("#user-city").val(),
                    visio: visioValue
                },
                type: 'PUT',
                dataType: 'html',
                success: function (data, statut) {
                    if (JSON.parse(data).updateInfo == true) {
                        $("#update-userinfo").prop("disabled", false);
                        getUserInfo();
                    } else {
                        document.location.reload();
                    }
                },
                error: function (result, statut, erreur) {
                    console.log("Error !");
                }
            });
        } else {
            document.location.reload();
        }
    } else {
        document.location.reload();
    }
}

function getWorkTime() {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/work-time',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).workTime != false) {
                const result = JSON.parse(data);

                $('#mondayAM').val(result[0].mondayAM);
                $('#mondayPM').val(result[0].mondayPM);
                $('#tuesdayAM').val(result[0].tuesdayAM);
                $('#tuesdayPM').val(result[0].tuesdayPM);
                $('#wednesdayAM').val(result[0].wednesdayAM);
                $('#wednesdayPM').val(result[0].wednesdayPM);
                $('#thursdayAM').val(result[0].thursdayAM);
                $('#thursdayPM').val(result[0].thursdayPM);
                $('#fridayAM').val(result[0].fridayAM);
                $('#fridayPM').val(result[0].fridayPM);
                $('#saturdayAM').val(result[0].saturdayAM);
                $('#saturdayPM').val(result[0].saturdayPM);
                $('#sundayAM').val(result[0].sundayAM);
                $('#sundayPM').val(result[0].sundayPM);
                $('#work-time').val(result[0].meetingTime.substring(3, 5));

                newWorkTime = false;
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function updateWorkTime() {
    if ($("#work-time").val().length > 0 && $("#work-time").val() > 4 && $("#work-time").val() < 60) {
        $("#save-btn-wt").prop("disabled", true);
        $.ajax({
            url: 'http://localhost:3000/api/pr/update/work-time',
            data: {
                token: sessionStorage.getItem('token'),
                newData: newWorkTime,
                mondayAM: $('#mondayAM').val(),
                mondayPM: $('#mondayPM').val(),
                tuesdayAM: $('#tuesdayAM').val(),
                tuesdayPM: $('#tuesdayPM').val(),
                wednesdayAM: $('#wednesdayAM').val(),
                wednesdayPM: $('#wednesdayPM').val(),
                thursdayAM: $('#thursdayAM').val(),
                thursdayPM: $('#thursdayPM').val(),
                fridayAM: $('#fridayAM').val(),
                fridayPM: $('#fridayPM').val(),
                saturdayAM: $('#saturdayAM').val(),
                saturdayPM: $('#saturdayPM').val(),
                sundayAM: $('#sundayAM').val(),
                sundayPM: $('#sundayPM').val(),
                workTime: $('#work-time').val()
            },
            type: 'PUT',
            dataType: 'html',
            success: function (data, statut) {
                if (JSON.parse(data).updateWorkTime == true) {
                    $("#save-btn-wt").prop("disabled", false);
                    $('#save-alert').show();
                    getWorkTime();
                } else {
                    document.location.reload();
                }
            },
            error: function (result, statut, erreur) {
                console.log("Error !");
            }
        });
    } else {
        document.location.reload();
    }
}

function getDateRdvSlot(index) {
    $("#rdv-load").show();
    $("#rdv-slots").hide();
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/rdv-slot/' + slotsDate[index],
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            $("#rdv-col-" + (index + 1)).empty();
            if (JSON.parse(data).rdvSlot != false) {
                $.each(JSON.parse(data), function (i, obj) {
                    let rdvType = obj.type == 0 ? "bi-people" : "bi-camera-video";
                    $("#rdv-col-" + (index + 1)).append("<button type='button' class='btn btn-primary' data-id='rdv-btn' onclick='getRdvInfo(" + obj.id + ")'>" + obj.time.substring(0, 5).replace(":", "h") + " <br> <i class='bi " + rdvType + "'></i></button>");
                });
            }
            if (index < 5) {
                getDateRdvSlot(index + 1)
            } else {
                $("#rdv-load").hide();
                $("#rdv-slots").show();
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getRdvInfo(id) {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/rdv-info/' + id,
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).rdvInfo != false) {
                const result = JSON.parse(data);

                $('#rdvinfo-date').text(formatDate(result[0].date));
                $('#rdvinfo-time').text(result[0].time.substring(0, 5).replace(":", "h"));
                $('#rdvinfo-name').text(result[0].firstname.charAt(0).toUpperCase() + result[0].firstname.substring(1) + " " + result[0].lastname.toUpperCase());
                if (result[0].type == 0) {
                    $('#rdvinfo-type').text("Consultation au cabinet");
                } else {
                    $('#rdvinfo-type').text("Consultation en visioconférence");
                }
                if (result[0].consulted == 0) {
                    $('#rdvinfo-consulted').text("Ce patient consulte chez vous pour la première fois");
                } else {
                    $('#rdvinfo-consulted').text("Ce patient a déjà consulté chez vous");
                }
                $('#rdvinfo-reason').text(result[0].reason);
                if (result[0].patientId.length < 40) {
                    $('#rdvinfo-children').text("Ce rendez-vous concerne l'enfant du patient : " + result[0].patientId.toUpperCase());
                } else {
                    $('#rdvinfo-children').text("");
                }
                $('#error-visio').hide();
                if (result[0].type == 1) {
                    $('#btn-visio').show();
                    $('#btn-visio').on("click", function () { joinVisio(result[0].room, result[0].date, result[0].time); });
                } else {
                    $('#btn-visio').hide();
                }

                $('#remove-rdv').on("click", function () { removeRdv(id); });
                $('#info-rdv').modal('show');
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function joinVisio(id, date, time) {
    const todayDate = new Date();
    const startDate = new Date(date);
    startDate.setHours(time.substring(0, 2));
    startDate.setMinutes(time.substring(3, 5));
    let scheduleTime = (startDate.getTime() - todayDate.getTime()) / 1000;

    if (scheduleTime < 601) {
        document.location.href = "../../visio/room.html?tag=" + id;
    } else {
        $('#error-visio').show();
    }
}

function removeRdv(id) {
    $.ajax({
        url: 'http://localhost:3000/api/pr/' + sessionStorage.getItem('token') + '/remove/rdv/' + id,
        type: 'DELETE',
        dataType: 'html',
        success: function (data, statut) {
            if (JSON.parse(data).removeRdv != false) {
                $('#info-rdv').modal('hide');
                document.location.reload();
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
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

function saveAllCurrentDate(year, month, date) {
    let formatMonth = null;
    let formatDate = null;

    formatMonth = month + 1;

    if (formatMonth < 10) {
        formatMonth = "0" + formatMonth;
    }

    if (date < 10) {
        formatDate = "0" + date;
    } else {
        formatDate = date;
    }

    slotsDate.push(year + "-" + formatMonth + "-" + formatDate);
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