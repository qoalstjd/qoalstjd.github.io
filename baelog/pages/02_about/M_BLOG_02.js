window.initModule = ({ root, params }) => {
    console.log("M_BLOG_02.js Loaded");
    return () => {
        console.log("M_BLOG_02.js Destroyed");
    };
};
