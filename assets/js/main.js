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


/*
  SEARCH
*/

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('category') != null) {
    $("#oCategorie").val(urlParams.get('category'));
  }
  if (urlParams.get('search') != null) {
    $("#oSaisie").val(urlParams.get('search'));
  }

  if ($('#oSaisie').val().length > 0) {
    dispatch();
  }

  if (sessionStorage.getItem('token') != null) {
    getUserFavoritePr();
  }
}

$('#oSaisie').on('input', function (e) {
  dispatch();
});

function dispatch() {
  if ($('#oCategorie').val() == "all") {
    search($('#oSaisie').val());
  } else if ($('#oCategorie').val() == "loc") {
    searchCategory(['address', 'city', 'zipcode', 'department', 'region'], $('#oSaisie').val());
  } else {
    searchCategory($('#oCategorie').val(), $('#oSaisie').val());
  }
}

function treatment(result) {
  $(".insert").empty();
  $.each(JSON.parse(result), function (i, obj) {
    if (i != 'message' && $('#oSaisie').val().length > 0) {
      if (sessionStorage.getItem('token') != null) {
        $(".insert").append("<div class='card card-search'><div class='row no-gutters'><div class='col-sm-4'><img class='card-img-top h-100'src='https://hellocare.com/blog/wp-content/uploads/2019/06/page_medecin.jpg' width='100' height='100'></div><div class='col-sm-8'><div class='card-body'><h5 class='card-title'>" + obj['name'] + "<i class='bi bi-star' id='fav-icon'></i></h5><p class='card-text' id='p-spe'>" + obj['specialties'] + "</p><p class='card-text'>" + obj['address'] + " - " + obj['zipcode'] + " " + obj['city'] + "</p><button type='button' class='btn btn-primary' onclick=\"window.location='rdv.html?id=" + obj['id'] + "'\";>Prendre rendez-vous</button></div></div></div></div>");
      } else {
        $(".insert").append("<div class='card card-search'><div class='row no-gutters'><div class='col-sm-4'><img class='card-img-top h-100'src='https://hellocare.com/blog/wp-content/uploads/2019/06/page_medecin.jpg' width='100' height='100'></div><div class='col-sm-8'><div class='card-body'><h5 class='card-title'>" + obj['name'] + "<i class='bi bi-star' id='fav-icon'></i></h5><p class='card-text' id='p-spe'>" + obj['specialties'] + "</p><p class='card-text'>" + obj['address'] + " - " + obj['zipcode'] + " " + obj['city'] + "</p><button type='button' class='btn btn-primary' disabled>Prendre rendez-vous</button><p>↪ Vous devez être connecté pour prendre rendez-vous</p></div></div></div></div>");
      }
    } else {
      contentEmptySearch();
    }
  });
}

function search(query) {
  $.ajax({
    url: 'http://localhost:3000/api/search/' + query,
    type: 'GET',
    dataType: 'html',
    success: function (data, statut) {
      treatment(data);
    },
    error: function (result, statut, erreur) {
      console.log("Error !");
    }
  });
}

function searchCategory(category, query) {
  $.ajax({
    url: 'http://localhost:3000/api/search/' + category + '/' + query,
    type: 'GET',
    dataType: 'html',
    success: function (data, statut) {
      treatment(data);
    },
    error: function (result, statut, erreur) {
      console.log("Error !");
    }
  });
}

function contentEmptySearch() {
  $(".insert").empty();
  if (sessionStorage.getItem('token') != null) {

  } else {
    $(".insert").append("<p class='text-center'>Veuillez effectuer une recherche pour afficher du contenu</p>");
  }
}

function getUserFavoritePr() {
  $.ajax({
    url: 'http://localhost:3000/api/favorite/' + sessionStorage.getItem('token'),
    type: 'GET',
    dataType: 'html',
    success: function (data, statut) {
      displayFavorite(data);
    },
    error: function (result, statut, erreur) {
      console.log("Error !");
    }
  });
}

function displayFavorite(data) {
  $(".insert").empty();
  $.each(JSON.parse(data), function (i, obj) {
    $(".insert").append("<div class='card card-search'><div class='row no-gutters'><div class='col-sm-4'><img class='card-img-top h-100'src='https://hellocare.com/blog/wp-content/uploads/2019/06/page_medecin.jpg' width='100' height='100'></div><div class='col-sm-8'><div class='card-body'><h5 class='card-title'>" + obj['name'] + "<i class='bi bi-star' id='fav-icon'></i></h5><p class='card-text' id='p-spe'>" + obj['specialties'] + "</p><p class='card-text'>" + obj['address'] + " - " + obj['zipcode'] + " " + obj['city'] + "</p><button type='button' class='btn btn-primary' onclick=\"window.location='rdv.html?id=" + obj['id'] + "'\";>Prendre rendez-vous</button></div></div></div></div>");
  });
}