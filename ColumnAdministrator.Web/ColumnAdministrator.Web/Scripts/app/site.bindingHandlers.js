
(function (ko) {

    "use strict";

    //#region DataSource

    ///////////////////////////////////////////////////////////////
    //  Утилиты расширения knockoutjs
    //  bindingHandlers для отображения DataSource в таблице
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  site.controls
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.dataSource = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var
                container = document.createElement('div'),
                table = document.createElement('div'),
                ds = ko.utils.unwrapObservable(valueAccessor()),
                context = allBindingsAccessor().context,
                template = context.template;

            if (!ds)
                throw 'The dataSource is not found!';
            if (!template)
                throw 'The template for dataSource "' + ds.entityName + '" found!';

            ko.applyBindingsToNode(container, { blockUI: ds.indicator });
            ko.applyBindingsToNode(table, { template: { name: template, data: ds } });
            container.appendChild(table);
            $(element).replaceWith(container);
        }
    };

    //#endregion


    //#region DbLookUp

    ///////////////////////////////////////////////////////////////
    //  Утилиты расширения knockoutjs
    //  bindingHandlers для отображения поля подстановки
    //  контрол Selector (DbLookUp)
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  site.controls
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.dblookup = {
        init: function (element, valueAccessor, allBindingAccessor) {
            var observable = valueAccessor(),
                selectedItem = ko.observable(), selectedText = ko.observable(), selectedValue = ko.observable(),
                uniqueId = guid(), modalId = '#' + uniqueId, modal_body = 'modal-body', bindingModel,
                lookups = allBindingAccessor().lookups || {},
                selectionChanged = lookups.selectionChanged || null,
                propertyText = lookups.propertyText || null,
                propertyValue = lookups.propertyValue || null,
                defaultDataSourceTemplate = ' <div class="badge pull-right"><i class="icon-list icon-white"></i><span data-bind="text: queryParams.total"></span></div>\
                                                <table class="table table-bordered">\
                                                <thead>\
                                                    <tr>\
                                                        <th>Наименование</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody data-bind="foreach: items">\
                                                    <tr data-bind="css: { \'info\': selected }, style: { \'cursor\': \'pointer\' }, click: $parent.select">\
                                                        <td data-bind="text: '+ propertyText + '"></td>\
                                                    </tr>\
                                                </tbody>\
                                            </table>',
                defaultFieldTemplate = '<div class="input-append">\
                                                <!-- ko ifnot: model -->\
                                                <input type="text" placeholder="не выбрано" class="uneditable-input" readonly/>\
                                                <!-- /ko -->\
                                                <!-- ko if: model -->\
                                                <!-- ko with: model -->\
                                                <input type="text" class="uneditable-input" data-bind="value: selectedText, attr: {title: title}" readonly />\
                                                <!-- /ko -->\
                                                <!-- /ko -->\
                                                <button type="button" class="btn btn-info" data-bind="enable: dataSource.hasItems(), click: openSelector" title="выбрать из списка">...</button></div>\
                                                <span class="add-on" data-bind="visible: dataSource.indicator.isbusy"><img data-bind="attr: { src: site.cfg.busyIndicatorImageNameSmall }" /></span>',
                fieldTemplate = lookups.fieldTemplate ? window.infuser.getSync(lookups.fieldTemplate) : defaultFieldTemplate,
                onSelected = lookups.onSelected || function () { },
                defaultModalTemplate = lookups.modalTemplate && window.infuser.getSync(lookups.modalTemplate),
                modalWindowTemplate = defaultModalTemplate || '<div id="' + uniqueId + '" class="modal hide fade" data-modal-overflow="true">\
                                    <div class="modal-header">\
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                                        <h3 data-bind="text: title"></h3>\
                                    </div>\
                                    <div class="modal-body"></div>\
                                    <div class="modal-footer">\
                                        <button class="btn" data-dismiss="modal" aria-hidden="true" data-bind="enable: isSelected, click: clear">сброс</button>\
                                        <button class="btn btn-primary" data-bind="enable: canSelect, click: select">выбрать</button>\
                                        <button class="btn" data-dismiss="modal" aria-hidden="true">закрыть</button>\
                                    </div>\
                                </div>',
                dataSourceTemplate = lookups.dsTemplate ? window.infuser.getSync(lookups.dsTemplate) : defaultDataSourceTemplate,
                dataSource = lookups.dataSource,
                previewElement = document.createElement('div'),
                openSelectorHandler = function () {
                    var tableContainer = document.createElement('div');
                    var modalbody = $(modalId + '> div.modal-body')[0];
                    ko.renderTemplate(dataSourceTemplate, dataSource, { templateEngine: stringTemplateEngine }, tableContainer, null);
                    $(modalbody).html(tableContainer);
                    $(modalId).modal({ keyboard: false, backdrop: 'static' });
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        var el = $(modalId)[0];
                        ko.removeNode(el);
                    });
                },
                model = {
                    title: 'Сделай правильный выбор:',
                    canSelect: ko.computed(function () { return dataSource && dataSource.currentItem(); }),
                    isSelected: ko.computed(function () { return selectedItem && selectedItem(); }),
                    select: function () {
                        var json = ko.toJS(dataSource.currentItem());
                        selectedValue(json[propertyValue]);
                        selectedText(json[propertyText]);
                        selectedItem(json);
                        observable(json[propertyValue]);
                        if (onSelected) onSelected({ selectedText: selectedText, selectedValue: selectedValue });
                        dataSource.resetSelectedItem();
                        $(modalId).modal('hide');
                    },
                    clear: function () {
                        unbindValues();
                        $(modalId).modal('hide');
                    },
                    cancel: null
                },
                title = ko.computed(function () {
                    if (selectedText() && selectedValue()) {
                        return selectedText() + ' (ID:' + selectedValue() + ')'
                    }
                    return '';
                }),
                bindValues = function (item) {
                    var json = ko.toJS(item);
                    selectedValue(json[propertyValue]);
                    selectedText(json[propertyText]);
                    selectedItem(item);
                    selectedText.subscribe(function (value) {
                        if (value === '') {
                            unbindValues();
                        }
                    });
                    if (selectionChanged) {
                        selectionChanged(item);
                    }
                },
                unbindValues = function () {
                    selectedValue(undefined);
                    selectedItem(undefined);
                    observable(undefined);
                    if (selectionChanged) {
                        selectionChanged(null);
                    }
                },
                isPropertyDefined = function () {
                    if (propertyText && propertyValue) {
                        return true;
                    };
                    return false;
                },
                setSelectedById = function (id) {
                    if (id) {
                        var item = dataSource.selectById(observable());
                        bindValues(item);
                    } else {
                        selectedText('');
                    }
                };

            if (!dataSource) throw 'dataSource not found!';
            if (!dataSourceTemplate) throw 'dsTemplate not found!';
            if (!fieldTemplate) throw 'fieldTemplate not found!';

            dataSource.resetSelectedItem();

            var div = document.createElement('div');
            ko.renderTemplate(modalWindowTemplate, model, { templateEngine: stringTemplateEngine }, div, null);
            $('body').after(div);
            if (isPropertyDefined()) {
                if (observable && ko.isObservable(observable)) {
                    if (observable()) {
                        $.when(dataSource.getDataById(observable()))
                            .done(function (json) {
                                if (json) {
                                    bindValues(json);
                                }
                            })
                            .fail(function (json) {
                                site.logger.error('Не могу получить значение по идентификатору');
                            });
                    }

                    observable.subscribe(function (id) {
                        if (id) { setSelectedById(id); }
                        else selectedText('');
                    });
                }
                ko.renderTemplate(fieldTemplate, { model: { selectedText: selectedText, selectedValue: selectedValue, title: title }, openSelector: openSelectorHandler, dataSource: dataSource, selectedItem: selectedItem }, { templateEngine: stringTemplateEngine }, previewElement, null);
            } else { site.logger.error('propertyText and propertyValue are not defined!'); }
            $(element).replaceWith(previewElement);
        }
    };

    //#endregion

    //#region RadioBox Button

    ///////////////////////////////////////////////////////////////
    //  Утилиты и расширения для knockoutjs
    //  bindingHandlers для отображения RadioButton (bootstrap)
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  bootstrap
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.radio = {
        init: function (element, valueAccessor, allBindings, data, context) {
            var $buttons, $element, elementBindings = allBindings(), observable;
            observable = valueAccessor();
            if (!ko.isWriteableObservable(observable)) {
                throw "You must pass an observable or writeable computed";
            }
            $element = $(element);
            if ($element.hasClass("btn")) {
                $buttons = $element;
            } else {
                $buttons = $(".btn", $element);
            };
            $buttons.each(function () {
                var $btn, btn, radioValue;
                btn = this;
                $btn = $(btn);
                radioValue = elementBindings.radioValue || $btn.attr("data-value") || $btn.attr("value") || $btn.text();
                $btn.on("click", function () {
                    observable(ko.utils.unwrapObservable(radioValue));
                });
                return ko.computed({
                    disposeWhenNodeIsRemoved: btn,
                    read: function () {
                        $btn.toggleClass("active", observable() === ko.utils.unwrapObservable(radioValue));
                    }
                });
            });
        }
    };

    //#endregion

    //#region CheckBox Button

    ///////////////////////////////////////////////////////////////
    //  Утилиты и расширения для knockoutjs
    //  bindingHandlers для отображения Checkbox (bootstrap)
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  bootstrap
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.checkbox = {
        init: function (element, valueAccessor, allBindings, data, context) {
            var $element, observable;
            observable = valueAccessor();
            if (!ko.isWriteableObservable(observable)) {
                throw "You must pass an observable or writeable computed";
            }
            $element = $(element);
            $element.on("click", function () {
                observable(!observable());
            });
            ko.computed({
                disposeWhenNodeIsRemoved: element,
                read: function () {
                    $element.toggleClass("active", observable());
                }
            });
        }
    };

    //#endregion

    //#region hidden

    ///////////////////////////////////////////////////////////////
    //  Утилиты расширения knockoutjs
    //  bindingHandlers для сокрытия объекта 
    //  на основании противосостояния
    //  автор: calabonga.net
    //  зависит от:     knockout
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.bindingHandlers.visible.update(element, function () { return !value; });
        }
    };

    //#endregion

    //#region  ckeditor

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для редактирования HTML-кода
    //  автор: calabonga.net & Шлёнов Дмитрий
    //  зависит от:     knockout
    //                  moment
    //                  blockUI
    ///////////////////////////////////////////////////////////////
    ko.bindingHandlers.ckeditor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var
                ckOptions = {
                    uiColor: '#577AB5',
                    height: 400,
                    extraPlugins: 'onchange'
                },
                value = valueAccessor(),
                allBindings = ko.utils.unwrapObservable(allBindingsAccessor()),
                options = ko.utils.extend(allBindings.options || ckOptions);
            if (!value) {
                value = ko.observable();
            }

            var editor = CKEDITOR.replace(element, options);
            var editorName = editor.name;
            $(element).attr("data-customname", editorName);
            editor.on('change', function (e) {
                var data = editor.getData();
                if (data) {
                    if (ko.isWriteableObservable(value)) {
                        value(data);
                    } else {
                        value = data;
                    }
                }
            });

            editor.on('blur', function () {
                var self = this;
                if (ko.isWriteableObservable(self)) {
                    var data = editor.getData();
                    if (data) {
                        value(data);
                    }
                }
            }, value, element);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                var editorName = $(element).attr("data-customname");
                var editor = CKEDITOR.instances[editorName];
                editor.destroy(true);
            });
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).html(value);
        }
    };

    //#endregion

    //#region  editableText

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для редактирования единочного поля 
    //  конкретной сущности
    //  параметр: action - delegate получаеющий как параметр редактируемый
    //  объект с обовленным свойством
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  moment
    //                  blockUI
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.editableText = {
        init: function (element, valueAccessor, allBindingAccessor) {
            var observable = valueAccessor(),
                span = document.createElement("span"),
                input = document.createElement("input"),
                otherOptions = allBindingAccessor().params || {},
                action = allBindingAccessor().action;

            var data = ko.dataFor(element);
            data.options = otherOptions;
            element.appendChild(span);
            element.appendChild(input);
            input.onblur = function () {
                if (action) action.call(this, data);
                $(span).show();
            };
            observable.editing = ko.observable(false);
            ko.applyBindingsToNode(span, {
                text: observable,
                visible: !ko.utils.unwrapObservable(observable.editing),
                click: function () {
                    observable.editing(true);
                    $(span).hide();
                }
            });
            ko.applyBindingsToNode(input, {
                value: observable,
                visible: observable.editing,
                hasfocus: observable.editing
            });
        }
    };

    //#endregion

    //#region  blockUI

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для блокировки DIV
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  moment
    //                  blockUI
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.blockUI = {
        init: function (element, valueAccessor) {
            var value = valueAccessor(),
                ctrl = ko.utils.unwrapObservable(value);
            $(element).css('position', 'relative');
            $(element).css('min-height', '70px');
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                var el = $("#block" + ctrl.uniqueId)[0];
                if (el) ko.removeNode(el);
            });
        },
        update: function (element, valueAccessor, allBindingAccessor) {
            var value = valueAccessor(),
                ctrl = ko.utils.unwrapObservable(value);
            var el;
            if (ctrl.isbusy()) {
                if (ctrl && ctrl.template) {
                    var block = ctrl.template(element);
                    $(element).append(block);
                }
            } else {
                el = $("#block" + ctrl.uniqueId)[0];
                if (el) ko.removeNode(el);
            }
        }
    };

    //#endregion

    //#region progressbar

    ko.bindingHandlers.progressbar = {
        init: function (element, valueAccessor) {
            var options = valueAccessor() || {};
            $(element).progressbar(options);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).progressbar("destroy");
            });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).progressbar("value", parseInt(value.value));
        }
    };

    //#endregion

    //#region jqDialog

    ko.bindingHandlers.jqDialog = {
        init: function (element, valueAccessor) {
            var model = ko.utils.unwrapObservable(valueAccessor()),
                options = ko.utils.extend(model.options || {}, ko.bindingHandlers.jqDialog.defaultOptions);

            //initialize the dialog
            $(element).dialog(options);

            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).dialog("destroy");
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).dialog(ko.utils.unwrapObservable(value.open) ? "open" : "close");

            if (value.title) {
                var title = value.title();
                if (title) {
                    $(element).dialog("option", "title", title);
                }
            }
            //handle positioning
            if (value.position) {
                var target = value.position();
                if (target) {
                    var pos = $(target).position();
                    $(element).dialog("option", "position", [pos.left + $(target).width(), pos.top + $(target).height()]);
                }
            }
        },
        defaultOptions: {
            options: {
                buttons: {}
            },
            autoOpen: false,
            resizable: false,
            modal: true
        }
    };

    //#endregion

    //#region jqDialogContext

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для модального окна
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  moment
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.jqDialogContext = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // alert("initing");
            var model = ko.utils.unwrapObservable(valueAccessor()),
                options = ko.utils.extend(model.options || {}, ko.bindingHandlers.jqDialogContext.defaultContextOptions);

            if (!options.isInitialized) {
                //setup our buttons
                options.buttons = {
                    "Готово": model.accept.bind(viewModel, viewModel),
                    "Отмена": model.cancel.bind(viewModel, viewModel)
                };
                options.closeOnEscape = false;

                //handle disposal
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).dialog("destroy");
                });
                $(element).append("<span>\\текст/</span>");

                //initialize the dialog
                $(element).dialog(options);

                options.isInitialized = true;

            }
            return {
                "controlsDescendantBindings": true
            };
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var openState = ko.utils.unwrapObservable(value.open);

            $(element).dialog(openState ? "open" : "close");

            if (openState && !value.isOpenNow) {
                value.isOpenNow = true;
                if (value.title) {
                    var title = value.title();
                    if (title) {
                        $(element).dialog("option", "title", title);
                    }
                }

                if (value.width) {
                    var width = value.width();
                    if (width) {
                        $(element).dialog("option", "width", width);
                    }
                }

                if (value.height) {
                    var height = value.height();
                    if (height) {
                        $(element).dialog("option", "height", height);
                    }
                }

                $(element).dialog("option", "position", "center");

                if (value.context() !== undefined) {
                    var context = value.context();
                    if (context) {
                        ko.editable(context);
                        context.beginEdit();

                        var divv = document.createElement("DIV");
                        ko.renderTemplate(value.options.contextTemplate /*ko.bindingHandlers.jqDialogContext.defaultContextOptions.contextTemplate*/, context, {
                            templateEngine: stringTemplateEngine
                        }, divv, null);
                        $(element).html(divv);
                    }
                }
            }
        },
        defaultContextOptions: {
            autoOpen: false,
            resizable: false,
            modal: true//,
            //contextTemplate: '<div data-bind="html: PeriodEndFullName"></div><p>propverka</p>'
        }
    };

    //#endregion

    //#region date

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для DateTime
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  moment
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.date = {
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);
            if (valueUnwrapped) {
                var t = moment(valueUnwrapped).format("DD.MM.YYYY");
                $(element).text(t);
            }
        }
    };

    //#endregion

    //#region pager

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для Pager (control)
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  bridge.controls
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.pager = {
        init: function (element, valueAccessor) {
            var value = valueAccessor(),
                ds = ko.utils.unwrapObservable(value),
                template = "<ul data-bind='foreach: pages, visible: hasPages' class=\"pagination\">\
                                    <li data-bind='css: css'>\
                                        <a href=\"#\" data-bind='text: name, click: $parent.getData'></a>\
                                    </li>\
                                </ul>";
            element.setAttribute('class', 'pagination');
            ko.renderTemplate(template, ds, { templateEngine: stringTemplateEngine }, element, null);
            return { controlsDescendantBindings: true };
        }
    };

    //#endregion

    //#region progress

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для отображения процесса загрузки
    //  IsBusy progress
    //  автор: calabonga.net
    //  зависит от:     knockout
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.progress = {
        update: function (element, valueAccessor) {
            var value = valueAccessor(),
                isReady = ko.utils.unwrapObservable(value);
            if (isReady) {
                $.blockUI({
                    fadeIn: 500,
                    message: "<p>Ждите...<img src='/content/images/loader.gif'  alt=''/></p>",
                    overlayCSS: { backgroundColor: '#0a6698', opacity: .7 }
                });
            } else {
                $.unblockUI();
            }
        }
    };

    //#endregion

    //#region fadeInText

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers для затухания текста 
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  jQuery
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.fadeInText = {
        update: function (element, valueAccessor) {
            $(element).hide();
            ko.bindingHandlers.text.update(element, valueAccessor);
            $(element).fadeIn();
        }
    };


    //#endregion

    //#region flash

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers вспышка текста 
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  jQuery
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.flash = {
        update: function (element, valueAccessor) {
            ko.utils.unwrapObservable(valueAccessor()); //unwrap to get subscription
            $(element).hide().fadeIn(500);
        }
    };

    //#endregion

    //#region jqButton

    ///////////////////////////////////////////////////////////////
    //  Утилиты
    //  Расширение knockoutjs
    //  bindingHandlers кнопка jQuery
    //  автор: calabonga.net
    //  зависит от:     knockout
    //                  jQuery
    ///////////////////////////////////////////////////////////////

    ko.bindingHandlers.jqButton = {
        init: function (element, valueAccessor) {
            var options = valueAccessor() || {};
            $(element).button(options);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).button("destroy");
            });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).button("option", "disabled", value.enable === false);
        }
    };

    //#endregion

    //#region Unilites
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

})(ko);