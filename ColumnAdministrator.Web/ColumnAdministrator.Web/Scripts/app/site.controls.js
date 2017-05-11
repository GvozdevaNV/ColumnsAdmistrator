/// <reference path="site.core.js" />
/// <reference path="site.services.js" />

(function (site, ko) {

    "use strict";

    //#region TemplateBuilder

    site.controls.TemplateBuilder = function (options) {
        var ctrl = this;
        ctrl.controlTemplates =
        [
                    {
                        name: 'uploads', template: '<div class="checkbox">\
                                                    <label>{{LABEL}}</label>\
                                                        <input type="file" data-bind="value: {{FIELD}}" />\
                                                </div>'
                    },
                     {
                         name: 'bool', template: '<div class="checkbox">\
                                                    <label>\
                                                        <input type="checkbox" data-bind="checked: {{FIELD}}" /> {{LABEL}}\
                                                    </label>\
                                                </div>' },
                    {
                        name: 'string',
                        template: '<label>{{LABEL}}</label>\
                                                            <div class="form-group">\
                                                                <input type="text" data-bind="value: {{FIELD}}, valueUpdate:\'afterkeydown\'" class="form-control" />\
                                                            </div>'
                    },
                    {
                        name: 'multistring', template: '<label>{{LABEL}}</label>\
                                                            <div class="form-group">\
                                                                <textarea type="text" data-bind="value: {{FIELD}}, valueUpdate:\'afterkeydown\'" class="form-control" ></textarea>\
                                                            </div>'
                    },
                    { name: 'double', template: '' },
                    {
                        name: 'datetime', template: '<label>{{LABEL}}</label>\
                                                <div class="form-group">\
                                                    <input class="form-control" type="text" data-bind="datepicker: {{FIELD}}, valueUpdate: \'afterkeydown\'" />\
                                                </div>' },
                    { name: 'int', template: '' },
                    { name: 'binary', template: '' },
        ],
        ctrl.settings = {
            getTemplate: function () {

                site.services.Metadata.load(function (json) {
                    if (json) {
                        var fields = json, result = '<div data-bind="with: model">';
                        for (var i = 0; i < json.length; i++) {
                            var templateItem = site._.find(ctrl.controlTemplates, function (item) {
                                return item.name == fields[i].template;
                            });
                            if (templateItem) {
                                result = result + templateItem.template.replace(/{{LABEL}}/gi, fields[i].label).replace(/{{FIELD}}/gi, fields[i].fieldName);
                            }
                        }
                        result = result + '</div>';
                        $("<script/>", {
                            "type": "text/html",
                            "id": options.templateUrlName,
                            "text": result
                        }).appendTo("body");
                    }
                });


            }
        }
        $.extend(true, ctrl.settings, options);

        ctrl.getTemplate = function () {
            return ctrl.settings.getTemplate;
        };
        if (!options.fields) {
            ctrl.getTemplate()();
        }
        return {
            getTemplate: ctrl.getTemplate()
        }
    }

    //#endregion

    //#region FormEdit

    ///////////////////////////////////////////////////////////////
    //  FormEdit
    //  Контрол для редактирования класса сущности в форме
    //  с валидацией (validation) и проверкой на внесенные 
    //  изменения(changeTracking)
    //  автор: calabonga.net
    //  Требуется для работы всех ViewModels
    //  зависит от:     knockout.js
    //                  site.controls
    ///////////////////////////////////////////////////////////////

    site.controls.FormEdit = function (options) {
        var ctrl = this, completeEventHandler;
        ctrl.formContext = {};
        ctrl.formContext.model = ko.observable();
        ctrl.uniqueId = guid();
        ctrl.settings = {
            title: "Редактирование",
            templateUrl: null,
            templateBuilder: null,
            events: {
                onClosed: null,
                onOpened: null
            },
            onSave: null,
            onCancel: null,
            preloadedTemplates: null
        };
        $.extend(true, ctrl.settings, options);
        ctrl.title = ctrl.settings.title;

        ctrl.open = function (complete) {
            if (complete)
                completeEventHandler = complete;
            site.utils.OpenModalWindow(ctrl, { keyboard: false, backdrop: 'static' }, completeEventHandler);
        };
        ctrl.close = function () {
            if (ctrl) {
                var f = $("#b" + ctrl.uniqueId);
                if (f) {
                    if (ctrl.settings.events.onClosed) {
                        ctrl.settings.events.onClosed(completeEventHandler);
                    }
                }
                if (ctrl.canSave())
                    if (ctrl.formContext.model && ctrl.formContext.model()) {
                        ctrl.formContext.model()().dirtyFlag().reset();
                    }
                f.modal('hide').on('hidden.bs.modal', function () {
                    f.remove();
                });
            }
        };
        ctrl.save = function () {
            if (ctrl.settings.onSave) {
                ctrl.settings.onSave(ko.utils.unwrapObservable(ctrl.formContext.model()));
            }
            //ctrl.close();
        };

        ctrl.canSave = ko.computed(function () {
            if (ctrl.formContext.model && ctrl.formContext.model()) {
                var dirty = ctrl.formContext.model()().dirtyFlag().isDirty();
                var valid = ctrl.formContext.model().isValid();
                return dirty && valid;
            }
            return false;
        });

        ctrl.cancel = function () {
            if (ctrl.canSave()) {
                if (confirm("Выйти из редактирования, не сохраненные данные буду утеряны?")) {
                    if (ctrl.formContext.model()().dirtyFlag().isDirty())
                        ctrl.formContext.model()().dirtyFlag().reset();
                    var item = ko.utils.unwrapObservable(ctrl.formContext.model());
                    if (ctrl.settings.onCancel) {
                        ctrl.settings.onCancel(item);
                    }
                } else {
                    return false;
                }
            } else {
                if (ctrl.settings.onCancel) {
                    ctrl.settings.onCancel();
                }
            }
            ctrl.close();
        };

        //#region templates

        //#region bootstrap 2.3.2
        ctrl.formTemplate2 = '<div id="b' + ctrl.uniqueId + '" class="modal fade">\
                                <div class="modal-dialog modal-lg">\
                                    <div class="modal-content">\
                                      <div id="h' + ctrl.uniqueId + '" class="modal-header">\
                                        <button type="button" class="close" data-bind="click: cancel" >&times;</button>\
                                        <h4 class="modal-title" data-bind="text: title"></h4>\
                                      </div>\
                                      <div id="c' + ctrl.uniqueId + '" class="modal-body"></div>\
                                      <div id="f' + ctrl.uniqueId + '" class="modal-footer">\
                                        <span data-bind="visible: formContext.model()().dirtyFlag().isDirty()" title=\"есть несохраненные данные\"><i class=\"glyphicon glyphicon-certificate text-danger\"></i></span>\
                                        <button type="button" class="btn btn-primary" data-bind="enable: canSave, click: save" >сохранить</button>\
                                        <button type="button" class="btn btn-default" data-bind="click: cancel" >отмена</button>\
                                      </div>\
                                  </div>\
                                </div>\
                            </div>';
        //#endregion
        //#endregion


        ctrl.formTemplate = ctrl.formTemplate2;

        return {
            onOpened: ctrl.settings.events.onOpened,
            formContext: ctrl.formContext,
            title: ctrl.settings.title,
            isHidden: ctrl.isHidden,
            template: ctrl.template,
            uniqueId: ctrl.uniqueId,
            getBody: ctrl.getBody,
            model: ctrl.formContext.model,
            close: ctrl.close,
            open: ctrl.open
        };
    };

    //#endregion

    //#region TemplateLoader

    ///////////////////////////////////////////////////////////////
    //  Загрузчик шаблонов
    //  Утилиты расширения knockoutjs bindingHandlers
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  infuser
    //                  site.controls
    ///////////////////////////////////////////////////////////////

    site.controls.TemplateLoader = function (options) {
        var ctrl = this;
        ctrl.settings = { templateUrl: null };
        $.extend(true, ctrl.settings, options);
        ctrl.templateLoader = function (templateId) {
            var template = document.getElementById(templateId);
            if (template == null) {
                var url = getUrl(templateId);
                return $.ajax({
                    url: url,
                    async: false,
                    dataType: 'html',
                    type: 'GET',
                    timeout: 3000,
                    success: function (response) {
                        $("<script/>", {
                            "type": "text/html",
                            "id": templateId,
                            "text": response
                        }).appendTo("body")
                    },
                    error: function (exception) {
                        site.logger.error(exception.status);
                    }.bind(this)
                });
            }
            return;
        };
        ctrl.templatesLoader = function (templates) {
            for (var key in templates) {
                ctrl.templateLoader(templates[key]);
            }
        }
        function getUrl(templateId) {
            return site.infuser.defaults.templateUrl + '/' + site.infuser.defaults.templatePrefix + templateId + site.infuser.defaults.templateSuffix;
        }
        function checkTemplatesLoaded(control) {
            if (!control.settings.templateBuilder) {
                if (control.settings && control.settings.preloadedTemplates) {
                    site.controls.TemplateLoader().loadAll(control.settings.preloadedTemplates);
                } else {
                    if (control.settings && control.settings.templateUrl) {
                        site.controls.TemplateLoader().load(control.settings.templateUrl);
                    }
                }
            }
        }
        return {
            checkTemplatesLoaded: checkTemplatesLoaded,
            loadAll: ctrl.templatesLoader,
            load: ctrl.templateLoader,
            template: ctrl.template
        };
    };

    //#endregion

    //#region ModalWindow

    site.utils.ModalWindow = function (title, templateUrl, model, context) {
        /// <summary>Объект для формирования и вызова модального окна</summary>
        /// <param name="title" type="Object">заголовок модального окна</param>
        /// <param name="templateUrl" type="Object">шаблон для отображения контекста</param>
        /// <param name="model" type="Object">модель для привязки</param>
        /// <param name="context" type="Object">контекст содержимого модального окна</param>
        var w = this;
        w.uniqueId = guid();
        w.settings = {
            title: title,
            events: { onClosed: null },
            templateUrl: templateUrl
        };
        w.formContext = context || {},
        w.formContext.model = model,
        w.formTemplate = null,
        w.preloadedTemplates = null
    };

    //#endregion ModalWindow

    //#region OpenModalWindow 

    ///////////////////////////////////////////////////////////////
    //  Открыватель модального окна по шаблону с контекстом
    //  Утилиты расширения knockoutjs bindingHandlers
    //  автор: calabonga.net
    //  зависит от:     site.controls.TemplateLoader()
    ///////////////////////////////////////////////////////////////

    site.utils.OpenModalWindow = function (control, options, completeEventHandler, deffered) {
        /// <summary>
        /// Открывает модальное окно контрола, который должен иметь предопределенные параметры и шаблоны.
        /// Interface: 
        ///     control.settings.templateUrl - Url для загрузки шаблона из файла
        ///     control.formContext - Контент контрола для рендеринга
        ///     control.formTemplate - шаблон формы модального окна
        ///     control.uniqueId - уникальный идентификатор контрола
        ///     control.settings.events - объект событий контрола
        ///     control.title - заголовок модального окна
        /// </summary>
        /// <param name="control" type="Object">экэемпляр контрола</param>
        /// <param name="options" type="Object">опции открытия окна, например, keboard: true, backdrop: 'static' </param>
        /// <param name="completeEventHandler" type="Object">триггер, который должен 'выстрелить' при закрытии окна</param>
        if (ko.isObservable(control.title) && !control.title()) {
            control.title('Без названия');
        } else if (!control.title) {
            control.title = 'Без названия';
        }
        //if (control.settings && !control.title) control.title = 'Без названия';
        site.controls.TemplateLoader().checkTemplatesLoaded(control);
        var modalBody = document.createElement('div');
        if (control.settings && control.settings.templateBuilder && control.formContext) {
            ko.renderTemplate(control.settings.templateUrl, control.formContext, {}, modalBody, null);
        } else if (control.settings && control.settings.templateUrl && control.formContext) {
            ko.renderTemplate(control.settings.templateUrl, control.formContext, {}, modalBody, null);
        } else {
            $(modalBody).html("<h1 style=\"color:red\">Error</h1><p style=\"color:red; font-weight: bold;\">control.settings.templateUrl and control.formContext are not found!</p>");
        }
        var modal = document.createElement('div');
        $('body').append(modal);
        if (!control.formTemplate) {
            control.formTemplate = '<div id="b' + control.uniqueId + '" class="modal fade">\
                                        <div class="modal-dialog modal-lg">\
                                            <div class="modal-content">\
                                                <div id="h' + control.uniqueId + '" class="modal-header">\
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                                                    <h3 data-bind="text: settings.title"></h3>\
                                                </div>\
                                                <div id="c' + control.uniqueId + '" class="modal-body"></div>\
                                            </div>\
                                        </div>\
                                    </div>'




        }
        if (control.formTemplate && control) {
            ko.renderTemplate(control.formTemplate, control, { templateEngine: stringTemplateEngine }, modal, 'replaceNode');
        }
        if (control.html)
            control.html = modalBody.innerHTML;
        $('#c' + control.uniqueId).html(modalBody);
        $('#b' + control.uniqueId).modal(options);
        //$('#b' + control.uniqueId).modal(options).on('hidden.bs.modal', function () {
        //	if (control.settings.events.onClosed)
        //		control.settings.events.onClosed();
        //	if (completeEventHandler)
        //		completeEventHandler();
        //	if (deffered) {
        //		deffered.resolve();
        //	}
        //	$(this).remove();
        //});
        if (control.settings.events.onOpened)
            control.settings.events.onOpened(control.formContext);
    }
    //#endregion OpenModalWindow 

    //#region Utilites

    function exploreEntityProperties(list, propertyNames) {
        var result = null;
        for (var i = 0; i <= propertyNames.length - 1; i++) {
            list = pluckEntity(list, propertyNames[i]);
        }
        return list;
    }
    function pluckEntity(items, propertyName) {
        return site._.pluck(items, propertyName);
    }
    function guid() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    var stringTemplate = function (key, template) {
        if (arguments.length === 1) {
            this.template = key;
        } else {
            this.templateName = key;
            this.template = template;
        }
    };
    stringTemplate.prototype.text = function () {
        return this.template;
    };
    var stringTemplateEngine = new ko.nativeTemplateEngine();
    stringTemplateEngine.makeTemplateSource = function (templateName) {
        return new stringTemplate(templateName);
    };
    //#endregion

    //#region ApiResult

    ///////////////////////////////////////////////////////////////
    //  ApiResult
    //  bindingHandlers для обработки результатов ответа
    //  на запрос к Web API
    //  автор: calabonga.net
    //  зависит от:     knockout.js
    ///////////////////////////////////////////////////////////////

    site.controls.ApiResult = function (json, mapper) {
        var options = { timeOut: 0, extendedTimeOut: 0 };
        if (json === null) {
            site.logger.error(mapper, 'Ошибка сервиса', options);
            return;
        }
        var me = {};
        if (json.Success) {
            //site.logger.success(json.Success); //слишком много ОК!
            if (mapper)
                me.Item = new mapper(json.Item || json.Items);
            else
                me.Item = json.Item || json.Items;
            if (!json.Item) site.logger.success(json.Success);
        }
        if (json.Info) {
            site.logger.info(json.Info);
        }
        if (json.Warning) {
            //me.Item = [];
            site.logger.warning(json.Warning, 'Внимание', { timeOut: 7000, extendedTimeOut: 1000 });
        }
        if (json.Error) {
            site.logger.error(json.Error, 'Ошибка', options);
        }
        return me;
    };

    //#endregion 

    //#region Metadata

    ///////////////////////////////////////////////////////////////
    //  Metadata
    //  метадата (используются для определения настроек и 
    //  содеражния страницы (представления). Это вспомогательная
    //  сущность
    //  автор: calabonga.net
    //  зависит от:     knockout.js
    ///////////////////////////////////////////////////////////////

    site.controls.Metadata = function (title, description, helplink) {
        var metatitle = ko.observable(title),
            metadescription = ko.observable(description),
            metahelplink = ko.observable(helplink);
        function setTitle() { document.title = metatitle(); }
        metatitle.subscribe(function () { setTitle(); }); setTitle();
        return {
            title: metatitle,
            description: metadescription,
            helplink: metahelplink
        };
    };

    //#endregion

    //#region Clock

    ///////////////////////////////////////////////////////////////
    //  Clock
    //  часы (используются в основном, для проверки, что скрипт загружен)
    //  автор: calabonga.net
    //  Требуется для работы всех ViewModels
    //  зависит от:     knockout.js
    ///////////////////////////////////////////////////////////////

    site.controls.Clock = function () {
        var clock = ko.observable(),
            v1 = ko.observable(),
            v2 = ko.observable(),
            v3 = ko.observable(),
            getTime = function () {
                var ct = new Date();
                v1(ct.getHours());
                v2(c(ct.getMinutes()));
                v3(c(ct.getSeconds()));
                clock(v1() + ":" + v2() + ":" + v3());
            },
            c = function (i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

        setInterval(function () { getTime(); }, 500);

        return {
            time: clock
        };
    };

    //#endregion

    //#region BusyIndicator

    ///////////////////////////////////////////////////////////////
    //  BusyIndicator
    //  Индикатор работы запроса
    //  автор: calabonga.net
    //  Требуется для работы ViewModels
    //  зависит от:     knockout.js
    ///////////////////////////////////////////////////////////////

    site.controls.BusyIndicator = function () {
        var ctrl = this;
        ctrl.uniqueId = guid();
        ctrl.isbusy = ko.observable(false);
        ctrl.imageName = site.cfg.busyIndicatorImageName || '/images/ms-loader.gif';
        ctrl.modalCss = '<style type="text/css">' +
            '.modalBusy {' +
            'position:absolute;' +
            'z-index:9998;' +
            'margin-left:0;' +
            'top:0;' +
            'left:0;' +
            'height:100%;' +
            'width:100%;' +
            'background:rgba(200,200,200,.5)url("' + ctrl.imageName + '") 50% 50% no-repeat;}' +
            '</style>';
        ctrl.ctrlTemplate = function () {
            var modalDiv = '<div id="block' + ctrl.uniqueId + '" ' + 'class="modalBusy">&nbsp;</div>';

            return modalDiv;
        };
        ctrl.show = function () { ctrl.isbusy(true); };
        ctrl.hide = function () { ctrl.isbusy(false); };
        ctrl.init = function () {
            if (!window.hasModelBlocker) {
                $("head").append(ctrl.modalCss);
                window.hasModelBlocker = true;
            }
            return;
        }();

        return {
            template: ctrl.ctrlTemplate,
            imageName: ctrl.imageName,
            uniqueId: ctrl.uniqueId,
            isbusy: ctrl.isbusy,
            show: ctrl.show,
            hide: ctrl.hide
        };
    };

    //#endregion 

    //#region QueryParams

    site.controls.QueryParams = function (options) {

        var settings = {
            index: 0,
            size: site.cfg.pageSize,
            groupSize: site.cfg.groupSize,
            total: 0
        };

        ko.utils.extend(settings, options);

        return {
            total: ko.observable(settings.total),
            index: ko.observable(settings.index),
            size: ko.observable(settings.size),
            groupSize: ko.observable(settings.groupSize)
        };
    };

    //#endregion

    //#region DataSource

    ///////////////////////////////////////////////////////////////
    //  Выбиратор контрола DataSource
    //  Утилиты расширения knockoutjs bindingHandlers
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  site.controls
    ///////////////////////////////////////////////////////////////

    site.controls.DataSource = function (options, queryParams, aggr) {
        var prop, isObservable = false, srcVal = undefined, hasPages = ko.observable(false), hasItems = ko.observable(false),
            dataItems = ko.observableArray([]), pagesItems = ko.observableArray([]), summary = ko.observable(),
            item = null,
            currentItem = ko.observable(),
            selectedItems = ko.observableArray([]),
            isSelectedItemChanged = false,
            isSelectMethodFired = false,
            aggregate = aggr || {},
            indicator = new site.controls.BusyIndicator(),
            settings = {
                service: null,
                items: null,
                entityName: 'entityName',
                autoLoad: true,
                optionsCaption: null,
                multipleSelect: false,
                pager: {
                    prev: { text: "«", css: "" },
                    current: { css: "active" },
                    next: { text: "»", css: "" }
                },
                events: {
                    selectedHandler: null,
                    getCompleteHandler: null,
                    postCompleteHandler: null,
                    putCompleteHandler: null,
                    deleteCompleteHandler: null
                },
                aggregations: null,
                propertyValue: null,
                propertyText: null,
                propertyChildren: null
            },
            generate = function () {
                var currentIndex = defaultParams.index() ? defaultParams.index() : 0,
                    pages = [],
                    totalItems = defaultParams.total(),
                    totalPages, currentGroup,
                    totalGroups,
                    pageSize = defaultParams.size() ? defaultParams.size() : 10,
                    groupSize = defaultParams.groupSize() ? defaultParams.groupSize() : 10;
                pagesItems([]);
                if (totalItems > 0) {
                    totalPages = Math.ceil(totalItems / pageSize);
                    totalGroups = Math.ceil(totalPages / groupSize);
                    currentGroup = Math.floor(currentIndex / groupSize);
                    var minPage = currentGroup * groupSize, maxPage = minPage + groupSize;
                    if (maxPage > totalPages) {
                        maxPage = totalPages;
                    }
                    if (minPage > 0) {
                        pages.push(new pagerItem(0, 1, settings.pager.prev.css));
                    }
                    if (currentGroup > 0) {
                        pages.push(new pagerItem(minPage - 1, settings.pager.prev.text, settings.pager.prev.css));
                    }
                    for (var i = minPage; i < maxPage; i++) {
                        var css = currentIndex === i ? settings.pager.current.css : "";
                        pages.push(new pagerItem(i, (i + 1), css));
                    }
                    if (currentGroup < totalGroups - 1) {
                        pages.push(new pagerItem(maxPage, settings.pager.next.text, settings.pager.next.css));
                    }
                    if (currentGroup !== totalGroups - 1) {
                        pages.push(new pagerItem(totalPages - 1, totalPages, settings.pager.next.css));
                    }
                    if (pages.length > 0) {
                        pagesItems(pages);
                    }
                    hasPages(totalPages > 1);
                } else {
                    hasPages(false);
                }
            },
            contains = function (item) {
                if (!settings.propertyText || !settings.propertyValue) {
                    throw new Error('The properties "PropertyText" and/or "PropertyValue" are not defined!"');
                }
                var isContain;
                if (dataItems().length > 0) {
                    isContain = site._.find(dataItems(), function (o) {
                        if (!ko.isObservable(o[settings.propertyText]))
                            return o[settings.propertyText] === item[settings.propertyText]
                                   && o[settings.propertyValue] === item[settings.propertyValue];
                        else {
                            return o[settings.propertyText]() === item[settings.propertyText]()
                                   && o[settings.propertyValue]() === item[settings.propertyValue];
                        }
                    });
                }
                return isContain;
            },
            checkService = function () {
                if (!settings.service)
                    throw new Error(settings.entityName + " DataSource: service instance not found for " + settings.entityName);
                return;
            },

        //#region getData
            getData = function (i) {
                var def = $.Deferred();
                hasPages(false);
                //hasItems(false);
                if (i && typeof i === "object") {
                    if (i.number) {
                        defaultParams.index(i.number);
                    } else {
                        defaultParams.index(0);
                    }
                }
                indicator.isbusy(true);
                checkService();
                settings.service.getData(defaultParams, function (json, a) {
                    if (a)
                        aggregate = a;
                    if (json && json.Item) {
                        if (settings.optionsCaption) {
                            json.unshift(settings.optionsCaption);
                        }
                        if (settings.aggregations) {
                            var items = ko.toJS(json.Item);
                            updateAggregate(items);
                        }
                        dataItems(json.Item);
                        //hasItems(true);
                        generate();
                        unselect();
                        if (settings.events.getCompleteHandler)
                            settings.events.getCompleteHandler();
                        def.resolve();
                    } else {
                        if (settings.aggregations) {
                            resetAggregate(0);
                        }
                        def.reject();
                    }
                    summary(settings.aggregations);
                    indicator.isbusy(false);
                }, aggregate);
                return def.promise();
            },
        //#endregion

        //#region postData & append
            postData = function (json, complete) {
                indicator.isbusy(true);
                settings.service.postData(json, postDataComplete.bind(complete), aggregate);
            },
            postDataComplete = function (json, a) {
                if (a)
                    aggregate = a;
                if (json && json.Item) {
                    dataItems.push(json.Item);
                    var t = defaultParams.total();
                    defaultParams.total(t + 1);
                    select(json.Item);
                }
                ;
                indicator.isbusy(false);
                var complete = this;
                if (site._.isFunction(complete)) {
                    if (json && json.Item)
                        complete(json.Item);
                    else
                        complete(null);
                }
                if (settings.events.postCompleteHandler) {
                    settings.events.postCompleteHandler(json);
                }
            },
            append = function (json) {
                dataItems.unshift(json);
            },
        //#endregion

        //#region putData
            putData = function (json, complete) {
                indicator.isbusy(true);
                settings.service.putData(json, putDataComplete.bind(complete), aggregate);
            },
            putDataComplete = function (json, a) {
                if (a)
                    aggregate = a;
                indicator.isbusy(false);
                var complete = this;
                if (site._.isFunction(complete)) {
                    if (json && json.Item) {
                        complete(json.Item);
                    } else
                        complete();
                }
                if (settings.events.putCompleteHandler) {
                    settings.events.putCompleteHandler(json.Item);
                }
            },
        //#endregion

        //#region delData & remove
            delData = function (complete) {
                indicator.isbusy(true);
                settings.service.delData(ko.toJS(currentItem()), delDataComplete.bind(complete), aggregate);
            },
            delDataComplete = function (json, a) {
                if (a)
                    aggregate = a;
                if (json && json.Item) {
                    dataItems.remove(currentItem());
                    unselect();
                }
                var t = defaultParams.total();
                defaultParams.total(t - 1);
                indicator.isbusy(false);
                var complete = this;
                if (site._.isFunction(complete)) {
                    complete();
                }
                if (settings.events.deleteCompleteHandler) {
                    settings.events.deleteCompleteHandler(json.Item);
                }
            },
            remove = function (obj) {
                if (obj)
                    dataItems.remove(obj);
                else if (currentItem())
                    dataItems.remove(currentItem());
                unselect();
            },
        //#endregion

        //#region select & unselect
            select = function (json) {
                if (isSelectedItemChanged || !isSelectMethodFired) {
                    if (json) {
                        if (!settings.multipleSelect) {
                            if (item != json) {
                                unselect();
                                json.selected(true);
                                item = json;
                                isSelectedItemChanged = false;
                                currentItem(json);
                                isSelectedItemChanged = true;
                                if (settings.events.selectedHandler) {
                                    settings.events.selectedHandler(json);
                                }
                            }
                            isSelectMethodFired = true;
                        } else {
                            if (json.selected()) {
                                json.selected(false);
                                selectedItems.pop(json);
                            } else {
                                json.selected(true);
                                selectedItems.push(json);
                            }
                        }
                    }
                }
            },
            unselect = function () {
                ko.utils.arrayForEach(dataItems(), function (it) {
                    it.selected(false);
                    if (it[settings.propertyChildren]) {
                        it.unselect(it[settings.propertyChildren]);
                    }
                });
                item = null;
                currentItem(null);
            },
        //#endregion

        //#region getDataById

            getDataById = function (id, callback) {
                if (!id)
                    throw new Error(settings.entityName + ': Method "getDataById" need a parameter "id"', 0);
                //return $.Deferred(function (def) {
                indicator.isbusy(true);
                checkService();
                if (id !== 'number') {
                    id = parseInt(id);
                }
                settings.service.getDataById(id, function (json) {
                    if (json && json.Item) {
                        if (callback) callback(json.Item);
                        //def.resolve(json.Item);
                    } else {
                        if (callback) callback(null);
                    }
                    indicator.isbusy(false);
                });
                //}).promise();
            },

        //#endregion

        //#region getById
            items = [],
            checkChildren = function (items, key) {
                site._.each(items, function (item) {
                    check(item, key);
                });
            },

            check = function (it, key) {
                items.push(it);
                if (it[settings.propertyChildren] && it[settings.propertyChildren].length) {
                    return checkChildren(it[settings.propertyChildren], key);
                }
            },

            selectById = function (key) {
                var result = null, founded = false;
                if (!settings.propertyValue || !settings.propertyText)
                    throw 'DataSource: propertyValue and propertyText not found for entity name "' + settings.entityName + '"';
                if (settings.propertyChildren) { // if hierarhical items
                    var result = null;
                    checkChildren(dataItems(), key);
                    result = site._.find(items, function (it) {
                        return it[settings.propertyValue] == key;
                    })
                    return result;
                } else {
                    return site._.find(dataItems(), function (item) { // Вопрос!!!
                        var property = ko.isObservable(item[settings.propertyValue]) ? item[settings.propertyValue]() : item[settings.propertyValue];
                        if (!property)
                            throw new Error('The property "' + settings.propertyValue + '" not found!', 404);
                        return property === key;
                    });
                }
            },
        //#endregion

        //#region remove currentItem

            removeCurrent = function () {
                var index = site._.indexOf(dataItems(), currentItem(), false);
                if (index > -1) {
                    var tmp = dataItems()[index];
                    currentItem(null);
                    dataItems.remove(tmp);
                }
            },

        //#endregion

        //#region reload currentItem

            reload = function (id) {
                indicator.isbusy(true);
                settings.service.getDataById(id, reloadComplete, aggregate);
            },
            reloadComplete = function (json) {
                indicator.isbusy(false);
                if (json && json.Item) {
                    var index = site._.indexOf(dataItems(), currentItem(), false);
                    var tmp = dataItems()[index];
                    if (tmp)
                        tmp.selected(false);
                    currentItem(json.Item);
                    json.Item.selected(true);
                    dataItems.replace(tmp, json.Item);
                }
            },

        //#endregion

        //#region clear

            clear = function () {
                dataItems([]);
                pagesItems([]);
                hasPages(false);
                //hasItems(false);
                defaultParams.index(0);
            },

        //#endregion

        //#region resetSelectedItems
            resetSelectedItems = function () {
                if (settings.multipleSelect) {
                    selectedItems([]);
                    unselect();
                }
            },
        //#endregion

            pagerItem = function (number, name, css) {
                ///<summary>
                /// Элемент пейджера (страницв)
                /// number , name, css
                ///</summary>
                return {
                    number: number,
                    name: name,
                    css: css
                };
            },

            defaultParams = site.controls.QueryParams();

        //#region extend properties and check
        $.extend(true, settings, options);

        for (prop in queryParams) {
            if (!queryParams.hasOwnProperty(prop)) {
                continue;
            }
            if (ko.isWriteableObservable(queryParams[prop])) {
                isObservable = true;
                srcVal = queryParams[prop]();
            } else if (typeof (queryParams[prop]) !== 'function') {
                srcVal = queryParams[prop];
            }
            if (ko.isWriteableObservable(defaultParams[prop])) {
                defaultParams[prop](srcVal);
            } else if (defaultParams[prop] === null || defaultParams[prop] === undefined) {
                defaultParams[prop] = isObservable ? ko.observable(srcVal) : srcVal;
            } else if (typeof (defaultParams[prop]) !== 'function') {
                defaultParams[prop] = srcVal;
            }
            isObservable = false;
        }

        //#endregion

        //#region private functions
        function updateAggregate(list) {
            for (var j = 0; j < settings.aggregations.length; j++) {
                for (var p in settings.aggregations[j]) {
                    var prop = p.indexOf('.') === -1 ? p : p.split('.'),
                        hasDot = site._.isArray(prop),
                        itemsToCount = null, value = 0,
                        d = settings.aggregations[j][p];
                    if (hasDot) {
                        itemsToCount = exploreEntityProperties(list, prop);
                        value = site._.reduce(itemsToCount, function (meno, item) {
                            return meno += Globalize.parseFloat(item);
                        }, 0);
                    } else {
                        value = site._.reduce(list, function (meno, item) {
                            return meno += Globalize.parseFloat(item[prop]);
                        }, 0);
                    }
                    settings.aggregations[j][p] = (value);
                }
            }
        }
        function resetAggregate(value) {
            for (var j = 0; j < settings.aggregations.length; j++) {
                for (var p in settings.aggregations[j]) {
                    settings.aggregations[j][p] = value;
                }
            }
        }
        //#endregion

        //#region autoLoad || items is set
        if (settings.service && settings.autoLoad) {
            getData();
        }
        if (!settings.service && settings.items) {
            dataItems(settings.items);
        }
        //#endregion

        defaultParams.size.subscribe(function (size) {
            defaultParams.size(size);
            defaultParams.index(0);
            getData(0);
        });
        dataItems.subscribe(function (value) {
            if (value.length > 0) {
                hasItems(true);
            } else
                hasItems(false);
        })

        return {
            propertyChildren: settings.propertyChildren,
            multipleSelect: settings.multipleSelect,
            resetSelectedItems: resetSelectedItems,
            propertyValue: settings.propertyValue,
            propertyText: settings.propertyText,
            entityName: settings.entityName,
            removeCurrent: removeCurrent,
            selectedItems: selectedItems,
            resetSelectedItem: unselect,
            queryParams: defaultParams,
            execute: settings.service,
            currentItem: currentItem,
            getDataById: getDataById,
            events: settings.events,
            selectById: selectById,
            aggregations: summary,
            indicator: indicator,
            hasPages: hasPages,
            hasItems: hasItems,
            postData: postData,
            contains: contains,
            pages: pagesItems,
            items: dataItems,
            getData: getData,
            putData: putData,
            delData: delData,
            select: select,
            remove: remove,
            append: append,
            reload: reload,
            clear: clear
        };
    };

    //#endregion 

    //#region Pager
    ///////////////////////////////////////////////////////////////
    //  Pager
    //  пейджер для коллекций
    //  автор: calabonga.net
    //  Требуется для работы всех ViewModels
    //  зависит от:     knockout.js
    ///////////////////////////////////////////////////////////////

    site.controls.Pager = function (ds, options) {
        var settings = {
            prev: { text: "<<", css: "prev" },
            current: { css: "active" },
            next: { text: ">>", css: "next" }
        };

        ko.utils.extend(settings, options);

        var
            isEnabled = ko.observable(false),
            pagerItem = function (number, name, css) {
                return {
                    number: number,
                    name: name,
                    css: css
                };
            },
            pagesItems = ko.observableArray([]),
            select = function () {
                ds.load(this.number);
            },
            generate = function () {
                var currentIndex = ds.queryParams.index(), pages = [], totalItems = ds.queryParams.total(), totalPages, currentGroup, totalGroups, pageSize = ds.queryParams.size(), groupSize = ds.queryParams.groupSize();
                pagesItems([]);
                if (totalItems > 0) {
                    totalPages = Math.ceil(totalItems / pageSize);
                    totalGroups = Math.ceil(totalPages / groupSize);
                    currentGroup = Math.floor(currentIndex / groupSize);
                    var minPage = currentGroup * groupSize, maxPage = minPage + groupSize;
                    if (maxPage > totalPages) {
                        maxPage = totalPages;
                    }
                    if (currentGroup > 0) {
                        pages.push(new pagerItem(minPage - 1, settings.prev.text, settings.prev.css));
                    }
                    for (var i = minPage; i < maxPage; i++) {
                        var css = currentIndex == i ? settings.current.css : "";
                        pages.push(new pagerItem(i, (i + 1), css));
                    }
                    if (currentGroup < totalGroups - 1) {
                        pages.push(new pagerItem(maxPage, settings.next.text, settings.next.css));
                    }
                    if (pages.length > 0) {
                        pagesItems(pages);
                    }
                    isEnabled(totalPages > 1);
                }
            };

        ds.queryParams.total.subscribe(function () {
            generate();
        });
        ds.queryParams.index.subscribe(function () {
            generate();
        });
        return {
            isEnabled: isEnabled,
            pages: pagesItems,
            select: select
        };
    };

    //#endregion 

})(site, ko);