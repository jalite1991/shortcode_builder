<?php
/**
 * @file
 * Contains Drupal\shortcode_builder\Form\ContainerForm
 */

namespace Drupal\shortcode_builder\Form;

use Drupal\Core\Form\FormStateInterface;


/**
 * Class BaseForm
 * @package Drupal\shortcode_builder\Form
 */
class ContainerForm extends BaseForm
{

  public function getFormId()
  {
    return 'bfb_container_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state)
  {
    $form = parent::buildForm($form, $form_state);


    $form['general']['fullwidth'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Fullwidth?'),
    );


    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state)
  {
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
  public function submitForm(array &$form, FormStateInterface $form_state)
  {


    drupal_set_message(t('Thank You for the RSVP'));
  }

}
