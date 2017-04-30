var navigation = kendo.observable({
    view: "",
    homeClicked: function (e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        router.navigate("home", true);
        navigation.loadHome();
    },

    loadHome: function () {
        $("#main-layout").empty();
        $.ajax({ url: '../../pages/home.html', cache: false })
            .done(function(template) {
                layout.showIn("#main-layout", new kendo.View(template));
                console.log("navigation.loadHome complete");
            });
    },

    createClicked: function (e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        router.navigate("create", true);
        navigation.loadCreate();
    },

    loadCreate: function () {
        //loaderModel.show();
        $.ajax({ url: '../../pages/create.html', cache: false })
            .done(function(template) {
                layout.showIn("#main-layout", new kendo.View(template, { model: audit.init(), evalTemplate: true }));
                console.log("navigation.loadCreate complete");
            });
    },
    adminClicked: function (e) {
        if (e !== undefined) {
            e.preventDefault();
        }
        router.navigate("home", true);
        navigation.loadHome();
    },

    loadAdmin: function () {
        $("#main-layout").empty();
        $.ajax({ url: '../../pages/home.html', cache: false })
            .done(function (template) {
                layout.showIn("#main-layout", new kendo.View(template));
                console.log("navigation.loadHome complete");
                window.loadSlider();
            });
    }
});