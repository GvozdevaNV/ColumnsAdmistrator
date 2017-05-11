/// <reference path="site.core.js" />


(function(site) {

    site.services.Metadata = function() {
        var
            init = function() {
                site.amplify.request.define("getentityname", "ajax", {
                    url: "/admin/getmetadata",
                    dataType: "json",
                    type: "GET",
                    cache: false
                });
            },

            load = function(back) {
                return site.amplify.request({
                    resourceId: "getentityname",
                   
                    success: function(json) {
                        if (json) {
                            return back(json);
                        }
                    },
                    error: function() {
                        site.logger.error('Ошибка загрузки метаданных');
                    }
                });
            };

    init();

        return {
            load: load
        };
    }();

})(site);
