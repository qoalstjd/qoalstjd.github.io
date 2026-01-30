export function init({ root }) {
    const swiper = new Swiper(".swiper", {
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 8000,
            disableOnInteraction: false,
        },
        speed: 1500,
    });
}
