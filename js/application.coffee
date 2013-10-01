class ConstructSlider
  @viewportW
  constructor: () ->
    @nav       = $('nav.slider-nav')
    @drawer    = $('.drawer')
    @container = $('#slider')
    @inner     = @container.find('.slider-container')
    @setInnerWidth()
    @setupArrows()
    @setupDrawerNav()
    @setupImagesNav()
    @setupKeybindings()
    @setupSwipeEvents()
    @watchViewportWidth()
    @readHash()
    @setupSwipe()

  setInnerWidth: ->
    width = null
    @inner.find('section').each ->
      width = width + $(this).outerWidth(true) + 3 ## 3 random pixels? Rounding bug?
    @inner.css('width', width)

  ## Next/Prev Nav Buttons
  setupArrows: ->
    @inner.find('.nav-info').addClass('slide-up') # keyboard shortcuts popup
    @nav.on 'click', '.arrow', (event) =>
      id = $(event.target).attr('data-id')
      @slideNext(id)
      @hideDrawer()
      @removeTransitionClass()

  slideNext: (id) ->
    $current = @container.find('.active')
    index = @inner.find('section').index($current)
    if id is "next"
      $next = $current.next()
      width = (index + 1) * 90
      pxVal = (@viewportW * (index + 1)) * (90/100)
    else if id = "prev"
      $next = $current.prev()
      width = (index - 1) * 90
      pxVal = (@viewportW * (index - 1)) * (90/100)
    @changeHash($next)

    if $next.length
      $target = $current.find('.frame')
      timeout = 0
      speed = 400
      $scrollPos = $current.scrollTop()
      if $scrollPos > 100
        offset = $current.scrollTop()
        console.log $target
        $target.addClass('animate').css('transform', "translateY(#{offset}px")
        $target.on "transitionend webkitTransitionEnd MSTransitionEnd", ->
          $(this).removeClass('animate')
        timeout = speed + 50

      window.setTimeout (=>
        @inner.css('transform', "translateX(-#{pxVal}px)")
        $current.removeClass('active')
        $next.addClass('active')
        @changeDrawerActive()
        @inner.on "transitionend webkitTransitionEnd MSTransitionEnd", ->
          $target.css('transform', "translateX(0)")
          # $target.addClass("zoom")
          $current.scrollTop(0)
      ), timeout
      @hideDrawer()

  ## Drawer Navigation
  setupDrawerNav: ->
    @nav.find('.menu').click =>
      @toggleDrawer()
      mixpanel.track("Menu Click")

    @drawer.find('a').on 'click', (event) =>
      dataId = $(event.target).attr('href')
      @slideToTarget(dataId)

  slideToTarget: (id) ->
    id = id.replace("#", "")
    $target = @inner.find("[data-id='#{id}']")
    $targetIndex = $target.index()
    $current = @container.find('.active')
    $currentIndex = $current.index()
    diff = Math.abs($targetIndex - $currentIndex)

    if $targetIndex isnt $currentIndex
      pxVal = Math.floor (@viewportW * $targetIndex) * (90/100)
      $current.removeClass('active') ## THIS
      $target.addClass('active')
      @inner.addClass("transition-#{diff}").css('transform', "translateX(-#{pxVal}px)")
      @changeDrawerActive()
      @hideDrawer()
      $current.scrollTop(0)
      @changeHash($target)
      @removeTransitionClass()

  ## For Multiples images in a single browser frame
  setupImagesNav: ->
    @setBrowserHeight()
    @inner.find('nav.dots').on 'click', 'span', ->
      if !$(this).hasClass('current')
        index  = $(this).index()
        images = $(this).parent().siblings('img')
        $(this).addClass('current').siblings().removeClass('current')
        $(images[index]).addClass('current').siblings().removeClass('current')

  setBrowserHeight: ->
    @inner.find('.multiple-images').each ->
      imageHeight = $(this).find('img.current').outerHeight()
      $(this).height(imageHeight)

  ## Show/Hide Drawer
  toggleDrawer: (val) ->
    if val is "close"    or @container.hasClass('show-nav')
      @container.removeClass('show-nav').addClass('hide-nav')
      @drawer.removeClass('show').addClass('hide')
      @nav.removeClass('show').addClass('hide')
    else if val = 'open' or @container.hasClass('show-nav')
      @container.removeClass('hide-nav').addClass('show-nav')
      @drawer.removeClass('hide').addClass('show')
      @nav.removeClass('hide').addClass('show')

  hideDrawer: ->
    if @container.hasClass('show-nav')
      @inner.on "transitionend webkitTransitionEnd MSTransitionEnd", =>
        @toggleDrawer("close")
        @removeTransitionClass()

  changeDrawerActive: ->
    selector = @container.find('.active').attr('class').split(' ')[0]
    $target  = @drawer.find("a[href='##{selector}']").parent().addClass('active').siblings().removeClass('active')

  removeTransitionClass: ->
    @inner.removeClass (index, css) ->
      (css.match(/\btransition\S+/g) or []).join " "

  setupSwipeEvents: ->
    @inner.hammer(
      drag_min_distance: 50
      drag_lock_to_axis: true
      drag_block_horizontal: true
      drag_block_vertical: true
    )
      .on("dragstart", (ev) =>
        ev.preventDefault()
        @inner.addClass('no-transition')

      ).on("touch drag", (ev) =>
        ev.preventDefault()

        $currentIndex = @container.find('.active').index()
        pxVal         = Math.floor (@viewportW * $currentIndex) * (90/100)
        distance      = Math.floor ev.gesture.distance

        if ev.gesture.direction is "right"
          distance = distance * -1

        switch ev.gesture.direction
          when "right", "left"
            deltaDistance = pxVal + distance
            @inner.css('transform', "translateX(-#{deltaDistance}px)")
          when "up", "down"
           return false

      ).on("release dragend", (ev) =>
        ev.preventDefault()

        @inner.removeClass('no-transition').addClass('drag-transition')
        ## remove drag-transiton after transition completes
        setTimeout (=> @inner.removeClass 'drag-transition'), 600

        switch ev.gesture.direction
          when "right"
            ev.gesture.stopDetect()
            @slideNext("prev")
          when "left"
            ev.gesture.stopDetect()
            @slideNext("next")
      ).on('pinch', =>
        ev.preventDefault()
      )

  setupKeybindings: ->
    $(window).focus ->
      window_focus = true

    $(window).keydown (event) =>
      keyCode = event.keyCode or event.which
      arrow =
        left: 37
        up: 38
        right: 39
        down: 40
      switch keyCode
        when arrow.left
          @slideNext("prev")
        when arrow.right
          @slideNext("next")
        when arrow.down, arrow.up
          @toggleDrawer()
      mixpanel.track("Key Press")

  ## Setup event listener on resize and set global variable
  watchViewportWidth: ->
    @viewportW = @getViewportW()

    onResize = () =>
      @viewportW = @getViewportW()
      @setInnerWidth()
      @recalculatePos()
      @setBrowserHeight()

    ## Resize after user stops resizing
    $(window).bind "resize", ->
      timer and clearTimeout(timer)
      timer = setTimeout(onResize, 500)

  getViewportW: ->
    document.documentElement.clientWidth

  ## Fix panel positioning
  recalculatePos: ->
    $current = @container.find('.active')
    index    = @inner.find('section').index($current)
    pxVal    = Math.floor (@viewportW * index) * (90/100)
    @inner.css('transform', "translateX(-#{pxVal}px)")

  readHash: ->
    hashes = []
    hash = window.location.hash
    @inner.find('section').each (index, el) ->
      hashes.push("##{el.getAttribute('data-id')}")

    # Only slide is hash is in the DOM
    # console.log hash
    unless hashes.indexOf(hash) is -1
      @slideToTarget(hash) unless hash.length is 0

  changeHash: (target) ->
    id = target.attr('data-id')
    History.replaceState({state:1}, "#{id}", "##{id}") if id

    ## Report to Analytics
    _gaq.push ["_trackPageview", location.pathname + location.search + location.hash]
    mixpanel.track(id)

  setupSwipe: ->

$ ->
  new ConstructSlider()
