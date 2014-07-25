// Generated by CoffeeScript 1.7.1
(function() {
  var ConstructSlider;

  ConstructSlider = (function() {
    ConstructSlider.viewportW;

    function ConstructSlider() {
      this.transition = "transitionend webkitTransitionEnd MSTransitionEnd";
      this.nav = document.getElementsByClassName('slider-nav')[0];
      this.drawer = document.getElementsByClassName('drawer')[0];
      this.container = document.getElementById('slider');
      this.inner = document.getElementById('inner');
      this.sections = this.inner.getElementsByTagName('section');
      this.setInnerWidth();
      this.setupArrows();
      this.setupDrawerNav();
      this.setupKeybindings();
      this.setupSwipeEvents();
      this.watchViewportWidth();
      this.readHash();
    }

    ConstructSlider.prototype.setInnerWidth = function() {
      var section, width, _i, _len, _ref;
      width = null;
      _ref = this.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        width = width + section.offsetWidth + 3;
      }
      return this.inner.style.width = "" + width + "px";
    };

    ConstructSlider.prototype.setupArrows = function() {
      var arrows;
      arrows = this.inner.getElementsByClassName('nav-info')[0];
      return arrows.classList.add('slide-up');
    };

    ConstructSlider.prototype.slideNext = function(id) {
      var $scrollPos, current, index, next, offset, pxVal, speed, target, timeout, width;
      next = void 0;
      current = this.container.getElementsByClassName('active')[0];
      index = $(this.sections).index(current);
      if (id === "next") {
        next = current.nextElementSibling;
        width = (index + 1) * 90;
        pxVal = (this.viewportW * (index + 1)) * (90 / 100);
      } else if (id = "prev") {
        next = current.previousElementSibling;
        width = (index - 1) * 90;
        pxVal = (this.viewportW * (index - 1)) * (90 / 100);
      }
      this.changeHash(next);
      if (next == null) {
        return;
      }
      target = current.getElementsByClassName('frame')[0];
      timeout = 0;
      speed = 400;
      $scrollPos = $(current).scrollTop();
      if ($scrollPos > 100) {
        offset = $(current).scrollTop();
        target.classList.add('animate');
        $(target).css('transform', "translateY(" + offset + "px");
        $(target).on(this.transition, function() {
          target.classList.remove('animate');
          return $(target).off(this.transition);
        });
        timeout = speed + 50;
      }
      window.setTimeout(((function(_this) {
        return function() {
          $(_this.inner).css('transform', "translateX(-" + pxVal + "px)");
          current.classList.remove('active');
          next.classList.add('active');
          _this.changeDrawerActive();
          return $(_this.inner).on(_this.transition, function() {
            $(target).css('transform', "translateX(0)");
            $(current).scrollTop(0);
            return $(_this.inner).off(_this.transition);
          });
        };
      })(this)), timeout);
      return this.hideDrawer();
    };

    ConstructSlider.prototype.setupDrawerNav = function() {
      $(this.nav).on('click', (function(_this) {
        return function(event) {
          var id;
          if (event.target.classList.contains('arrow')) {
            id = event.target.getAttribute('data-id');
            _this.slideNext(id);
            _this.hideDrawer();
            return _this.removeTransitionClass();
          } else if (event.target.classList.contains('menu')) {
            _this.toggleDrawer();
            return mixpanel.track("Menu Click");
          }
        };
      })(this));
      return $(this.drawer).on('click', (function(_this) {
        return function(event) {
          var dataId;
          dataId = event.target.getAttribute('href');
          return _this.slideToTarget(dataId);
        };
      })(this));
    };

    ConstructSlider.prototype.slideToTarget = function(id) {
      var $currentIndex, $targetIndex, current, diff, pxVal, target;
      id = id.replace("#", "");
      target = this.inner.querySelectorAll("[data-id='" + id + "']")[0];
      current = this.container.getElementsByClassName('active')[0];
      $targetIndex = $(target).index();
      $currentIndex = $(current).index();
      if ($targetIndex === $currentIndex) {
        return;
      }
      diff = Math.abs($targetIndex - $currentIndex);
      pxVal = Math.floor((this.viewportW * $targetIndex) * (90 / 100));
      current.classList.remove('active');
      target.classList.add('active');
      this.inner.classList.add("transition-" + diff);
      $(this.inner).css('transform', "translateX(-" + pxVal + "px)");
      this.changeDrawerActive();
      this.hideDrawer();
      $(current).scrollTop(0);
      this.changeHash(target);
      return this.removeTransitionClass();
    };

    ConstructSlider.prototype.toggleDrawer = function(val) {
      if (val === "close" || this.container.classList.contains('show-nav')) {
        this.container.classList.remove('show-nav');
        this.container.classList.add('hide-nav');
        this.drawer.classList.remove('show');
        this.drawer.classList.add('hide');
        this.nav.classList.remove('show');
        return this.nav.classList.add('hide');
      } else if (val = 'open' || this.container.classList.contains('show-nav')) {
        this.container.classList.remove('hide-nav');
        this.container.classList.add('show-nav');
        this.drawer.classList.remove('hide');
        this.drawer.classList.add('show');
        this.nav.classList.remove('hide');
        return this.nav.classList.add('show');
      }
    };

    ConstructSlider.prototype.hideDrawer = function() {
      if (!this.container.classList.contains('show-nav')) {
        return;
      }
      return $(this.inner).on(this.transition, (function(_this) {
        return function() {
          _this.toggleDrawer("close");
          _this.removeTransitionClass();
          return $(_this.inner).off(_this.transition);
        };
      })(this));
    };

    ConstructSlider.prototype.changeDrawerActive = function() {
      var selector;
      selector = $(this.container).find('.active').attr('class').split(' ')[0];
      this.drawer.getElementsByClassName('active')[0].classList.remove('active');
      return this.drawer.querySelector("a[href='#" + selector + "']").parentElement.classList.add('active');
    };

    ConstructSlider.prototype.removeTransitionClass = function() {
      return $(this.inner).removeClass(function(index, css) {
        return (css.match(/\btransition\S+/g) || []).join(" ");
      });
    };

    ConstructSlider.prototype.setupSwipeEvents = function() {
      return $(this.inner).hammer({
        drag_min_distance: 50,
        drag_lock_to_axis: true,
        drag_block_horizontal: true,
        drag_block_vertical: true
      }).on("dragstart", (function(_this) {
        return function(ev) {
          ev.preventDefault();
          return _this.inner.classList.add('no-transition');
        };
      })(this)).on("drag", (function(_this) {
        return function(ev) {
          var $currentIndex, deltaDistance, distance, pxVal;
          ev.preventDefault();
          $currentIndex = $(_this.container).find('.active').index();
          pxVal = Math.floor((_this.viewportW * $currentIndex) * (90 / 100));
          distance = Math.floor(ev.gesture.distance);
          if (ev.gesture.direction === "right") {
            distance = distance * -1;
          }
          switch (ev.gesture.direction) {
            case "right":
            case "left":
              deltaDistance = pxVal + distance;
              return $(_this.inner).css('transform', "translateX(-" + deltaDistance + "px)");
            case "up":
            case "down":
              return false;
          }
        };
      })(this)).on("dragend", (function(_this) {
        return function(ev) {
          ev.preventDefault();
          _this.inner.classList.remove('no-transition');
          _this.inner.classList.add('drag-transition');
          setTimeout((function() {
            return _this.inner.classList.remove('drag-transition');
          }), 600);
          switch (ev.gesture.direction) {
            case "right":
              ev.gesture.stopDetect();
              return _this.slideNext("prev");
            case "left":
              ev.gesture.stopDetect();
              return _this.slideNext("next");
          }
        };
      })(this)).on('pinch', (function(_this) {
        return function() {
          return ev.preventDefault();
        };
      })(this));
    };

    ConstructSlider.prototype.setupKeybindings = function() {
      $(window).focus(function() {
        var window_focus;
        return window_focus = true;
      });
      return $(window).keydown((function(_this) {
        return function(event) {
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
              _this.slideNext("prev");
              break;
            case arrow.right:
              _this.slideNext("next");
              break;
            case arrow.down:
            case arrow.up:
              _this.toggleDrawer();
          }
          return mixpanel.track("Key Press");
        };
      })(this));
    };

    ConstructSlider.prototype.watchViewportWidth = function() {
      var onResize;
      this.viewportW = this.getViewportW();
      onResize = (function(_this) {
        return function() {
          _this.viewportW = _this.getViewportW();
          _this.setInnerWidth();
          return _this.recalculatePos();
        };
      })(this);
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
      $current = this.container.getElementsByClassName('active');
      index = $(this.sections).index($current);
      pxVal = Math.floor((this.viewportW * index) * (90 / 100));
      return $(this.inner).css('transform', "translateX(-" + pxVal + "px)");
    };

    ConstructSlider.prototype.readHash = function() {
      var hash, hashes, section, _i, _len, _ref;
      hashes = [];
      hash = window.location.hash;
      _ref = this.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        hashes.push("#" + (section.getAttribute('data-id')));
      }
      if (hashes.indexOf(hash) !== -1) {
        if (hash.length !== 0) {
          return this.slideToTarget(hash);
        }
      }
    };

    ConstructSlider.prototype.changeHash = function(target) {
      var id;
      id = $(target).attr('data-id');
      if (id) {
        History.replaceState({
          state: 1
        }, "" + id, "#" + id);
      }
      _gaq.push(["_trackPageview", location.pathname + location.search + location.hash]);
      return mixpanel.track(id);
    };

    return ConstructSlider;

  })();

  $(function() {
    return new ConstructSlider();
  });

}).call(this);
