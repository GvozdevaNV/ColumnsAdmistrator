(function (site) {

    //#region model Person

    "use strict";

    site.m.Appliance = function (dto) {
        var me = this, data = dto || {};
        me.Id = ko.observable(data.Id);
        me.CreateDate = ko.observable(data.CreateDate).extend({ required: true, date: true });
        me.Price = ko.observable(data.Price).extend({ required: true });
        me.Name = ko.observable(data.Name).extend({ required: true });
        me.IsInStock = ko.observable(data.IsInStock);
        me.Description = ko.observable(data.Description);
        me.Attachment = ko.observable(data.Attachment);

        me.selected = ko.observable(false);

        me.dirtyFlag = new ko.DirtyFlag([
            me.Id,
            me.Name,
            me.CreateDate,
            me.Price,
            me.Description,
            me.IsInStock,
            me.Attachment
        ]);

        return me;
    };

    //#endregion

})(site);