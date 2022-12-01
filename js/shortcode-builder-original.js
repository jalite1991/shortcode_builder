(function ($, Drupal) {

    'use strict';

    // Builder Id
    var builder = $('textarea.textarea-builder');

    // URL Pathname
    var pathname = location.pathname.split("/");
    var entityIdPath = '/' + pathname[1] + '/' + pathname[2];

    // Set Global variables
    var pageData = []; // Contains the current page structure
    var data_storage = []; // Contains every element's shortcode attributes. Elements are defined as Sections, Rows, Columns, or Modules.
    var data_key = 1; // An incremented value to be used as data_storage's key

    //
    var editIcon = '<i class="fa fa-pencil-square-o"></i>';
    var addIcon = '<i class="fa fa-plus"></i>';
    var copyIcon = '<i class="fa fa-files-o"></i>';
    var deleteIcon = '<i class="fa fa-trash-o"></i>';

    /**
     * Command to Slide Down page elements before removing them.
     *
     * @param {Drupal.Ajax} [ajax]
     * @param {object} response
     * @param {string} response.selector
     * @param {string} response.duration
     * @param {object} [response.settings]
     * @param {number} [status]
     */
    Drupal.AjaxCommands.prototype.addBuilderElement = function(ajax, response, status) {
        var element = {};

        console.log(ajax);
        console.log(response);

        var storageKey = $('body').data('storagekey');

        console.log(data_key);
        console.log(storageKey);

        var options = {
            storage_value: data_key,
            type: "closed",
        };

        var attrs = {
            hash: response.id,
        };

        if ( response.type == 'container' ) {

            options.tag = "bfb_container";
            options.parent = 0;

            var container = new SC_element( options, attrs );

            data_storage[data_key] = container;

            var clicked_id = 'container-' + storageKey;

            if (storageKey != 0) {
                createContainer(clicked_id, container, 'after');
            } else {
                createContainer('.builder', container);
                $('#temp-container').remove();
            }


            // Create columns
            var columnSize = 12 / parseInt(response.plugin_type);

            for (var i = 0; i < parseInt(response.plugin_type); i++) {
                data_key++;

                var column_id = "outercolumn-" + data_key;
                var container_id = "container-" + options.storage_value;
                var colOptions = {
                    storage_value: data_key,
                    type: "closed",
                    tag: "bfb_outer_column",
                    parent: options.storage_value,
                };
                var colAttrs = {
                    hash: response.id+'-num-'+i,
                    type: columnSize,
                };

                var column = new SC_element( colOptions, colAttrs );

                data_storage[data_key] = column;

                createOuterColumn(container_id, column_id, column);
            }


        } else if ( response.type == 'row' ) {

            options.tag = "bfb_row";
            options.parent = storageKey;

            var row = new SC_element( options, attrs );

            data_storage[data_key] = row;

            var clicked_id = 'outercolumn-' + storageKey;
            var row_id = 'row-' + data_key;


            createRow(clicked_id, row_id, row);

            // Create columns
            var columnSize = 12 / parseInt(response.plugin_type);

            for (var i = 0; i < parseInt(response.plugin_type); i++) {
                data_key++;

                var column_id = "column-" + data_key;
                var row_id = "row-" + options.storage_value;
                var colOptions = {
                    storage_value: data_key,
                    type: "closed",
                    tag: "bfb_column",
                    parent: options.storage_value,
                };
                var colAttrs = {
                    hash: response.id+'-num-'+i,
                    type: columnSize,
                };

                var column = new SC_element( colOptions, colAttrs );

                data_storage[data_key] = column;

                createColumn(row_id, column_id, column);
            }

        } else if ( response.type == 'widget' ) {

            options.tag = 'bfb_module';
            options.parent = storageKey;

            attrs.type = response.plugin_type;

            var element = new SC_element( options, attrs );

            data_storage[data_key] = element;


            var column_id = "column-" + storageKey;
            var module_id = "module-" + data_key;

            createModule(column_id, module_id, element);
        }


        data_key++;
        makeSortable();
        rebuildSortcode();
        console.log('data_storage');
        console.log(data_storage);
    }

    /**/
    Drupal.behaviors.ShortcodeBuilder = {
        attach: function (context, settings) {

            console.log(context);


            if (context == document) {
                /** Create Builder */
                var text = builder.val();
                pageData = getPageData(text);


                console.log(pageData);
                console.log(data_storage);

                createPageBuilder();

                makeSortable();




                if (pageData.length <= 0) {

                    var init = '<div id="temp-container" class="container-footer bfb-add-container">' +
                        '<a href="/scb/nojs/add/container' + entityIdPath + '" class="additional-container use-ajax" data-dialog-type="modal">' + addIcon + 'Add new Container</a>' +
                        // '<a class="additional-outer-column">' + addIcon + 'Add new Column</a>' +
                        '</div>';
                    $('#bfb-builder').append(init);
                    applyAjaxCalls();
                }
            }

            $('.shortcode-form', context).not('.shortcode-add-element-form').each(function () {
                overwriteFieldsWithAttributes($(this));
            });

            $('#shortcode-submit').on('click', function () {
                storeFieldsAsAttributes( $(this).closest('form') );
                rebuildSortcode();
                $( $(this).closest('form').parent().parent() ).dialog('close');
            });


        }, // End attach

    }

    /**
     * Click Events
     */

    // $('body').on('click', '.additional-container', function () {
    //     var options = {
    //         storage_value: data_key,
    //         tag: "bfb_container",
    //         type: "closed",
    //         parent: 0,
    //     };
    //
    //     var container = new SC_element( options );
    //
    //     data_storage[data_key] = container;
    //
    //     data_key++;
    //
    //     var clicked_id = $(this).closest('.bfb-wrapper').attr('id');
    //
    //     createContainer(clicked_id, container, 'after');
    //     makeSortable();
    //     rebuildSortcode();
    // });

    // $('body').on('click', '.additional-outer-column', function () {
    //     $.ajax({
    //         method: "POST",
    //         url: "/scb/form/nojs/module/text",
    //         data: { name: "John", location: "Boston" }
    //     }).done(function( msg ) {
    //         console.log( "Data Saved: " + msg );
    //         var form = $(msg).find('.region-content').html();
    //         $('#edit-field-builder-0-value--description').html(form);
    //     });
    // });



    // May be able to use http://jsfiddle.net/ExV4w/2/
    /**
     *
     */
    function getPageData(text) {
        // Find all sections in layout
        var pageData = findAllTagsof('bfb_container', text, 0);

        // Find all rows in a section
        pageData.forEach(function(container, container_index) {
            pageData[container_index].outer_columns = findAllTagsof('bfb_outer_column', container.content, 0);

            // Store container in data key
            pageData[container_index].storage_value = data_key;
            data_storage[data_key] = container;
            data_storage[data_key].parent = 0;
            data_key++;


            // Find all outer_column in a section
            pageData[container_index].outer_columns.forEach(function(outer_column, outer_column_index) {
                pageData[container_index].outer_columns[outer_column_index].rows = findAllTagsof('bfb_row', outer_column.content, 0);

                // Store container in data key
                pageData[container_index].outer_columns[outer_column_index].storage_value = data_key;
                data_storage[data_key] = outer_column;
                data_storage[data_key].parent = 0;
                data_key++;


                // Find all rows in a outer_column
                pageData[container_index].outer_columns[outer_column_index].rows.forEach(function(row, row_index) {
                    pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns = findAllTagsof('bfb_column', row.content, 0);

                    // Store data in data key
                    pageData[container_index].outer_columns[outer_column_index].rows[row_index].storage_value = data_key;
                    data_storage[data_key] = row;
                    data_storage[data_key].parent = pageData[container_index].outer_columns[outer_column_index].storage_value;
                    data_key++;

                    // Find all modules in a row
                    pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns.forEach(function(module, column_index) {
                        pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns[column_index].modules = findAllTagsof('bfb_module', module.content, 0);

                        // Store data in data key
                        pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns[column_index].storage_value = data_key;
                        data_storage[data_key] = module;
                        data_storage[data_key].parent = pageData[container_index].outer_columns[outer_column_index].rows[row_index].storage_value;
                        data_key++;

                        // Added all module data in data_storage array
                        pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns[column_index].modules.forEach(function(data_storage_data, module_index) {
                            pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns[column_index].modules[module_index].storage_value = data_key;
                            data_storage[data_key] = data_storage_data;
                            data_storage[data_key].parent = pageData[container_index].outer_columns[outer_column_index].rows[row_index].columns[column_index].storage_value;
                            data_key++;
                        });

                    });
                });
            });

        });

        return pageData;
    }


    function findAllTagsof(tag, text, index, arrayOfTags){

        if (arrayOfTags === undefined){
            var arrayOfTags = [];
        }

        var shortcode = wp.shortcode.next( tag, text, index );

        if(shortcode !== undefined) {
            arrayOfTags.push( shortcode.shortcode );

            var next = shortcode.index + 1;

            arrayOfTags = findAllTagsof(tag, text, next, arrayOfTags );

        }


        return arrayOfTags;
    }


    function rebuildSortcode( ) {
        // Find all sections in layout
        var shortcode = "";
        var builderData = $('.builder').sortable( "toArray" );

        console.log(builderData);

        // Find all containers in builder
        builderData.forEach(function(container) {

            // Get container form data storage.
            var container_id = container.split('-')[1];
            var container_object = data_storage[container_id];

            // Initialize the containers content
            var container_content = "";
            var containerData = [];

            // Since Columns aren't sortable and alternative method must place
            $('#' + container + ' .bfb-outer-column').each(function(){
                containerData.push($(this).attr('id'));
            });



            // Find all containers in builder
            containerData.forEach(function(outer_column) {

                // Get container form data storage.
                var outer_column_id = outer_column.split('-')[1];
                var outer_column_object = data_storage[outer_column_id];

                // Initialize the containers content
                var outer_column_content = "";
                var outer_columnData = $('#' + outer_column + ' .bfb-content').sortable( "toArray" );



                console.log(containerData);
                // Find all rows in a container
                outer_columnData.forEach( function(row) {

                    // Get container form data storage.
                    var row_id = row.split('-')[1];
                    var row_object = data_storage[row_id];

                    // Initialize the containers content
                    var row_content = "";
                    var rowData = [];

                    // Since Columns aren't sortable and alternative method must place
                    $('#' + row + ' .bfb-column').each(function(){
                        rowData.push($(this).attr('id'));
                    });

                    rowData.forEach(function(column) {

                        // Get container form data storage.
                        var column_id = column.split('-')[1];
                        var column_object = data_storage[column_id];

                        // Initialize the containers content
                        var column_content = "";
                        var columnData = $('#' + column + ' .bfb-content').sortable( "toArray" );


                        // Find all modules in a column
                        columnData.forEach(function(module) {

                            // Get container form data storage.
                            var module_id = module.split('-')[1];
                            var module_object = data_storage[module_id];


                            // Populate Data.
                            var module_options = {
                                tag: module_object.tag,
                                attrs: module_object.attrs,
                                type: module_object.type,
                                content: module_object.content,
                            };

                            column_content += wp.shortcode.string( module_options );


                        });

                        // Populate Data.
                        var column_options = {
                            tag: column_object.tag,
                            attrs: column_object.attrs,
                            type: column_object.type,
                            content: column_content,
                        };

                        row_content += wp.shortcode.string( column_options );
                    });



                    // Populate Data.
                    var row_options = {
                        tag: row_object.tag,
                        attrs: row_object.attrs,
                        type: row_object.type,
                        content: row_content,
                    };

                    outer_column_content += wp.shortcode.string( row_options );
                });


                // Populate Data.
                var outer_column_options = {
                    tag: outer_column_object.tag,
                    attrs: outer_column_object.attrs,
                    type: outer_column_object.type,
                    content: outer_column_content,
                };

                container_content += wp.shortcode.string( outer_column_options );

            });





            // Populate Data.
            var section_options = {
                tag: container_object.tag,
                attrs: container_object.attrs,
                type: container_object.type,
                content: container_content,
            };

            shortcode += wp.shortcode.string( section_options );

        });


        builder.val(shortcode);

        // console.log( shortcode );
        console.log( 'Rebuilt Shortcode' );

    }


    function createPageBuilder() {
        pageData.forEach(function(container) {
            // Create Container
            var container_id = 'container-' + container.storage_value;

            createContainer('.builder', container);

            container.outer_columns.forEach(function(outer_column) {

                var outer_column_id = 'outercolumn-' + outer_column.storage_value;
                console.log(data_storage[outer_column.storage_value]);
                // Create Row
                createOuterColumn(container_id, outer_column_id, data_storage[outer_column.storage_value]);


                outer_column.rows.forEach(function(row) {

                    var row_id = 'row-' + row.storage_value;
                    // Create Row
                    createRow(outer_column_id, row_id, data_storage[row.storage_value]);


                    row.columns.forEach(function(column) {

                        var column_id = 'column-' + column.storage_value;
                        // Create Column
                        createColumn(row_id, column_id, data_storage[column.storage_value]);

                        column.modules.forEach(function(module) {

                            var module_id = 'module-' + module.storage_value;
                            // Create Module
                            createModule(column_id, module_id, data_storage[module.storage_value]);

                        }); // column.modules.forEach

                    }); // row.columns.forEach

                }); // container.outer_columns.forEach

            }); // container.outer_columns.forEach

        });
    }

    function createContainer(parent_id, container, operation) {

        // set operation for undefined
        if (operation === undefined){
            operation = 'inside';
        }

        console.log(container);

        var container_id = 'container-' + container.storage_value;

        var container_info =
            '<div id="' + container_id + '" class="bfb-container container-fluid bfb-wrapper" data-bfb-value="' + container.storage_value + '">' +
                '<div class="container-header bfb-drag">' +
                    '<a href="/scb/form/container" class="use-ajax" data-dialog-type="modal" data-dialog-options="{&quot;dialogClass&quot;:&quot;shortcode-modal&quot;}">' + editIcon + '</a>' +
                    '<button class="delete-icon">' + deleteIcon + '</button>' +
                '</div>' +
                '<div class="container-body bfb-content row outer-columns-container"></div>' +
                '<div class="container-footer bfb-add-container">' +
                    '<a href="/scb/nojs/add/container' + entityIdPath + '" class="additional-container use-ajax" data-dialog-type="modal">' + addIcon + 'Add new Container</a>' +
                    // '<a class="additional-outer-column">' + addIcon + 'Add new Column</a>' +

                '</div>' +
            '</div>';

        if ( operation == 'inside' ) {
            $( parent_id ).append(container_info);
        } else if ( operation == 'after' ) {
            $( '#'+parent_id ).after(container_info);
        }
    }

    function createOuterColumn(container_id, column_id, column) {
        var attrs = column.attrs.named;

        $('#' + container_id + " > .bfb-content").append(
            '<div id="' + column_id + '" class="bfb-outer-column bfb-wrapper col-sm-'+ attrs.type + '" data-bfb-value="' + column.storage_value + '">' +
            '<div class="outer-column-header bfb-drag">'+ attrs.type + ' of 12</div>' +
            '<div class="outer-column-body bfb-content row rows-container"></div>' +


            '<div class="container-footer bfb-add-container">' +
                '<a href="/scb/nojs/add/row' + entityIdPath + '" class="additional-column use-ajax" data-dialog-type="modal" data-dialog-options="{&quot;dialogClass&quot;:&quot;shortcode-modal&quot;}">' + addIcon + ' add a row</a>' +
            '</div>' +
            '</div>');
    }

    function createRow(container_id, row_id, row) {
        $('#' + container_id + " > .bfb-content").append(
            '<div id="' + row_id + '" class="bfb-row bfb-wrapper container-fluid" data-bfb-value="' + row.storage_value + '">' +
            '<div class="row-header bfb-drag"></div>' +
            '<div class="row-body bfb-content row"></div>' +
            '</div>');
    }

    function createColumn(row_id, column_id, column) {
        var attrs = column.attrs.named;

        $('#' + row_id + " > .bfb-content").append(
            '<div id="' + column_id + '" class="bfb-column bfb-wrapper col-sm-'+ attrs.type + '" data-bfb-value="' + column.storage_value + '">' +
            '<div class="column-header bfb-drag">'+ attrs.type + ' of 12</div>' +
            '<div class="column-body bfb-content row module-container"></div>' +

            '<div class="container-footer bfb-add-container">' +
                '<a href="/scb/nojs/add/widget' + entityIdPath + '" class="additional-column use-ajax" data-dialog-type="modal" data-dialog-options="{&quot;dialogClass&quot;:&quot;shortcode-modal&quot;}">' + addIcon + ' add a widget</a>' +
            '</div>' +
            '</div>');
    }

    function createModule(column_id, module_id, module) {
        var attrs = module.attrs.named;

        console.log('hit');

        $('#' + column_id + " > .bfb-content").append(
            '<div id="' + module_id + '" class="bfb-module bfb-wrapper col-sm-'+ attrs.type + '" data-bfb-value="' + module.storage_value + '">' +
            '<div class="module-header bfb-drag">'+
                '<a href="/scb/form/nojs/module/'+ attrs.type + '" class="use-ajax" data-dialog-type="modal" data-dialog-options="{&quot;dialogClass&quot;:&quot;shortcode-modal&quot;}">' + editIcon + '</a>' +
                '<span>' + attrs.type + '</span>' +
            '</div>' +
            '</div>');
    }


    function makeSortable( ) {
        /** Sort Rules */
        $( ".builder" ).sortable({ // This means the rows are sortable.
            connectWith: ".builder",
            handle: ".container-header.bfb-drag",
            cancel: ".bfb-container:only-child",
            placeholder: "portlet-placeholder ui-corner-all",
            items: "> div",
        });

        $( ".rows-container" ).sortable({ // This means the rows are sortable.
            connectWith: ".rows-container",
            handle: ".row-header.bfb-drag",
            // cancel: ".bfb-row:only-child",
            placeholder: "portlet-placeholder ui-corner-all",
            items: "> div",
        }).on( "sortremove", function( event, ui ) {

            var rowContaniner = $(this);

            if( rowContaniner.find('.bfb-row ').length == 0){
                rowContaniner.sortable( "cancel" );
                console.log( rowContaniner );
                // console.log( rowContaniner.closest('.bfb-wrapper').attr('id') );
                alert('A column must have a widget.');
            }

        });

        $( ".module-container" ).sortable({ // This means the rows are sortable.
            connectWith: ".module-container",
            handle: ".module-header.bfb-drag",
            placeholder: "portlet-placeholder ui-corner-all",
            items: "> div",
        });

        $( ".ui-sortable" ).on( "sortupdate", function( event, ui ) {
            if ($(this).closest('.bfb-wrapper').attr('id') == ui.item.parent().closest('.bfb-wrapper').attr('id') ){
                rebuildSortcode();
            }
        } );
        applyAjaxCalls();

    }

    function applyAjaxCalls() {

        $('.use-ajax').once('ajax').each(function () {
            var element_settings = {};
            // Clicked links look better with the throbber than the progress bar.
            element_settings.progress = {type: 'throbber'};

            // For anchor tags, these will go to the target of the anchor rather
            // than the usual location.
            var href = $(this).attr('href');
            if (href) {
                element_settings.url = href;
                element_settings.event = 'click';
            }
            element_settings.dialogType = $(this).data('dialog-type');
            element_settings.dialog = $(this).data('dialog-options');
            element_settings.base = $(this).attr('id');
            element_settings.element = this;
            Drupal.ajax(element_settings);
        });

        $('.use-ajax').on('click', function () {
            var click_target = $(this);

            if ( click_target.parent().hasClass('bfb-drag') || click_target.parent().hasClass('bfb-add-container') ) {
                var storageKey = click_target.closest('.bfb-wrapper').data('bfbValue');

                console.log(storageKey);

                $('body').data('storagekey', storageKey);
            }
        });

    }

    function storeFieldsAsAttributes(form) {

        var storageKey = $('body').data('storagekey');
        var attr = {}

        form.find('#module-edit-tabs input,#module-edit-tabs textarea,#module-edit-tabs select').not('.vertical-tabs__active-tab').each(function () {
            var item = $(this);

            // remove all braces form string and
            var propertyname = item.attr('name').replace(/[\[\]']+/g, '_').replace(/_\s*$/, "");

            // Determine how value should be set
            switch(item.attr('type')) {
                case 'checkbox':
                    attr[propertyname] = item.prop('checked');
                    break;
                case 'date':
                    attr[propertyname] = item.val();
                    break;
                default:
                    if ( item.attr('name') == 'content' ){
                        data_storage[storageKey].content = item.val();
                        data_storage[storageKey].type = "closed";
                    } else if ( item.attr('name') == 'content[value]' ) {
                        var content_id = item.attr('id');

                        data_storage[storageKey].content =  CKEDITOR.instances[content_id].getData();
                        data_storage[storageKey].type = "closed";
                    } else {
                        attr[propertyname] = item.val();
                    }

            }

        });

        data_storage[storageKey].attrs.named = attr;

        console.log(storageKey);
    }



    function overwriteFieldsWithAttributes(form) {

        var storageKey = $('body').data('storagekey');
        var attr = data_storage[storageKey].attrs.named;

        console.log(attr);

        // if property is undefined, ignore
        if (attr !== undefined ) {

            form.find('#module-edit-tabs input,#module-edit-tabs textarea,#module-edit-tabs select').not('.vertical-tabs__active-tab').each(function () {
                var item = $(this);

                // remove all braces form string and
                var propertyname = item.attr('name').replace(/[\[\]']+/g, '_').replace(/_\s*$/, "");


                // if property is undefined, ignore
                if (attr[propertyname] !== undefined || item.attr('name') == 'content' || item.attr('name') == 'content[value]' ) {
                    // Determine how value should be set
                    switch(item.attr('type')) {
                        case 'checkbox':
                            var checked = (attr[propertyname] == 'true' || attr[propertyname] == true ) ? true : false;
                            item.prop('checked', checked)
                            break;
                        case 'date':
                            item.val(attr[propertyname]);
                            break;
                        default:
                            if ( item.attr('name') == 'content' ){
                                item.val(data_storage[storageKey].content);
                            } else if ( item.attr('name') == 'content[value]' ) {
                                item.val(data_storage[storageKey].content);
                            } else {
                                item.val(attr[propertyname]);
                            }
                    }

                }

            });
        }

    }

    // create a element class
    function SC_element( options, attr ) {
        this.attrs = {};
        this.attrs.named = attr;
        this.attrs.numeric = undefined;
        this.storage_value = options.storage_value;
        this.parent = options.parent;
        this.tag = options.tag;
        this.type = options.type;

        return this;
    }

})(jQuery, Drupal);
