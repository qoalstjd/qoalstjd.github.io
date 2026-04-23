window.initModule = ({ root, params }) => {
    common?.postDetail.init(root);
    return () => common?.postDetail.unbindScroll();
};
