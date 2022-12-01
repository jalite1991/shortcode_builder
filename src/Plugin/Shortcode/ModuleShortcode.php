<?php
/**
 * @file
 * Contains \Drupal\shortcode_builder\Plugin\Shortcode\ModuleShortcode.
 */

namespace Drupal\shortcode_builder\Plugin\Shortcode;


use Drupal\Core\Language\Language;
use Drupal\shortcode\Plugin\ShortcodeBase;

/**
 * The Container shortcode.
 *
 * @Shortcode(
 *   id = "bfb_module",
 *   title = @Translation("Text Module"),
 *   description = @Translation("BFB Text Module")
 * )
 */
class ModuleShortcode extends ShortcodeBase {

  /**
   * {@inheritdoc}
   */
  public function process($attributes, $text, $langcode = Language::LANGCODE_NOT_SPECIFIED) {

    // Get the plugin based on the
    $type = \Drupal::service('plugin.shortcode_builder.module_manager');
    $plugin = $type->getDefinition($attributes['type']);

    $module = new $plugin['class']($plugin, $plugin['id'], $plugin);


    // Merge with default attributes.
    $attributes = $this->getAttributes(array(
      'type' => '',
      'bg_color' => '',
      'class' => '',
      'id' => '',
      'style' => '',
      'hide_on_lg' => "false",
      'hide_on_md' => "false",
      'hide_on_sm' => "false",
      'hide_on_xs' => "false",
    ),
      $attributes
    );

    // Set Classes
    $classes = [
      'bfb-module',
      'bfb-' . $attributes['type'],
      ($attributes['hide_on_lg'] == 'true') ? 'hidden-lg' : '', // Hidden lg classes
      ($attributes['hide_on_md'] == 'true') ? 'hidden-md' : '', // Hidden lg classes
      ($attributes['hide_on_sm'] == 'true') ? 'hidden-sm' : '', // Hidden lg classes
      ($attributes['hide_on_xs'] == 'true') ? 'hidden-xs' : '', // Hidden lg classes
      $attributes['class'], // merged classes
    ];

    // Set Styles

    // Build element attributes to be used in twig.
    $element_attributes = [
      'class' => implode ( ' ' , $classes),
      'id' => $attributes['id'],
      'style' => $attributes['style'],
    ];

    // Filter away empty attributes.
    $element_attributes = array_filter($element_attributes);


    $output = [
      '#theme' => 'shortcode_builder_base',
      '#attributes' => $element_attributes,
//      '#text' => $attributes['type'],
      '#text' => $text,
    ];


    return $this->render($output);

  }

  /**
   * {@inheritdoc}
   */
  public function tips($long = FALSE) {
    $output = array();
    $output[] = '<p><strong>' . $this->t('[button path="path" (class="additional class")]text[/button]') . '</strong> ';
    if ($long) {
      $output[] = $this->t('Inserts a link formatted like as a button. The <em>path</em> parameter provides the link target (the default is the front page).
    The <em>title</em> will be formatted as a link title (small tooltip over the link - helps for SEO).
    Additional class names can be added by the <em>class</em> parameter.') . '</p>';
    }
    else {
      $output[] = $this->t('Inserts a link formatted as a button. Use the url parameter for the link.') . '</p>';
    }
    return implode(' ', $output);
  }
}
