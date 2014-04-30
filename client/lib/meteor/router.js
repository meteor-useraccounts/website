Router.configure({
    notFoundTemplate: 'pageNotFound',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'home',
    });

    this.route('docs', {
        path: '/docs',
        template: 'docs',
    });

});

var scrolls = {};

var setActiveLinks = _.debounce(function() {
    $("ul.nav.navbar-nav li.active").removeClass('active');
    $("ul.nav.navbar-nav li a[href='" + location.pathname + "']").parent().addClass('active');
});

Router.onBeforeAction(function() {
    scrolls[this.path] = $(document).scrollTop();
    setActiveLinks();
});

Router.onAfterAction(function() {
    $(document).scrollTop(scrolls[this.path] || 0);
});

Template.layout.rendered = function() {
    setActiveLinks();
};