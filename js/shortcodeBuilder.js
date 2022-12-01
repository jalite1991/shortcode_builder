/*!
 * shortcodeBuilder.js v0.2.0
 * inspiratoin from - https://github.com/ajayns/previewer
 *
 * Copyright (c) 2017 J. FLOYD NS
 * Released under the MIT license
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.shortcodeBuilder = factory(root.jQuery);
    }
}(this, function ($) {

    'use strict';

    var pathname = location.pathname.split("/");
    var entityIdPath = '/' + pathname[1] + '/' + pathname[2];

    var pluginName = 'shortcodeBuilder';

    var defaults = {
        builder: '#bfb-builder',
        form_input: 'textarea.textarea-builder',
        icons: {
            editIcon: '<i class="fa fa-pencil-square-o"></i>',
            addIcon: '<i class="fa fa-plus"></i>',
            copyIcon: '<i class="fa fa-files-o"></i>',
            deleteIcon: '<i class="fa fa-trash-o"></i>',
        },
        builderStructure: ['bfb_container', 'bfb_outer_column', 'bfb_row', 'bfb_column', 'bfb_module'],
    };

    var shortcodeBuilderPlugin;


    Drupal.AjaxCommands.prototype.addBuilderElement = function(ajax, response, status) {
        var storageKey = $('body').data('bfbstoragekey');

        console.log("\n\n");
        console.log("ajax");
        console.log("--------------------------");
        console.log(ajax);
        console.log(response);
        console.log(status);

        let elementKey = shortcodeBuilderPlugin.nextDataKey();

        let options = {
            storage_value: elementKey,
            type: "closed",
            tag: response.type,
            parent: response.type !== "bfb_container" ? storageKey : 0,
        };

        shortcodeBuilderPlugin.addBuilderElement(storageKey, options, {} );


        switch ( response.type ) {
            case "bfb_container":
            case "bfb_row":

                    let colNum = parseInt( response.plugin_type );
                    let columnSize = 12 / parseInt(response.plugin_type);

                    for (var i = 0; i < colNum; i++) {

                        let colOptions = {
                            storage_value: shortcodeBuilderPlugin.nextDataKey(),
                            type: "closed",
                            tag: response.type === "bfb_container" ? "bfb_outer_column" : "bfb_column",
                            parent: elementKey,
                        }
                        let colAttrs = {
                            type: columnSize,
                        };

                        shortcodeBuilderPlugin.addBuilderElement(elementKey, colOptions, colAttrs );
                    }

                break;
            default:
        }

        shortcodeBuilderPlugin.rebuildShortcode();
    }


    Drupal.behaviors.ShortcodeBuilder = {
        attach: function (context, settings) {
            // console.log("\n\n");
            // console.log("behaviors");
            // console.log("--------------------------");
            // console.log(context);
            // console.log(settings);
            // console.log(shortcodeBuilderPlugin);
        }, // End attach

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


    var Pluginify = (function() {
        function Plugin(element, options) {
            // Plugin variables
            this.element = element;
            this._defaults = defaults;
            this._name = pluginName;
            this.el = $(this.element);

            // shortcodeBuilder variables
            this.data_key = 0;
            this.data_storage = [];
            this.page_structure = [];

            // Run Initialization
            this.options = $.extend({}, defaults, options);

            this.init();
            this.applyAjaxCalls();

        }



        Plugin.prototype.init = function() {

            var builder = this.el.find(this.options.builder);
            var form_input = this.el.find(this.options.form_input);

            this.builder = $(builder) ;
            this.form_input = $(form_input) ;

            // Update Page Structure and Data Storage
            this.createPageData();

            // Render the page builder
            this.createPageBuilder();

            // Make Items Sortable
            this.makeSortable();

            this.form_input.css('color', '#FC1501');
        };


        Plugin.prototype.init2 = function() {

            this.form_input.css('color', '#0015ff');
        };

        Plugin.prototype.createPageData = function() {
            console.log(this);
            // Get the Builder text
            var builderText = _getPageDataFromBuilder(this.form_input);

            // Parse text
            this.page_structure = this.recursiveParse( builderText );
        };



        Plugin.prototype.updatePageData = function() {

        };



        Plugin.prototype.test = function(first_argument) {
            // body...
        };


        Plugin.prototype.recursiveParse = function(text, level, parent) {
            if (level === undefined){
                var level = 0;
            }
            if (parent === undefined){
                var parent = 0;
            }

            let self = this;

            let target = self.options.builderStructure[level];
            let nextLevel = level + 1;
            let nextTarget = self.options.builderStructure[nextLevel];


            let structure = [];
            let elements = _findAllTagsof(target, text, 0);

            elements.forEach(function(element, index) {

                self.data_key++;
                structure[index] = {};
                structure[index].storage_value = self.data_key;
                self.data_storage[self.data_key] = element;
                self.data_storage[self.data_key].parent = parent;


                if (nextTarget && element.content !== "") {
                    structure[index][nextTarget] = self.recursiveParse(element.content, nextLevel, self.data_key);
                }

            });


            return structure;
        }


        Plugin.prototype.createPageBuilder = function(structure, level, parentID) {
            let self = this;

            if (structure=== undefined){
                structure = self.page_structure;
            }
            if (level === undefined){
                level = 0;
            }
            if (parentID === undefined){
                parentID = this.options.builder;
            }


            let target = self.options.builderStructure[level];
            let nextLevel = level + 1;
            let nextTarget = self.options.builderStructure[nextLevel];

            structure.forEach( function( shortcode ) {

                let shortcodeID = target + "-" + shortcode.storage_value;
                console.log(shortcodeID);

                self.createElement({dataKey:shortcode.storage_value, parentID:parentID, elementID:shortcodeID });

                if (shortcode[nextTarget]) {
                    self.createPageBuilder(shortcode[nextTarget], nextLevel, shortcodeID);
                }

            });

        }



        Plugin.prototype.createElement = function(options, after) {
            // Default the after option
            if (after=== undefined){
                after = false;
            }

            options.tag = this.data_storage[options.dataKey].tag;
            options.icons = this.options.icons;

            let tag = this.data_storage[options.dataKey].tag;

            // Create object and script of element
            let script = _returnTemplated( tag, options);

            // append text either inside or after the dom element.
            if (after) {
                let DOM = options.parentID == this.options.builder ? $(options.parentID) : $('#' + options.parentID);
                DOM.after(script);
            } else {
                let DOM = options.parentID == this.options.builder ? $(options.parentID) : $('#' + options.parentID + " > .bfb-content");
                DOM.append(script);
            }

        }



        Plugin.prototype.rebuildShortcode = function( element ) {
            let self = this;
            let shortcode = "";
            let builderData = [];

            if (element === undefined) {
                // Find all sections in Area
                builderData = self.builder.sortable( "toArray" );

                console.log( 'builderData' );
                console.log( builderData );
            } else {

                let elementConatiner = self.builder.find( "#" + element + '> .bfb-content');

                if ( elementConatiner.sortable( "instance" ) ) {

                    builderData = elementConatiner.sortable( "toArray" );

                } else{

                    elementConatiner.find( '> .bfb-wrapper').each(function(){
                        console.log(this);
                        console.log($(this).attr('id'));
                        builderData.push($(this).attr('id'));
                    });
                }

                console.log( 'builderData - passed' );
                console.log( builderData );
                console.log( elementConatiner );
            }


            // Find all containers in builder
            builderData.forEach( function( container ) {
                // Get container form data storage.
                var container_id = container.split('-')[1];
                var container_object = self.data_storage[container_id];

                var container_content = "";


                container_content = self.rebuildShortcode(container) || container_object.content ;

                // Populate Data.
                var section_options = {
                    tag: container_object.tag,
                    attrs: container_object.attrs,
                    type: container_object.type,
                    content: container_content,
                };

                shortcode += wp.shortcode.string( section_options );

            });



            if (element === undefined) {

                console.log( shortcode );
                console.log( 'Rebuilt Shortcode' );
            } else {
                return shortcode
            }



        }



        Plugin.prototype.makeSortable = function() {

            let self = this;

            self.builder.sortable({ // This means the rows are sortable.
                connectWith: ".builder",
                handle: "> .bfb-drag",
                cancel: ".bfb-container:only-child",
                placeholder: "portlet-placeholder ui-corner-all",
                items: "> div",
            });

            self.builder.find( ".bfb-outer-column > .bfb-content" ).sortable({ // This means the rows are sortable.
                connectWith: ".bfb-outer-column > .bfb-content",
                handle: "> .bfb-drag",
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

            self.builder.find( ".bfb-column > .bfb-content" ).sortable({ // This means the rows are sortable.
                connectWith: ".bfb-column > .bfb-content",
                handle: "> .bfb-drag",
                placeholder: "portlet-placeholder ui-corner-all",
                items: "> div",
            });


            $( ".ui-sortable" ).on( "sortupdate", function( event, ui ) {

                console.log( self );
                console.log( event );
                console.log( ui );

                // if ($(this).closest('.bfb-wrapper').attr('id') == ui.item.parent().closest('.bfb-wrapper').attr('id') ){
                //     rebuildSortcode();
                // }
            } );

        }


        Plugin.prototype.applyAjaxCalls  = function() {

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

                    console.log("storageKey");
                    console.log(storageKey);

                    $('body').data('bfbstoragekey', storageKey);
                }
            });

        }


        Plugin.prototype.nextDataKey  = function(details) {
            return ++this.data_key;
        }

        Plugin.prototype.addBuilderElement  = function(caller, details, attrs) {
            // Default the attrs option
            if (attrs=== undefined){
                attrs = {};
            }

            let key = details.storage_value;
            let element = new SC_element( details, attrs );

            this.data_storage[key] = element;

            let elementData = {
                dataKey: key,
                elementID: details.tag + "-" + key,
                icons: this.options.icons,
                parentID: this.data_storage[caller].tag + "-" + caller,
                tag: details.tag
            }


            console.log(caller);
            console.log(details);
            console.log(elementData);
            console.log(details.tag === "bfb_container");

            if (details.tag === "bfb_container" || details.tag === "bfb_row") {
                this.createElement(elementData, true);
            } else {
                this.createElement(elementData);
            }

            this.applyAjaxCalls()

        }


        /**
         * Takes the builder element and updates
         *
         */
        var _getPageDataFromBuilder = function(builder) {

            return builder.val();
        }


        var _findAllTagsof = function(tag, text, index, arrayOfTags){

            if (arrayOfTags === undefined){
                var arrayOfTags = [];
            }

            var shortcode = wp.shortcode.next( tag, text, index );

            if(shortcode !== undefined) {
                arrayOfTags.push( shortcode.shortcode );

                var next = shortcode.index + 1;

                arrayOfTags = _findAllTagsof(tag, text, next, arrayOfTags );

            }


            return arrayOfTags;
        }

        var _cleanJsObj = function() {

        }


        var _returnTemplated= function( type, options) {
            let id = type.replace(/_/g, "-");
            let script = "";

            console.log(type)

            switch (type) {
                case "bfb_container":
                case "bfb_row":
                    script = '<div id="' + options.elementID + '" class="' + id + ' bfb-wrapper container-long" data-bfb-value="' + options.dataKey + '">' +
                        '<div class="' + id + '-header bfb-drag">' +
                            options.icons.editIcon +
                            options.icons.copyIcon +
                            // type +
                            options.icons.deleteIcon +
                        '</div>' +
                        '<div class="' + id + '-body bfb-content row"></div>' +
                        '<div class="' + id + '-footer add-' + id + '">' +
                            '<a href="/scb/nojs/add/'+ type + entityIdPath + '" class="additional-container use-ajax" data-dialog-type="modal">' + options.icons.addIcon + 'Add new ' + type.replace('bfb_', "") +'</a>' +
                        '</div>' +
                    '</div>';
                    break;
                case "bfb_outer_column":
                case "bfb_column":
                    script = '<div id="' + options.elementID + '" class="' + id + ' bfb-wrapper container-long" data-bfb-value="' + options.dataKey + '">' +
                        // '<div class="' + id + '-header bfb-drag">' +
                        //     type +
                        // '</div>' +
                        '<div class="' + id + '-body bfb-content bfb-padding-block row"></div>' +
                    '</div>';
                    break;
                case "bfb_module":
                    script = '<div id="' + options.elementID + '" class="' + id + ' bfb-wrapper container-long" data-bfb-value="' + options.dataKey + '">' +
                        '<div class="' + id + '-header bfb-drag">' +
                            options.icons.editIcon +
                            options.icons.copyIcon +
                            // type +
                            options.icons.deleteIcon +
                        '</div>' +
                        '<div class="' + id + '-body bfb-content row"></div>' +
                    '</div>';
                    break;
                default:
                    script = '<div id="' + options.elementID + '" class="' + id + ' bfb-wrapper container-fluid" data-bfb-value="' + options.dataKey + '">' +
                        '<div class="' + id + '-header bfb-drag">' + type + '</div>' +
                        '<div class="' + id + '-body bfb-content row"></div>' +
                    '</div>';
            }

            return script;
        }


        return Plugin;

    })();


    $.fn[pluginName] = function (options) {
        this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Pluginify(this, options));
            }
        });

        shortcodeBuilderPlugin = this.data(pluginName);
        return this.data(pluginName);
    };
}));
