// Generated by CoffeeScript 1.4.0
(function() {
  var getImageColor, insertSeasons;

  getImageColor = function() {
    return $("article.photo").each(function() {
      var currentId, image_url, small_image_url;
      currentId = $(this).attr("id");
      if (!$(this).find("h2").attr("style")) {
        image_url = $(this).find("section.post-content img").attr("src");
        small_image_url = image_url.replace('500.jpg', '100.jpg');
        return $.getImageData({
          url: small_image_url,
          success: function(image) {
            var paletteArray;
            paletteArray = createPalette(image, 2);
            paletteArray.sort(function() {
              return 0.5 - Math.random();
            });
            return $("#" + currentId + " section.post-meta h2").css('color', "rgba(" + paletteArray[0] + ", 1)");
          },
          error: function(xhr, text_status) {
            return console.log("Failed on " + small_image_url);
          }
        });
      }
    });
  };

  insertSeasons = function() {
    var calendar, previousMonth;
    previousMonth = null;
    calendar = [[1, "winter"], [2, "winter"], [3, "spring"], [4, "spring"], [5, "spring"], [6, "summer"], [7, "summer"], [8, "summer"], [9, "autumn"], [10, "autumn"], [11, "autumn"], [12, "winter"]];
    $('div.season').remove();
    return $("article.post").each(function() {
      var currentMonth, currentMonthSeason, currentYear, datetime, previousMonthSeason, previousYear, upcomingYear;
      datetime = $(this).find("time").attr("datetime").split('-');
      currentMonth = datetime[1];
      currentYear = datetime[0];
      if ((currentMonth !== previousMonth) && (previousMonth !== null)) {
        currentMonthSeason = calendar[currentMonth - 1][1];
        previousMonthSeason = calendar[previousMonth - 1][1];
        if ((currentMonthSeason === "winter") && (currentMonth === 12)) {
          previousYear = currentYear;
          upcomingYear = parseInt(currentYear) + 1;
          currentYear = previousYear + '–' + upcomingYear;
        } else if (currentMonthSeason === "winter") {
          previousYear = parseInt(currentYear) - 1;
          upcomingYear = currentYear;
          currentYear = previousYear + '–' + upcomingYear;
        }
        if (currentMonthSeason !== previousMonthSeason) {
          $(this).before("<div class=\"season " + currentMonthSeason + "\">\n  <h2>" + currentMonthSeason + " <span class=\"year\">" + currentYear + "</span></h2>\n</div>");
        }
      }
      return previousMonth = currentMonth;
    });
  };

  $(document).ready(function() {
    insertSeasons();
    getImageColor();
    $(".fancybox").fancybox({
      padding: 0,
      openEffect: 'elastic',
      openSpeed: 150,
      closeEffect: 'elastic',
      closeSpeed: 150,
      closeClick: true,
      minHeight: 500,
      minWidth: 500,
      maxHeight: 600,
      maxWidth: 600,
      helpers: {
        title: {
          type: 'outside'
        }
      }
    });
    XMLHttpRequest.prototype.originalSend = XMLHttpRequest.prototype.send;
    return XMLHttpRequest.prototype.send = function(s) {
      this.addEventListener('load', (function() {
        insertSeasons();
        return getImageColor();
      }), false);
      return this.originalSend(s);
    };
  });

}).call(this);
