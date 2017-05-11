
//------------------------------------------------------------
// Just a sample to start coding HTML5
// Author: Calabonga
// site: www.calabonga.net
//--------------------------------------------------------------

// base namespace
var site = site || {};

// config module
site.cfg = site.cfg || {};

// model's module 
site.m = site.m || {};

// viewmodel's module
site.vm = site.vm || {};

// services module
site.services = site.services || {};

// utilites module
site.utils = site.utils || {};

// controls module
site.controls = site.controls || {};

// start engine
var bootstrapper = function () {

    var root = this,
        initLibs = function () {
            // initialization for third-party libs
            site.amplify = root.amplify;
            site.$ = root.jQuery;
            site.logger = root.toastr;
            site._ = root._;
            site.infuser = root.infuser;
            site.moment = root.moment;
        },
        initGlobalization = function () {
            // globalize
            window.Globalize.culture('ru');
            moment.locale('ru');
            // подменяем парсинг чисел с плавающей точкой
            // потому что в Globalize.parseFloat существует бага,
            // так как "точка" (.) обрабатывается как часть числа
            // даже если она таковой не является.
            // Я исправил это так:

            window.Globalize.orgParaseFloat = window.Globalize.parseFloat;
            window.Globalize.parseFloat = function (value) {
                value = String(value);
                var culture = this.findClosestCulture();
                var seperatorFound = false;
                for (var i in culture.numberFormat) {
                    if (culture.numberFormat[i] == ".") {
                        seperatorFound = true; break;
                    }
                }
                if (!seperatorFound) { value = value.replace(".", "NaN"); }
                return this.orgParaseFloat(value);
            };
        },
        initValidations = function () {
            window.ko.validation.configure({
                registerExtenders: true,    //default is true
                messagesOnModified: true,   //default is true
                errorMessageClass: 'text-danger',
                insertMessages: true,       //default is true
                parseInputAttributes: true, //default is false
                writeInputAttributes: true, //default is false
                messageTemplate: null,      //default is null
                decorateElement: true       //default is false. Applies the validationElement CSS class
            });
            window.ko.validation.localize({
                required: 'Необходимо заполнить это поле.',
                min: 'Значение должно быть больше или равно {0}.',
                max: 'Значение должно быть меньше или равно {0}.',
                minLength: 'Длина поля должна быть не меньше {0} символов.',
                maxLength: 'Длина поля должна быть не больше {0} символов.',
                pattern: 'Пожалуйста проверьте это поле.',
                step: 'Значение поле должно изменяться с шагом {0}',
                email: 'Введите в поле правильный адрес email',
                date: 'Пожалуйста введите правильную дату',
                dateISO: 'Пожалуйста введите правильную дату в формате ISO',
                number: 'Поле должно содержать число',
                digit: 'Поле должно содержать цифры',
                phoneUS: 'Поле должно содержать правильный номер телефона',
                equal: 'Значения должны быть равны',
                notEqual: 'Пожалуйста выберите другое значение.',
                unique: 'Значение должно быть уникальным.'
            });
        },
        initConfig = function () {

            // settings for site
            site.cfg.throttle = 600;

            // pager 
            site.cfg.pageSize = 10;
            site.cfg.groupSize = 10;
            site.cfg.pageSizes = window.ko.observableArray([5, 10, 20, 30, 50, 100]);

            // indicator
            site.cfg.busyIndicatorImageName = '/images/loading.gif';
            site.cfg.busyIndicatorImageNameSmall = '/images/ms-loader.gif';
            
            // profile system
            site.cfg.profileUrl = '/api/userapi/getprofile';
            site.cfg.profileUrlCreate = '/api/userapi/postprofile';
            site.cfg.profileUrlUpdate = '/api/userapi/putperson';

        },
        initExternalTemplates = function () {
            // infuser 
            site.infuser.defaults.templatePrefix = "";
            site.infuser.defaults.templateSuffix = ".html";
            site.infuser.defaults.templateUrl = "/Scripts/_tmpls";
        },
        initThirdPartyControls = function () {
            site.logger.options.positionClass = "toast-bottom-left";
            site.logger.options.extendedTimeOut = 100;
            site.logger.options.fadeIn = 300;
            site.logger.options.fadeOut = 500;
            site.logger.options.timeOut = 2000;
            site.logger.options.extendedTimeOut = 100;
        },
        init = function () {
            initLibs();
            initGlobalization();
            initExternalTemplates();
            initConfig();
            initValidations();
            initThirdPartyControls();
        };

    return {
        run: init
    };

}();

bootstrapper.run();