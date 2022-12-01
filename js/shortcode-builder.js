(function ($, Drupal) {

    'use strict';

    /**/
    Drupal.behaviors.ShortcodeFormBuilder = {

        builder: null,

        attach: function (context, settings) {

            var self = this;

            // Using once() with more complexity.
            $('.field--type-shortcode-builder', context).once('mySecondBehavior').each(function () {

                // Create Builder
                self.builder = $(this).shortcodeBuilder({test:"sdfg"})

            });


            self.builder.init2();

        }, // End attach

    }


})(jQuery, Drupal);
