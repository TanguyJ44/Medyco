var refDate = null;
var slotsDate = [];
var selectedId = null;
var selectedDate = null;
var selectedTime = null;
var regularRdv = null;

function initDate() {
    refDate = new Date();
    displayDate();
    getPrInfo();
    getPaChildrenInfo();
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

    const urlParams = new URLSearchParams(window.location.search);

    getSlotsDate(0, urlParams.get('id'));
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

$("#regular-yes").on("click", function () {
    $("#regular-yes").removeClass("btn-outline-secondary");
    $("#regular-yes").addClass("btn-primary");
    $("#regular-no").removeClass("btn-primary");
    $("#regular-no").addClass("btn-outline-secondary");

    regularRdv = 1;
});

$("#regular-no").on("click", function () {
    $("#regular-no").removeClass("btn-outline-secondary");
    $("#regular-no").addClass("btn-primary");
    $("#regular-yes").removeClass("btn-primary");
    $("#regular-yes").addClass("btn-outline-secondary");

    regularRdv = 0;
});

$(document).on('click', "button[data-id='rdv-btn']", function (event) {
    if (selectedId != null) {
        $("#" + selectedId).css("background-color", "#3498db");
    }

    selectedId = event.target.id;

    let colSelected = event.target.id.substring(0, 1);
    selectedDate = slotsDate[colSelected];

    selectedTime = $('#' + event.target.id).text().replace("h", ":") + ":00";

    $("#" + selectedId).css("background-color", "orange");
});

$("#close-modal").on("click", function () {
    $('#myModal').modal('hide');
});

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
                        $('#about').show();
                        $('#load').hide();
                        initDate();
                    } else {
                        window.location.href = '../dashboard/praticien/profil.html';
                    }
                } else {
                    window.location.href = 'auth/auth.html';
                }
            },
            error: function (result, statut, erreur) {
                sendError("Une erreur s'est produite, veuillez réessayer");
                $("#li-submit").prop("disabled", false);
            }
        });
    } else {
        window.location.href = 'auth/auth.html';
    }
}

function getPrInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    $.ajax({
        url: 'http://localhost:3000/api/rdv/pr/' + urlParams.get('id') + '/info',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);
            $("#pr-info-name").text(result[0].name);
            $("#pr-info-spe").text(result[0].specialties);
            $("#pr-info-addr").text(result[0].address);
            $("#pr-info-city").text(result[0].zipcode + ' ' + result[0].city);
            if (result[0].visio == 0) {
                $("#rdv-type-visio").attr("disabled", true);
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getPaChildrenInfo() {
    $.ajax({
        url: 'http://localhost:3000/api/rdv/pa/' + sessionStorage.getItem('token') + '/name',
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);

            if (result.paName != false) {
                for (let i = 0; i < result.length; i++) {
                    if (i == 0) {
                        $("#pa-children").append("<option value='owner' selected>" + result[i] + "</option>");
                    } else {
                        $("#pa-children").append("<option value='" + result[i] + "'>" + result[i] + "</option>");
                    }
                }
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function getSlotsDate(index, id) {
    $("#prev-btn").attr('onclick', '');
    $("#next-btn").attr('onclick', '');
    $("#rdv-slots").hide();
    $("#rdv-load").show();
    $.ajax({
        url: 'http://localhost:3000/api/rdv/pr/' + id + '/slots/' + slotsDate[index],
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);

            let col = index + 1;
            $("#rdv-col-" + col).empty();

            if (!(result.rdvSlots == false || result.length < 2)) {
                for (let i = 0; i < result.length; i++) {
                    let generateId = index + "-" + result[i];
                    $("#rdv-col-" + col).append('<button type="button" class="btn btn-primary" data-id="rdv-btn" id="' + generateId + '" onclick="selectRdvSlot(' + index + ', \'' + result[i] + '\')">' + formatTimeSlot(result[i]) + '</button>');
                    if (selectedId != null && generateId == selectedId && slotsDate[index] == selectedDate) {
                        $("#" + selectedId).css("background-color", "orange");
                    }
                }
            }

            if (index < 5) {
                getSlotsDate(index + 1, id)
            } else {
                $("#prev-btn").attr('onclick', 'changeDate(0)');
                $("#next-btn").attr('onclick', 'changeDate(1)');
                $("#rdv-slots").show();
                $("#rdv-load").hide();
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function formatTimeSlot(time) {
    let left = time.substring(0, time.indexOf("h"));
    let right = time.substring(time.indexOf("h") + 1, time.length);

    if (left.length == 1) {
        left = "0" + left;
    }
    if (right.length == 1) {
        right = "0" + right;
    }

    return left + "h" + right;
}

function selectRdvSlot(index, time) {
    let date = new Date(slotsDate[index]);

    $('#slot-reserved').text("Créneau sélectionné: " + dateFormat(date.getDate()) + "/" + dateFormat(date.getMonth() + 1) + "/" + date.getFullYear() + " à " + formatTimeSlot(time));
}

function dateFormat(str) {
    if (String(str).length == 1) {
        return "0" + str;
    } else {
        return str;
    }
}

function checkSlotDispo() {
    const urlParams = new URLSearchParams(window.location.search);

    $.ajax({
        url: 'http://localhost:3000/api/rdv/pr/' + urlParams.get('id') + '/slots/' + selectedDate,
        type: 'GET',
        dataType: 'html',
        success: function (data, statut) {
            const result = JSON.parse(data);

            if (result.indexOf(selectedId.substring(2)) != -1) {
                createNewRdv(urlParams.get('id'));
            } else {
                displayMessage(0);
            }
        },
        error: function (result, statut, erreur) {
            console.log("Error !");
        }
    });
}

function createNewRdv(id) {
    let rdvType = null;

    $('#rdv-create').prop("disabled", true);

    if ($('#rdv-type-visio').is(":checked") == false) {
        rdvType = 0;
    } else {
        rdvType = 1;
    }

    if (selectedTime != null && selectedDate != null && rdvType != null) {
        $.ajax({
            url: 'http://localhost:3000/api/rdv/new',
            type: 'POST',
            data: {
                token: sessionStorage.getItem('token'),
                speId: id,
                type: rdvType,
                consulted: regularRdv,
                reason: $('#rdv-reason').val(),
                date: selectedDate,
                time: selectedTime,
                patientId: $('#pa-children').val(),
                prName: $('#pr-info-name').text()
            },
            dataType: 'html',
            success: function (data, statut) {
                const result = JSON.parse(data);

                if (result.rdv == true) {
                    $('.content').fadeOut();
                    displayMessage(1);
                } else {
                    alert("Une erreur est survenue : merci de bien vouloir vous reconnecter !");
                    document.location.reload();
                }
            },
            error: function (result, statut, erreur) {
                console.log("Error !");
            }
        });
    } else {
        $('#rdv-create').prop("disabled", false);
        $('#myModal').modal('show');
    }
}

function displayMessage(type) {
    if (type == 0) {
        $('.insert-msg').append("<div class='alert alert-danger' role='alert'><h4 class='alert-heading'>Créneau horaire indisponible</h4><p>Le créneau horaire que vous avez choisi n'est plus disponible chez ce praticien, merci de bien vouloir en indiquer un autre !</p><hr><p class='mb-0'><a href='javascript:window.location.reload(true)'>Retourner à la prise de rendez-vous</a></p></div>");
    } else {
        $('.insert-msg').append("<div class='alert alert-success' role='alert'><h4 class='alert-heading'>Confirmation de rendez-vous</h4><p>Nous vous confirmons que votre rendez-vous chez le praticien " + $('#pr-info-name').text() + " à bien été confirmé pour le " + selectedDate + " à " + selectedTime.substring(0, 5).replace(":", "h") + ". Vous pouvez désormais accéder à votre espace santé pour vérifier les informations de celui-ci.</p><hr><p class='mb-0'><a href='#'>J'accède à mon espace santé</a></p></div>");
    }
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