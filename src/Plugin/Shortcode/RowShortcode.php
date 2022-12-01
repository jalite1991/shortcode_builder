<?php
/**
 * @file
 * Contains \Drupal\shortcode_builder\Plugin\Shortcode\RowShortcode.
 */

namespace Drupal\shortcode_builder\Plugin\Shortcode;


use Drupal\Core\Language\Language;
use Drupal\shortcode\Plugin\ShortcodeBase;

/**
 * The Container shortcode.
 *
 * @Shortcode(
 *   id = "bfb_row",
 *   title = @Translation("Row"),
 *   description = @Translation("BFB Row")
 * )
 */
class RowShortcode extends ShortcodeBase {

  /**
   * {@inheritdoc}
   */
  public function process($attributes, $text, $langcode = Language::LANGCODE_NOT_SPECIFIED) {

    // Merge with default attributes.
    $attributes = $this->getAttributes(array(
      'fullwidth' => 'on',
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
      'row',
      'bfb-row',
      ($attributes['hide_on_lg'] == 'true') ? 'hidden-lg' : '', // Hidden lg classes
      ($attributes['hide_on_md'] == 'true') ? 'hidden-md' : '', // Hidden lg classes
      ($attributes['hide_on_sm'] == 'true') ? 'hidden-sm' : '', // Hidden lg classes
      ($attributes['hide_on_xs'] == 'true') ? 'hidden-xs' : '', // Hidden lg classes
      $attributes['class'], // merged classes
    ];

    // Set Styles

    // Build element attributes to be used in twig.
    $element_attributes = [
      'bg_color' => $attributes['bg_color'],
      'class' => implode ( ' ' , $classes),
      'id' => $attributes['id'],
      'style' => $attributes['style'],
    ];

    // Filter away empty attributes.
    $element_attributes = array_filter($element_attributes);


    $output = [
      '#theme' => 'shortcode_builder_base',
      '#attributes' => $element_attributes,
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
