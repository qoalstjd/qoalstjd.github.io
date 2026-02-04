window.initModule = ({ root, params }) => {
    const swiperEl = root.querySelector(".swiper");
    if (!swiperEl) return;

    new Swiper(swiperEl, {
        effect: "fade",
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 8000, disableOnInteraction: false },
        pagination: { el: swiperEl.querySelector(".swiper-pagination"), clickable: true },
        speed: 1500,
    });
};