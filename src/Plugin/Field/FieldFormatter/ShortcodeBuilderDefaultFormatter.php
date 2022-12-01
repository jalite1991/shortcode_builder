<?php
/**
 * @file
 * contains Drupal\shortcode_builder\Plugin\Field\FieldFormatter\ShortcodeBuilderDefaultFormatter
 */

namespace Drupal\shortcode_builder\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'Random_default' formatter.
 *
 * @FieldFormatter(
 *   id = "shortcode_builder_formatter",
 *   label = @Translation("Default Builder"),
 *   field_types = {
 *     "shortcode_builder",
 *     "text_long",
 *   }
 * )
 */
class ShortcodeBuilderDefaultFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = array();
    $settings = $this->getSettings();

    $summary[] = t('Displays the random string.');

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $element = array();

    $shortcoder = \Drupal::service('shortcode');

    foreach ($items as $delta => $item) {
      // Render each element as markup.
      $element[$delta] = array(
        '#type' => 'markup',
        '#markup' => $shortcoder->process($item->value),
        '#text' => $item->value,
        '#format' => $item->format,
        '#langcode' => $item->getLangcode(),
      );

    }

    return $element;
  }
}
