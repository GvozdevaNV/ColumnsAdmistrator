(function (site) {

    "use strict";

    site.services.appliances = function () {
        var init = function () {
            site.amplify.request.define("getunits", "ajax", {
                url: "/api/appliances",
                dataType: "json",
                type: "GET",
                cache: false
            });
            site.amplify.request.define("putunits", "ajax", {
                url: "/api/appliances",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: "PUT",
                cache: false
            });
        },
            mapItem = function (data) {
                return new site.m.Appliance(data);
            },
            mapItems = function (data) {
                var mapped = [];
                site._.each(data, function (item) {
                    mapped.push(mapItem(item));
                });
                return mapped;
            },
            load = function (params, back) {
                if (typeof back !== "function") throw new Error("callback not a function");
                return site.amplify.request({
                    resourceId: "getunits",
                    data: { qp: ko.toJSON(params) },
                    success: function (json) {
                        params.total(json.Total);
                        back(new site.controls.ApiResult(json, mapItems));
                        return;
                    },
                    error: function () {
                        back(site.controls.ApiResult(null, "Ошибка получения журнала данных"));
                    }
                });
            },
            putData = function (params, back) {
                if (typeof back !== "function") throw new Error("callback not a function");
                return site.amplify.request({
                    resourceId: "putunits",
                    data: ko.toJSON(params),
                    success: function (json) {
                        back(new site.controls.ApiResult(json));
                        return;
                    },
                    error: function () {
                        back(site.controls.ApiResult(null, "Ошибка получения журнала данных"));
                    }
                });
            },
            delData = function (params, back) {
                if (typeof back !== "function") throw new Error("callback not a function");
                return site.amplify.request({
                    resourceId: "putunit",
                    data: { id: params.Id },
                    success: function (json) {
                        back(new site.controls.ApiResult(json));
                        return;
                    },
                    error: function () {
                        back(site.controls.ApiResult(null, "Ошибка получения журнала данных"));
                    }
                });
            };

        init();

        return {
            getData: load,
            delData: delData,
            putData: putData
        };
    }();

})(site);