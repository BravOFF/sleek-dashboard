/* ====== Index ======

1. SCROLLBAR SIDEBAR
2. BACKDROP
3. SIDEBAR MENU
4. SIDEBAR TOGGLE FOR MOBILE
5. SIDEBAR TOGGLE FOR VARIOUS SIDEBAR LAYOUT
6. TODO LIST
7. RIGHT SIDEBAR

====== End ======*/

$(document).ready(function () {
  "use strict";

  /*======== 1. SCROLLBAR SIDEBAR ========*/
  var sidebarScrollbar = $(".sidebar-scrollbar");
  if (sidebarScrollbar.length != 0) {
    sidebarScrollbar.slimScroll({
      opacity: 0,
      height: "100%",
      color: "#808080",
      size: "5px",
      touchScrollStep: 50
    })
      .mouseover(function () {
        $(this)
          .next(".slimScrollBar")
          .css("opacity", 0.5);
      });
  }

  /*======== 2. MOBILE OVERLAY ========*/
  if ($(window).width() < 768) {
    $(".sidebar-toggle").on("click", function () {
      $("body").css("overflow", "hidden");
      $('body').prepend('<div class="mobile-sticky-body-overlay"></div>')
    });

    $(document).on("click", '.mobile-sticky-body-overlay', function (e) {
      $(this).remove();
      $("#body").removeClass("sidebar-mobile-in").addClass("sidebar-mobile-out");
      $("body").css("overflow", "auto");
    });
  }

  /*======== 3. SIDEBAR MENU ========*/
  var sidebar = $(".sidebar")
  if (sidebar.length != 0) {
    $(".sidebar .nav > .has-sub > a").click(function () {
      $(this).parent().siblings().removeClass('expand')
      $(this).parent().toggleClass('expand')
    })

    $(".sidebar .nav > .has-sub .has-sub > a").click(function () {
      $(this).parent().toggleClass('expand')
    })
  }


  /*======== 4. SIDEBAR TOGGLE FOR MOBILE ========*/
  if ($(window).width() < 768) {
    $(document).on("click", ".sidebar-toggle", function (e) {
      e.preventDefault();
      var min = "sidebar-mobile-in",
        min_out = "sidebar-mobile-out",
        body = "#body";
      $(body).hasClass(min)
        ? $(body)
          .removeClass(min)
          .addClass(min_out)
        : $(body)
          .addClass(min)
          .removeClass(min_out)
    });
  }

  /*======== 5. SIDEBAR TOGGLE FOR VARIOUS SIDEBAR LAYOUT ========*/
  var body = $("#body");
  if ($(window).width() >= 768) {

    if (typeof window.isMinified === "undefined") {
      window.isMinified = false;
    }
    if (typeof window.isCollapsed === "undefined") {
      window.isCollapsed = false;
    }

    $("#sidebar-toggler").on("click", function () {
      if (
        body.hasClass("sidebar-fixed-offcanvas") ||
        body.hasClass("sidebar-static-offcanvas")
      ) {
        $(this)
          .addClass("sidebar-offcanvas-toggle")
          .removeClass("sidebar-toggle");
        if (window.isCollapsed === false) {
          body.addClass("sidebar-collapse");
          window.isCollapsed = true;
          window.isMinified = false;
        } else {
          body.removeClass("sidebar-collapse");
          body.addClass("sidebar-collapse-out");
          setTimeout(function () {
            body.removeClass("sidebar-collapse-out");
          }, 300);
          window.isCollapsed = false;
        }
      }

      if (
        body.hasClass("sidebar-fixed") ||
        body.hasClass("sidebar-static")
      ) {
        $(this)
          .addClass("sidebar-toggle")
          .removeClass("sidebar-offcanvas-toggle");
        if (window.isMinified === false) {
          body
            .removeClass("sidebar-collapse sidebar-minified-out")
            .addClass("sidebar-minified");
          window.isMinified = true;
          window.isCollapsed = false;
        } else {
          body.removeClass("sidebar-minified");
          body.addClass("sidebar-minified-out");
          window.isMinified = false;
        }
      }
    });
  }

  if ($(window).width() >= 768 && $(window).width() < 992) {
    if (
      body.hasClass("sidebar-fixed") ||
      body.hasClass("sidebar-static")
    ) {
      body
        .removeClass("sidebar-collapse sidebar-minified-out")
        .addClass("sidebar-minified");
      window.isMinified = true;
    }
  }

  /*======== 6. TODO LIST ========*/

  function todoCheckAll() {
    var mdis = document.querySelectorAll(".todo-single-item .mdi");
    mdis.forEach(function (fa) {
      fa.addEventListener("click", function (e) {
        e.stopPropagation();
        e.target.parentElement.classList.toggle("finished");
      });
    });
  }

  if (document.querySelector("#todo")) {
    var list = document.querySelector("#todo-list"),
      todoInput = document.querySelector("#todo-input"),
      todoInputForm = todoInput.querySelector("form"),
      item = todoInputForm.querySelector("input");

    document.querySelector("#add-task").addEventListener("click", function (e) {
      e.preventDefault();
      todoInput.classList.toggle("d-block");
      item.focus();
    });

    todoInputForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (item.value.length <= 0) {
        return;
      }
      list.innerHTML =
        '<div class="todo-single-item d-flex flex-row justify-content-between">' +
        '<i class="mdi"></i>' +
        '<span>' +
        item.value +
        '</span>' +
        '<span class="badge badge-primary">Today</span>' +
        '</div>' +
        list.innerHTML;
      item.value = "";
      //Close input field
      todoInput.classList.toggle("d-block");
      todoCheckAll();
    });

    todoCheckAll();
  }

  /*======== 7. RIGHT SIDEBAR ========*/

  var rightSidebarIn = 'right-sidebar-in';
  var rightSidebarOut = 'right-sidebar-out';

  $('.nav-right-sidebar .nav-link').on('click', function () {

    if (!body.hasClass(rightSidebarIn)) {
      body.addClass(rightSidebarIn).removeClass(rightSidebarOut);

    } else if ($(this).hasClass('show')) {
      body.addClass(rightSidebarOut).removeClass(rightSidebarIn);
    }
  });

  $('.card-right-sidebar .close').on('click', function () {
    body.removeClass(rightSidebarIn).addClass(rightSidebarOut);
  })

  if ($(window).width() <= 1024) {

    var togglerInClass = "right-sidebar-toggoler-in"
    var togglerOutClass = "right-sidebar-toggoler-out"

    body.addClass(togglerOutClass);

    $('.btn-right-sidebar-toggler').on('click', function () {
      if (body.hasClass(togglerOutClass)) {
        body.addClass(togglerInClass).removeClass(togglerOutClass)
      } else {
        body.addClass(togglerOutClass).removeClass(togglerInClass);
      }
    });
  }




});
