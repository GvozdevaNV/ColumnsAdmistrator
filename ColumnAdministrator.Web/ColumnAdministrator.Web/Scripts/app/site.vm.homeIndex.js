$(function () {
    site.vm.customersPage = function () {
        var clock = new site.controls.Clock(),
            dataSource = new site.controls.DataSource({
                service: site.services.appliances,
                template: 'appliance.table'
            }),
            deleteCommand = ko.asyncCommand({
                execute: function (complete) {
                    if (confirm('Вы действительно хотите удалить эту запись?')) {
                        site.logger.info('Извините, данная функция не реализована.');
                    }
                    complete();
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && dataSource.currentItem;
                }
            }),
            editCommand = ko.asyncCommand({
                execute: function (complete) {
                    //site.logger.info('Извините, данная функция не реализована.');
                    var item = dataSource.currentItem();
                    var edit = ko.validatedObservable(item);
                    formEdit.formContext.model(edit);
                    formEdit.open(complete);
                },
                canExecute: function (isExecuting) {
                    return !isExecuting && dataSource.currentItem;
                }
            }),
            addCommand = ko.asyncCommand({
                execute: function (complete) {
                    site.logger.info('Извините, данная функция не реализована.');

                    complete();
                },
                canExecute: function (isExecuting) {
                    return !isExecuting;
                }
            }),

                formEdit = new site.controls.FormEdit({
                    title: "Редактирование записи",
                    templateUrl: "appliance.edit",
                    templateBuilder: new site.controls.TemplateBuilder({
                        //fields: [
                        //    { template: 'string', fieldName: 'Name', label: 'Наименование' },
                        //    { template: 'datetime', fieldName: 'CreateDate', label: 'Дата' },
                        //    { template: 'string', fieldName: 'Price', label: 'Цена' }
                        //]
                        templateUrlName: 'appliance.edit'
                    }),
                    events: {
                        onClosed: function (complete) {
                            if (complete) { complete(); }
                        },
                        onOpened: function () {

                        }
                    },
                    onSave: function (item) {
                        dataSource.putData(item, function (result) {
                            if (result) {
                                formEdit.close();
                                site.logger.success('Успешно обновлено');
                            }
                        });
                    },
                    onCancel: function (json) {

                        site.logger.info('Изменения документа отменены!');
                    }
                });

        return {
            addCommand: addCommand,
            editCommand: editCommand,
            deleteCommand: deleteCommand,
            ds: dataSource,
            clock: clock
        }
    }();

    ko.applyBindings(site.vm.customersPage);
});