export function init({ root }) {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        effect: 'fade', // 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative'

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}