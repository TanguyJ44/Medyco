(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function (e) {
        e.preventDefault();
        portfolioFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function () {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Clients Slider
   */
  new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

})()

function sendError(error) {
  $("#error").text(error);
  $("#error").attr("hidden", false);
  $('html, body').scrollTop(0);
}

/*
  AUTH
*/

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
            window.location.href = '../dashboard/patient/profil.html';
          } else {
            // Redirection PR
          }
        } else {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("type");
          $('#auth').show();
          $('#load').hide();
        }
      },
      error: function (result, statut, erreur) {
        sendError("Une erreur s'est produite, veuillez réessayer");
        $("#li-submit").prop("disabled", false);
      }
    });
  } else {
    $('#auth').show();
    $('#load').hide();
  }
}

function onConnect() {
  const email = $("#li-email").val();
  const password = $("#li-password").val();
  const rpps = $("#li-rpps").val();

  $("#error").attr("hidden", true);
  $("#li-submit").prop("disabled", true);

  if (!email.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) || password.length < 1) {
    sendError("Vérifier le format de votre e-mail ainsi que la longueur du mot de passe !");
    $("#li-submit").prop("disabled", false);
  } else {
    $.ajax({
      url: 'http://localhost:3000/api/auth/login/' + email + '$' + hex_sha512(password) + '$' + rpps,
      type: 'GET',
      dataType: 'html',
      success: function (data, statut) {
        const obj = JSON.parse(data);
        if (obj.login == true) {

          sessionStorage.setItem('token', obj.token);
          sessionStorage.setItem('type', obj.type);

          if (obj.type == 0) {
            window.location.href = '../dashboard/patient/profil.html';
          } else {
            window.location.href = '../dashboard/praticien/profil.html';
          }

        } else {
          sendError("E-mail ou Mot de passe incorrect !");
          $("#li-submit").prop("disabled", false);
        }
      },
      error: function (result, statut, erreur) {
        sendError("Une erreur s'est produite, veuillez réessayer");
        $("#li-submit").prop("disabled", false);
      }
    });
  }
}

function onRegister() {
  const client = ({
    gender: $("#ri-gender").val(),
    lastname: $("#ri-lastname").val(),
    firstname: $("#ri-firstname").val(),
    email: $("#ri-email").val(),
    birth: $("#ri-birth").val(),
    address: $("#ri-address").val(),
    city: $("#ri-city").val(),
    zipcode: $("#ri-zipcode").val(),
    password1: $("#ri-password1").val(),
    password2: $("#ri-password2").val(),
    rpps: $("#ri-rpps").val(),
    check: $("#ri-check").prop("checked")
  });

  $("#error").attr("hidden", true);
  $("#ri-submit").prop("disabled", true);

  if (client.lastname.length < 1 || client.firstname.length < 1 || client.birth.length < 1
    || client.address.length < 1 || client.city.length < 1 || client.zipcode.length < 1
    || client.password1.length < 1 || client.password2.length < 1 || client.check == false) {

    sendError("Veuillez compléter toutes les informations demandées et accepter les conditions générales d'utilisation.");
    $("#ri-submit").prop("disabled", false);
  } else {
    if (!client.email.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) || client.email.length < 1
      || !client.zipcode.match(/^[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}[0-9]{1}$/) || client.zipcode.length < 1) {
      sendError("Veuillez vérifier le format de votre e-mail et de votre code postal.");
      $("#ri-submit").prop("disabled", false);
    } else {
      if (client.password1 != client.password2) {
        sendError("Les deux mots de passe doivent être identiques.");
        $("#ri-submit").prop("disabled", false);
      } else {
        $.ajax({
          url: 'http://localhost:3000/api/auth/register',
          type: 'POST',
          data: {
            gender: client.gender,
            lastname: client.lastname,
            firstname: client.firstname,
            email: client.email,
            birth: client.birth,
            address: client.address,
            city: client.city,
            zipcode: client.zipcode,
            password: hex_sha512(client.password1),
            rpps: client.rpps.length < 1 ? 0 : client.rpps,
          },
          dataType: 'html',
          success: function (data, statut) {
            const obj = JSON.parse(data);
            if (obj.register == true) {
              if (obj.type == 0) {
                $("#form-auth").slideUp(600);
                $("#register-confirm").slideDown(900);
              } else {
                $("#form-auth").slideUp(600);
                $("#register-pr-confirm").slideDown(900);
              }
            } else {
              sendError("Un compte existe déjà avec cet e-mail.");
              $("#ri-submit").prop("disabled", false);
            }
          },
          error: function (result, statut, erreur) {
            sendError("Une erreur s'est produite, veuillez réessayer");
            $("#ri-submit").prop("disabled", false);
          }
        });
      }
    }
  }
}

function onRecovery() {
  const email = $("#li-email").val();

  $("#error").attr("hidden", true);
  $("#li-submit").prop("disabled", true);

  if (!email.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i) || email.length < 1) {
    sendError("Vous devez indiquer un e-mail valide dans le champ 'Email' pour pouvoir récupérer votre mot de passe !");
    $("#li-submit").prop("disabled", false);
  } else {
    $.ajax({
      url: 'http://localhost:3000/api/auth/recovery/' + email,
      type: 'PUT',
      dataType: 'html',
      success: function (data, statut) {
        const obj = JSON.parse(data);
        if (obj.recovery == true) {
          $("#form-auth").slideUp(600);
          $("#recovery-confirm").slideDown(900);
        } else {
          sendError("Aucun compte ne correspond à cette e-mail !");
          $("#li-submit").prop("disabled", false);
        }
      },
      error: function (result, statut, erreur) {
        sendError("Une erreur s'est produite, veuillez réessayer");
        $("#li-submit").prop("disabled", false);
      }
    });
  }
}

function onUpdatePassword() {
  const password1 = $("#ui-password1").val();
  const password2 = $("#ui-password2").val();

  $("#error").attr("hidden", true);
  $("#ui-submit").prop("disabled", true);

  if (password1.length < 1 || password2.length < 1) {
    sendError("Veuillez compléter tous les champs de texte ci-dessous");
    $("#ui-submit").prop("disabled", false);
  } else {
    if (password1 != password2) {
      sendError("Les deux mots de passe doivent être similaires");
      $("#ui-submit").prop("disabled", false);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      $.ajax({
        url: 'http://localhost:3000/api/auth/recovery/update',
        type: 'POST',
        data: {
          token: urlParams.get('request'),
          password: hex_sha512(password1),
        },
        dataType: 'html',
        success: function (data, statut) {
          const obj = JSON.parse(data);
          if (obj.update == true) {
            $("#form-auth").slideUp(600);
            $("#update-confirm").slideDown(900);
          } else {
            sendError("La demande de récupération a expiré !");
            $("#ui-submit").prop("disabled", false);
          }
        },
        error: function (result, statut, erreur) {
          sendError("Une erreur s'est produite, veuillez réessayer");
          $("#ui-submit").prop("disabled", false);
        }
      });
    }
  }
}

function onConfirmAccount() {
  setTimeout(function () {
    const urlParams = new URLSearchParams(window.location.search);
    $.ajax({
      url: 'http://localhost:3000/api/auth/confirm/' + urlParams.get('request'),
      type: 'PUT',
      dataType: 'html',
      success: function (data, statut) {
        const obj = JSON.parse(data);
        if (obj.confirm == true) {
          $("#form-auth").slideUp(600);
          $("#alert-confirm").slideDown(900);
        } else {
          sendError("La demande de confirmation a expiré !");
        }
      },
      error: function (result, statut, erreur) {
        sendError("Une erreur s'est produite, veuillez réessayer");
      }
    });
  }, 1500);
}