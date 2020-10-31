(function(){var t;t=function(){function t(){this.transition="transitionend webkitTransitionEnd MSTransitionEnd",this.nav=document.getElementsByClassName("slider-nav")[0],this.drawer=document.getElementsByClassName("drawer")[0],this.container=document.getElementById("slider"),this.inner=document.getElementById("inner"),this.sections=this.inner.getElementsByTagName("section"),this.setInnerWidth(),this.setupArrows(),this.setupDrawerNav(),this.setupKeybindings(),this.setupSwipeEvents(),this.watchViewportWidth(),this.readHash()}return t.viewportW,t.prototype.setInnerWidth=function(){var t,e,n,i,r;for(r=null,n=this.sections,t=0,e=n.length;t<e;t++)i=n[t],r=r+i.offsetWidth+3;return this.inner.style.width=r+"px"},t.prototype.setupArrows=function(){var t;return t=this.inner.getElementsByClassName("nav-info")[0],t.classList.add("slide-up")},t.prototype.slideNext=function(t){var e,n,i,r,s,a,o,c,h;if(r=void 0,n=this.container.getElementsByClassName("active")[0],i=$(this.sections).index(n),"next"===t?(r=n.nextElementSibling,90*(i+1),a=this.viewportW*(i+1)*.9):(t="prev")&&(r=n.previousElementSibling,90*(i-1),a=this.viewportW*(i-1)*.9),this.changeHash(r),null!=r)return c=n.getElementsByClassName("frame")[0],h=0,o=400,e=$(n).scrollTop(),e>100&&(s=$(n).scrollTop(),c.classList.add("animate"),$(c).css("transform","translateY("+s+"px"),$(c).on(this.transition,function(){return c.classList.remove("animate"),$(c).off(this.transition)}),h=o+50),window.setTimeout(function(t){return function(){return $(t.inner).css("transform","translateX(-"+a+"px)"),n.classList.remove("active"),r.classList.add("active"),t.changeDrawerActive(),$(t.inner).on(t.transition,function(){return $(c).css("transform","translateX(0)"),$(n).scrollTop(0),$(t.inner).off(t.transition)})}}(this),h),this.hideDrawer()},t.prototype.setupDrawerNav=function(){return $(this.nav).on("click",function(t){return function(e){var n;return e.target.classList.contains("arrow")?(n=e.target.getAttribute("data-id"),t.slideNext(n),t.hideDrawer(),t.removeTransitionClass()):e.target.classList.contains("menu")?(t.toggleDrawer(),mixpanel.track("Menu Click")):void 0}}(this)),$(this.drawer).on("click",function(t){return function(e){var n;return n=e.target.getAttribute("href"),t.slideToTarget(n)}}(this))},t.prototype.slideToTarget=function(t){var e,n,i,r,s,a;if(t=t.replace("#",""),a=this.inner.querySelectorAll("[data-id='"+t+"']")[0],i=this.container.getElementsByClassName("active")[0],n=$(a).index(),e=$(i).index(),n!==e)return r=Math.abs(n-e),s=Math.floor(this.viewportW*n*.9),i.classList.remove("active"),a.classList.add("active"),this.inner.classList.add("transition-"+r),$(this.inner).css("transform","translateX(-"+s+"px)"),this.changeDrawerActive(),this.hideDrawer(),$(i).scrollTop(0),this.changeHash(a),this.removeTransitionClass()},t.prototype.toggleDrawer=function(t){return"close"===t||this.container.classList.contains("show-nav")?(this.container.classList.remove("show-nav"),this.container.classList.add("hide-nav"),this.drawer.classList.remove("show"),this.drawer.classList.add("hide"),this.nav.classList.remove("show"),this.nav.classList.add("hide")):(t="open")?(this.container.classList.remove("hide-nav"),this.container.classList.add("show-nav"),this.drawer.classList.remove("hide"),this.drawer.classList.add("show"),this.nav.classList.remove("hide"),this.nav.classList.add("show")):void 0},t.prototype.hideDrawer=function(){if(this.container.classList.contains("show-nav"))return $(this.inner).on(this.transition,function(t){return function(){return t.toggleDrawer("close"),t.removeTransitionClass(),$(t.inner).off(t.transition)}}(this))},t.prototype.changeDrawerActive=function(){var t;return t=$(this.container).find(".active").attr("class").split(" ")[0],this.drawer.getElementsByClassName("active")[0].classList.remove("active"),this.drawer.querySelector("a[href='#"+t+"']").parentElement.classList.add("active")},t.prototype.removeTransitionClass=function(){return $(this.inner).removeClass(function(t,e){return(e.match(/\btransition\S+/g)||[]).join(" ")})},t.prototype.setupSwipeEvents=function(){return $(this.inner).hammer({drag_min_distance:50,drag_lock_to_axis:!0,drag_block_horizontal:!0,drag_block_vertical:!0}).on("dragstart",function(t){return function(e){return e.preventDefault(),t.inner.classList.add("no-transition")}}(this)).on("drag",function(t){return function(e){var n,i,r,s;switch(e.preventDefault(),n=$(t.container).find(".active").index(),s=Math.floor(t.viewportW*n*.9),r=Math.floor(e.gesture.distance),"right"===e.gesture.direction&&(r*=-1),e.gesture.direction){case"right":case"left":return i=s+r,$(t.inner).css("transform","translateX(-"+i+"px)");case"up":case"down":return!1}}}(this)).on("dragend",function(t){return function(e){switch(e.preventDefault(),t.inner.classList.remove("no-transition"),t.inner.classList.add("drag-transition"),setTimeout(function(){return t.inner.classList.remove("drag-transition")},600),e.gesture.direction){case"right":return e.gesture.stopDetect(),t.slideNext("prev");case"left":return e.gesture.stopDetect(),t.slideNext("next")}}}(this)).on("pinch",function(t){return function(){return ev.preventDefault()}}())},t.prototype.setupKeybindings=function(){return $(window).focus(function(){return!0}),$(window).keydown(function(t){return function(e){var n,i;switch(i=e.keyCode||e.which,n={left:37,up:38,right:39,down:40},i){case n.left:t.slideNext("prev");break;case n.right:t.slideNext("next");break;case n.down:case n.up:t.toggleDrawer()}return mixpanel.track("Key Press")}}(this))},t.prototype.watchViewportWidth=function(){var t;return this.viewportW=this.getViewportW(),t=function(t){return function(){return t.viewportW=t.getViewportW(),t.setInnerWidth(),t.recalculatePos()}}(this),$(window).bind("resize",function(){var e;return e&&clearTimeout(e),e=setTimeout(t,500)})},t.prototype.getViewportW=function(){return document.documentElement.clientWidth},t.prototype.recalculatePos=function(){var t,e,n;return t=this.container.getElementsByClassName("active"),e=$(this.sections).index(t),n=Math.floor(this.viewportW*e*.9),$(this.inner).css("transform","translateX(-"+n+"px)")},t.prototype.readHash=function(){var t,e,n,i,r,s;for(e=[],t=window.location.hash,r=this.sections,n=0,i=r.length;n<i;n++)s=r[n],e.push("#"+s.getAttribute("data-id"));if(-1!==e.indexOf(t)&&0!==t.length)return this.slideToTarget(t)},t.prototype.changeHash=function(t){var e;return e=$(t).attr("data-id"),e&&History.replaceState({state:1},""+e,"#"+e),_gaq.push(["_trackPageview",location.pathname+location.search+location.hash]),mixpanel.track(e)},t}(),$(function(){return new t})}).call(this);