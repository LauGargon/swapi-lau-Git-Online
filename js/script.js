/*LOGIN
router.post('/', function (req, res) {

    User.findOne({
        username: req.body.log_username,
        password: req.body.log_password
    }, function (err, docs) {
        if (docs.length !== 0) {
            console.log("user exists");
            res.redirect('/index.html');
        }
        else {
            console.log("no exist");
            res.redirect('/login.html');
        }
    });

});*/

$(function() {
  // Functions
  function countdown() {
    let now = new Date();
    let evenDate = new Date(2019, 12, 20);

    let actualTime = now.getTime();
    let eventTime = evenDate.getTime();
    let remTime = eventTime - actualTime;

    let s = Math.floor(remTime / 1000);
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    let d = Math.floor(h / 24);

    h %= 24;
    m %= 60;
    s %= 60;

    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    document.querySelector('#days').textContent = d;
    document.querySelector('#hours').textContent = h;
    document.querySelector('#minutes').textContent = m;
    document.querySelector('#seconds').textContent = s;

    setTimeout(countdown, 1000);
  }

  function loadContent(e) {
    var $clicked = $(e.currentTarget);
    var resource = $clicked.attr('href').replace('#', '');
    // var n = 1;
    // var url = baseUrl + resource + '/' + n;
    var url = baseUrl + resource;
    currentResource = resource;

    e.preventDefault();
    //$.getJSON(url, displayResults);
    if (currentResource !== lastResource) {
      displayLoader(true);
      $.getJSON(url, appendResultsToList);
    }
  }

  function populateModal(data) {
    var properties = [
        'birth_year',
        'eye_color',
        'gender',
        'hair_color',
        'height',
        'mass',
        'skin_color',
        'homeworld',
        'species',
        'starships',
        'vehicles   ',
        'episode_id',
        'director',
        'planets',
        'releare_date',
        'characters',
        'opening_crawl',
        'model',
        'starship_class',
        'manufacturer',
        'cost_in_credits',
        'length',
        'crew',
        'passengers',
        'hyperdrive_rating',
        'MGLT',
        'cargo_capacity',
        'consumables',
        'pilots',
        'vehicle_class',
        'classification',
        'designation',
        'average_height',
        'average_lifespan',
        'language',
        'people',
        'diameter',
        'rotation_period',
        'orbital_period',
        'gravity',
        'population',
        'climate',
        'terrain',
        'surface_water',
        'residents',
        'films',
    ];

    var entries = Object.entries(data);
    var filteredProperties = entries.filter(function(entry) {
      var key = entry[0];
      var value = entry[1];

      // Se la proprietà è una di quelle che vogliamo mostrare la teniamo
      if (properties.includes(key)) {
        return true;
      }

      // Se no la discardiamo
      return false;
    });

    var stringProperties = filteredProperties.map(function(property) {
      var key = property[0];
      var value = property[1];

      // Se il valore è un array, puoi decidere tu di convertirlo in una
      // stringa usando il metodo join()
      if (Array.isArray(value)) {
        value = value
          .map(function(v) {
            return '<a href="' + v + '" target="_blank">' + v + '</a>';
          })
          .join('<br>');
      }

      return (
        '<tr><td>' + key.replace('_', ' ') + '</td><td>' + value + '</td></tr>'
      );
    });
    var html = stringProperties.join('');

    $modal.find('.modal-title').text(data.name || data.title);
    $modal
      .find('.modal-body')
      .html('<table class="table">' + html + '</table>');
    $modal.modal();
  }

  function displayLoader(show) {
    if (show) {
      $loader.removeClass('hide');
    } else {
      $loader.addClass('hide');
    }
  }

  /*function displayResults(results) {
    displayLoader(false);
    $content.html('<pre>' + JSON.stringify(results, null, 2) + '</pre>');
  }*/

  function appendResultsToList(data) {
    nextPage = data.next;

    var list = data.results.map(function(result) {
      // if (result.name === 'Jar Jar Binks') {
      //   result.name += ' ♿️';
      // }

      return (
        '<li class="list-group-item"><a class="list-resources" href="' +
        result.url +
        '">' +
        (result.name || result.title) +
        '</a></li>'
      );
    });

    displayResults(list.join(''));
  }

  function displayResults(html) {
    displayLoader(false);
    var $ul = $content.find('ul');
    var condition = currentResource !== lastResource;
    // Se abbiamo cambiato resource bisognerà fare:
    if (condition) {
      lastResource = currentResource;
      $ul.empty();
    }

    // Se no
    $ul.append(html);

    if (condition) {
      $root.animate(
        {
          scrollTop: document.body.clientHeight,
        },
        1000,
      );
    }
  }

  function displayModal(e) {
    var $clicked = $(e.currentTarget);
    var href = $clicked.attr('href');

    e.preventDefault();
    $.getJSON(href, populateModal);
  }

  function scrollHandler(e) {
    // If the user has scrolled to the bottom of the page
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      // If we have a link for the next page of results
      if (nextPage) {
        $.getJSON(nextPage, appendResultsToList);
      } else {
        console.log('No link to follow');
      }
    }
  }

  // DOM elements
  var $menu = $('.menu');
  var $content = $('.content');
  var $loader = $('.loader');
  var $modal = $('#detail-modal');
  var $root = $('html, body');
  var $window = $(window);

  // Variables
  var baseUrl = 'https://swapi.co/api/';
  var nextPage; // Keep track of the next link to follow
  var currentResource; // Keep track of the selected resource (people, planets, etc.)
  var lastResource; // Keep track of the last selected resource (people, planets, etc.)

  // Events
  $menu.on('click', 'a', loadContent);
  $content.on('click', 'a', displayModal);
  $window.on('scroll', scrollHandler);

  // Initialization
  countdown();
});