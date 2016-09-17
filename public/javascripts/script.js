$(document).ready(function () {
  var reloadImages = function () {
    $('#choice1').data('cityName', '');
    $('#choice2').data('cityName', '');
    $.ajax({
      type: 'GET',
      url: '/api/pair',
      success: function (data) {
        $('#choice1').data('cityName', data[0].city_name);
        $('#choice1').attr('src', '/images/cities/' + data[0].placeholder_image);
        $('#choice2').data('cityName', data[1].city_name);
        $('#choice2').attr('src', '/images/cities/' + data[1].placeholder_image);
      }
    });
  };

  reloadImages();

  $('.choice').click(function (e) {
    var winnerEl;
    var loserEl;
    if ($(e.currentTarget).attr('id') === 'choice1') {
      winnerEl = $('#choice1');
      loserEl = $('#choice2');
    } else {
      winnerEl = $('#choice2');
      loserEl = $('#choice1');
    }
    winner = winnerEl.data('cityName');
    loser = loserEl.data('cityName');
    $.ajax({
      type: 'POST',
      url: '/api/rate',
      data: {
        winner: winner,
        loser: loser
      },
      success: function () {
        reloadImages();
      },
      error: function () {
        console.log('Failed to record vote');
      }
    });
  });

  var loadRankings = function () {
    $.ajax({
      type: 'GET',
      url: '/api/cities',
      success: function (data) {
        var ol = $('#rankings ol');
        ol.empty();
        $.each(data, function (index, obj) {
          var item = $('<li>' + obj.city_name + ' -- ' + obj.rating + '</li>');
          ol.append(item);
        });
      }
    });
  };

  loadRankings();
  setInterval(loadRankings, 2000);
});