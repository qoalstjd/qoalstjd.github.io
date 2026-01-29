export function init({ root }) {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        effect: 'fade', // 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative'
        speed: 1000,
        autoplay: {
            delay: 8000,
            disableOnInteraction: true,
            pauseOnMouseEnter: false,
            stopOnLastSlide: false,
            waitForTransition: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}