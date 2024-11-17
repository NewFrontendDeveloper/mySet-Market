"use strict";

new Swiper(".cSlider__content", {
  slidesPerView: 5,
  spaceBetween: 10,
  centerSlide: "true",
  fade: "true",
  freeMode: "true",
  grabCursor: "true",
  pagination: {
    el: ".swiper-pagination",
    clickable: "true"
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    0: {
      slidesPerView: 2
    },
    768: {
      slidesPerView: 3
    },
    992: {
      slidesPerView: 4
    },
    1200: {
      slidesPerView: 5
    }
  }
});