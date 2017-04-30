var fileModel = kendo.observable({
    processEnabled: false,
    processComplete: false,
    files: [],
    
    fileSelected: function (e) {
        var message = $.map(e.files, function (file) { return file.name; }).join(", ");
        console.log("event :: select (" + message + ")");
    },
    complete: function (e) {
        console.log(e);
        if (e.operation === "upload") {
            fileModel._uploadComplete(e);
        } else if (e.operation === "remove") {
            fileModel._removeComplete(e);
        }
    },
    _uploadComplete: function (e) {
        toastr.success("Upload Complete: " + fileModel.getFileInfo(e));
        fileModel.set("processEnabled", true);
        fileModel.ProcessFiles(e.files);
    },
    _removeComplete: function (e) {
        toastr.success("Delete Complete: " + fileModel.getFileInfo(e));
        fileModel.set("processEnabled", false);
        setTimeout(function () { }, 500);
    },
    _error: function (e) {
        toastr.error("We had a problem with " + fileModel.getFileInfo(e));
    },
    getFileInfo: function (e) {
        return $.map(e.files, function (file) {
            var info = file.name;

            // File size is not available in all browsers
            if (file.size > 0) {
                info += " (" + Math.ceil(file.size / 1024) + " KB)";
            }
            return info;
        }).join(", ");
    },
    ProcessFiles: function (files) {
        fileModel.set("processComplete", false);
        loader.show();
        fileModel._processFiles(files).done(function () {
            fileModel.set("processComplete", true);
            loader.hide();
        }).fail(function () {
            loader.hide();
        });
    },
    _processFiles: function (files) {
        var deferred = $.Deferred(),
            fileList = [];
        $(files).each(function (key, item) {
            fileList.push(item.name);
        });
        //var data = JSON.stringify(fileList);
        $.ajax({
            url: "Upload/BuildList",
            contentType: "application/json; charset=utf-8",
            type: 'Post',
            dataType: 'json',
            data: JSON.stringify({ 'files': fileList })
        }).done(function (result) {
            var f = [];
            $(result.data).each(function (key, item) {
                f.push(item.A);
            });
            deferred.resolve();
        }).fail(function (error) {
            toastr.error(error.statusText);
            deferred.reject();
        });
        return deferred.promise();
    }
});