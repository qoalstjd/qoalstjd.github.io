window.initModule = ({ root, params }) => {
    const { linkcd } = params;
    root.querySelector(`a[href*="${linkcd}"]`).closest('.box').style.display = 'none';
};