// Write your Javascript code.
var layout, router;

$(function () {
    layout = new kendo.Layout("layout-template");
    layout.render("#main");
    router = new kendo.Router({
        routeMissing: function (e) {
            console.log('route missing for: ' + e.url);
        }
    });
    //router.route("admin", function () {
    //    navigation.loadAdmin();
    //});
    router.route("editListing", function () {
        alert("Edit Audit");
    });
    router.route("home", function () {
        navigation.loadHome();
    });
    router.route("/", function () {
        navigation.loadHome();
    });

    router.start();
});