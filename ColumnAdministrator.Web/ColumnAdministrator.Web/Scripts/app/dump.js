//#region dump

///////////////////////////////////////////////////////////////
//  Dump используется для отладки кода на UI
//  Расширение knockoutjs
//  автор: calabonga.net
//  зависит от:     knockout
///////////////////////////////////////////////////////////////

function toJSON(rootObject, replacer, spacer) {
    var cache = [];
    var plainJavaScriptObject = ko.toJS(rootObject);
    var replacerFunction = replacer || cycleReplacer;
    var output = ko.utils.stringifyJson(plainJavaScriptObject, replacerFunction, spacer || 2);

    cache = null;
    return output;

    function cycleReplacer(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value)!== -1) {
                return;
            }
            cache.push(value);
        }
    }

}

ko.bindingHandlers.dump = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var context = valueAccessor();
        var allBindings = allBindingsAccessor();
        var pre = document.createElement('pre');
        element.appendChild(pre);

        var dumpJson = ko.computed({
            read: function () {
                return ko.toJSON(context, null, 2);
            },
            write: function () {

            },
            disposeWhenNodeIsRemoved: element
        });

        ko.applyBindingsToNode(pre, { text: dumpJson }) ;
    }
};

//#endregion