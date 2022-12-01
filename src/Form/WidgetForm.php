<?php
/**
 * @file
 * Contains Drupal\shortcode_builder\Form\WidgetForm
 */

namespace Drupal\shortcode_builder\Form;

use Drupal\Core\Form\FormStateInterface;


/**
 * Class BaseForm
 * @package Drupal\shortcode_builder\Form
 */
class WidgetForm extends BaseForm {

  public function getFormId() {
    return 'bfb_WidgetForm_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state, $mid = NULL, $options = array() ) {
    // Get Base form
    $form = parent::buildForm($form, $form_state);

    // Get the plugin based on the
    $type = \Drupal::service('plugin.shortcode_builder.module_manager');
    $plugins = $type->getDefinitions();

    if ( isset($plugins[$mid]) ){

      $plugin = $type->getDefinition($mid);

      $module = new $plugin['class']($plugin, $plugin['id'], $plugin);

      // Get Modified Custom form
      $form['general']['type'] = [
        '#type' => 'hidden',
        '#value' => $mid,
        '#weight' => -99,
      ];

      $form = $module->settingsForm($form, $form_state);
    }


    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state)  {

    $value = $form_state->getValue('email');
    if ($value == !\Drupal::service('email.validator')->isValid($value)) {
      $form_state->setErrorByName('email', t('The email address %mail is not valid', array('%mail' => $value)));
      return;
    }

  }

  /**
   * @param array              $form
   * @param FormStateInterface $form_state
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {


    drupal_set_message(t('Thank You for the RSVP'));
  }

}
