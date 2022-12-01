<?php
/**
 * @file
 * Contains \Drupal\shortcode_builder\Plugin\ShortcodeWidget\Text
 */

namespace Drupal\shortcode_builder\Plugin\ShortcodeWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\shortcode_builder\Plugin\WidgetBase;
use Drupal\Core\Language\Language;

/**
 * The Container shortcode.
 *
 * @Widget(
 *   id = "text",
 *   title = @Translation("Text Widget"),
 *   description = @Translation("BFB Text Widget")
 * )
 */
class Text extends WidgetBase {


  function process($attributes, $text, $langcode = Language::LANGCODE_NOT_SPECIFIED) {
    // TODO: Implement process() method.
  }

  public function settingsForm(array $form, FormStateInterface $form_state) {
    // Implementations should work with and return $form. Returning an empty
    // array here allows the text format administration form to identify whether
    // this shortcode plugin has any settings form elements.

    $form['general']['fullwidth'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Fullwidth?'),
    );

    $form['general']['content'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Widget Content'),
      '#type' => 'text_format',
      '#title' => 'Body',
      '#format' => 'full_html',
      '#default_value' => '',
    );

    return $form;
  }
}
