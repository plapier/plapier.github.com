// Generated by CoffeeScript 1.6.3
(function() {
  var ConstructSlider;

  ConstructSlider = (function() {
    ConstructSlider.viewportW;

    function ConstructSlider() {
      this.nav = $('nav.slider-nav');
      this.drawer = $('.drawer');
      this.container = $('#slider');
      this.inner = this.container.find('.slider-container');
      this.setInnerWidth();
      this.setupArrows();
      this.setupDrawerNav();
      this.setupImagesNav();
      this.setupKeybindings();
      this.setupSwipeEvents();
      this.watchViewportWidth();
      this.readHash();
    }

    ConstructSlider.prototype.setInnerWidth = function() {
      var width;
      width = null;
      this.inner.find('section').each(function() {
        return width = width + $(this).outerWidth(true) + 3;
      });
      return this.inner.css('width', width);
    };

    ConstructSlider.prototype.setupArrows = function() {
      var _this = this;
      this.inner.find('.nav-info').addClass('slide-up');
      return this.nav.on('click', '.arrow', function(event) {
        var id;
        id = $(event.target).attr('data-id');
        _this.slideNext(id);
        _this.hideDrawer();
        return _this.removeTransitionClass();
      });
    };

    ConstructSlider.prototype.slideNext = function(id) {
      var $current, $next, $scrollPos, $target, index, offset, pxVal, speed, timeout, width,
        _this = this;
      $current = this.container.find('.active');
      index = this.inner.find('section').index($current);
      if (id === "next") {
        $next = $current.next();
        width = (index + 1) * 90;
        pxVal = (this.viewportW * (index + 1)) * (90 / 100);
      } else if (id = "prev") {
        $next = $current.prev();
        width = (index - 1) * 90;
        pxVal = (this.viewportW * (index - 1)) * (90 / 100);
      }
      this.changeHash($next);
      if ($next.length) {
        $target = $current.find('.frame');
        timeout = 0;
        speed = 400;
        $scrollPos = $current.scrollTop();
        if ($scrollPos > 100) {
          offset = $current.scrollTop();
          console.log($target);
          $target.addClass('animate').css('transform', "translateY(" + offset + "px");
          $target.on("transitionend webkitTransitionEnd MSTransitionEnd", function() {
            return $(this).removeClass('animate');
          });
          timeout = speed + 50;
        }
        window.setTimeout((function() {
          _this.inner.css('transform', "translateX(-" + pxVal + "px)");
          $current.removeClass('active');
          $next.addClass('active');
          _this.changeDrawerActive();
          return _this.inner.on("transitionend webkitTransitionEnd MSTransitionEnd", function() {
            $target.css('transform', "translateX(0)");
            return $current.scrollTop(0);
          });
        }), timeout);
        return this.hideDrawer();
      }
    };

    ConstructSlider.prototype.setupDrawerNav = function() {
      var _this = this;
      this.nav.find('.menu').click(function() {
        return _this.toggleDrawer();
      });
      return this.drawer.find('a').on('click', function(event) {
        var dataId;
        dataId = $(event.target).attr('href');
        return _this.slideToTarget(dataId);
      });
    };

    ConstructSlider.prototype.slideToTarget = function(id) {
      var $current, $currentIndex, $target, $targetIndex, diff, pxVal;
      id = id.replace("#", "");
      $target = this.inner.find("[data-id='" + id + "']");
      $targetIndex = $target.index();
      $current = this.container.find('.active');
      $currentIndex = $current.index();
      diff = Math.abs($targetIndex - $currentIndex);
      if ($targetIndex !== $currentIndex) {
        pxVal = Math.floor((this.viewportW * $targetIndex) * (90 / 100));
        $current.removeClass('active');
        $target.addClass('active');
        this.inner.addClass("transition-" + diff).css('transform', "translateX(-" + pxVal + "px)");
        this.changeDrawerActive();
        this.hideDrawer();
        $current.scrollTop(0);
        this.changeHash($target);
        return this.removeTransitionClass();
      }
    };

    ConstructSlider.prototype.setupImagesNav = function() {
      this.setBrowserHeight();
      return this.inner.find('nav.dots').on('click', 'span', function() {
        var images, index;
        if (!$(this).hasClass('current')) {
          index = $(this).index();
          images = $(this).parent().siblings('img');
          $(this).addClass('current').siblings().removeClass('current');
          return $(images[index]).addClass('current').siblings().removeClass('current');
        }
      });
    };

    ConstructSlider.prototype.setBrowserHeight = function() {
      return this.inner.find('.multiple-images').each(function() {
        var imageHeight;
        imageHeight = $(this).find('img.current').outerHeight();
        return $(this).height(imageHeight);
      });
    };

    ConstructSlider.prototype.toggleDrawer = function(val) {
      if (val === "close" || this.container.hasClass('show-nav')) {
        this.container.removeClass('show-nav').addClass('hide-nav');
        this.drawer.removeClass('show').addClass('hide');
        return this.nav.removeClass('show').addClass('hide');
      } else if (val = 'open' || this.container.hasClass('show-nav')) {
        this.container.removeClass('hide-nav').addClass('show-nav');
        this.drawer.removeClass('hide').addClass('show');
        return this.nav.removeClass('hide').addClass('show');
      }
    };

    ConstructSlider.prototype.hideDrawer = function() {
      var _this = this;
      if (this.container.hasClass('show-nav')) {
        return this.inner.on("transitionend webkitTransitionEnd MSTransitionEnd", function() {
          _this.toggleDrawer("close");
          return _this.removeTransitionClass();
        });
      }
    };

    ConstructSlider.prototype.changeDrawerActive = function() {
      var $target, selector;
      selector = this.container.find('.active').attr('class').split(' ')[0];
      return $target = this.drawer.find("a[href='#" + selector + "']").parent().addClass('active').siblings().removeClass('active');
    };

    ConstructSlider.prototype.removeTransitionClass = function() {
      return this.inner.removeClass(function(index, css) {
        return (css.match(/\btransition\S+/g) || []).join(" ");
      });
    };

    ConstructSlider.prototype.setupSwipeEvents = function() {
      var _this = this;
      if ($.isTouchCapable()) {
        this.inner.on("swiperight", function(e, touch) {
          _this.slideNext("prev");
          return e.preventDefault();
        });
        return this.inner.on("swipeleft", function(e, touch) {
          _this.slideNext("next");
          return e.preventDefault();
        });
      }
    };

    ConstructSlider.prototype.setupKeybindings = function() {
      var _this = this;
      $(window).focus(function() {
        var window_focus;
        return window_focus = true;
      });
      return $(window).keydown(function(event) {
        var arrow, keyCode;
        keyCode = event.keyCode || event.which;
        arrow = {
          left: 37,
          up: 38,
          right: 39,
          down: 40
        };
        switch (keyCode) {
          case arrow.left:
            return _this.slideNext("prev");
          case arrow.right:
            return _this.slideNext("next");
          case arrow.down:
            return _this.toggleDrawer();
          case arrow.up:
            return _this.toggleDrawer();
        }
      });
    };

    ConstructSlider.prototype.watchViewportWidth = function() {
      var onResize,
        _this = this;
      this.viewportW = this.getViewportW();
      onResize = function() {
        _this.viewportW = _this.getViewportW();
        _this.setInnerWidth();
        _this.recalculatePos();
        return _this.setBrowserHeight();
      };
      return $(window).bind("resize", function() {
        var timer;
        timer && clearTimeout(timer);
        return timer = setTimeout(onResize, 500);
      });
    };

    ConstructSlider.prototype.getViewportW = function() {
      return document.documentElement.clientWidth;
    };

    ConstructSlider.prototype.recalculatePos = function() {
      var $current, index, pxVal;
      $current = this.container.find('.active');
      index = this.inner.find('section').index($current);
      pxVal = Math.floor((this.viewportW * index) * (90 / 100));
      return this.inner.css('transform', "translateX(-" + pxVal + "px)");
    };

    ConstructSlider.prototype.readHash = function() {
      var hash, hashes;
      hashes = [];
      hash = window.location.hash;
      this.inner.find('section').each(function(index, el) {
        return hashes.push("#" + (el.getAttribute('data-id')));
      });
      if (hashes.indexOf(hash) !== -1) {
        if (hash.length !== 0) {
          return this.slideToTarget(hash);
        }
      }
    };

    ConstructSlider.prototype.changeHash = function(target) {
      var id;
      id = target.attr('data-id');
      return History.replaceState({
        state: 1
      }, "" + id, "#" + id);
    };

    return ConstructSlider;

  })();

  $(function() {
    return new ConstructSlider();
  });

}).call(this);
