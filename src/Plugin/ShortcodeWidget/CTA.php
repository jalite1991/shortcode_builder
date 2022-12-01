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
use Drupal\Core\Form\FormStateInterface;

/**
 * The Container shortcode.
 *
 * @Widget(
 *   id = "cta",
 *   title = @Translation("CTA Module -- Not Ready"),
 *   description = @Translation("BFB CTA Module")
 * )
 */
class CTA extends WidgetBase  {

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

    $form['general']['link'] = array(
      '#type' => 'url',
      '#title' => $this->t('Where to link'),
      '#size' => 30,
    );

    $form['general']['content'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Module Content'),
    );

    return $form;
  }
}
