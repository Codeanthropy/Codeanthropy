var AppRouter = Backbone.Router.extend({

    routes: { // leto-marker-main-route-list
        ""                      : "home",
        "about"                 : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    // leto-marker-router-functions
    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

var templateFiles = [ // leto-marker-html-template-list
    'HomeView', 
    'HeaderView', 
    'AboutView',
];

utils.loadTemplate( templateFiles, function() {
    app = new AppRouter();
    Backbone.history.start();
});