<?php
/**
 * Created by PhpStorm.
 * User: jfloyd
 * Date: 3/21/17
 * Time: 3:08 PM
 */

namespace Drupal\shortcode_builder\Plugin\ShortcodeWidget;

use Drupal\shortcode_builder\Plugin\WidgetBase;
use Drupal\Core\Language\Language;


/**
 * The Container shortcode.
 *
 * @Widget(
 *   id = "image-style",
 *   title = @Translation("Image Module -- Not Ready"),
 *   description = @Translation("BFB Text Module")
 * )
 */
class Image extends WidgetBase  {


  function process($attributes, $text, $langcode = Language::LANGCODE_NOT_SPECIFIED) {
    // TODO: Implement process() method.
  }
}
