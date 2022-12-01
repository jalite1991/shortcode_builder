<?php
/**
 * @file
 * Contains Drupal\shortcode_builder\Form\BaseForm
 */

namespace Drupal\shortcode_builder\Form;

use Drupal\Core\Form\Formbase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class BaseForm
 * @package Drupal\shortcode_builder\Form
 */
class BaseForm extends Formbase
{

  public function getFormId()
  {
    return 'bfb_base_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state)
  {
    $form['#attached']['library'][] = 'shortcode_builder/edit_form';
    $form['#attributes']['class'][] = 'shortcode-form';


    $form['needs_accommodation'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Need Special Accommodations?'),
    );

    $form['accommodation'] = array(
      '#type' => 'container',
      '#attributes' => array(
        'class' => 'accommodation',
      ),
      '#states' => array(
        'invisible' => array(
          'input[name="needs_accommodation"]' => array('checked' => FALSE),
        ),
      ),
    );

    $form['accommodation']['diet'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Dietary Restrictions'),
    );



    $form['top_tabs'] = array(
      '#type' => 'vertical_tabs',
      '#default_tab' => 'edit-general',
      '#prefix' => '<div class="module-edit-tabs">',
      '#suffix' => '</div>',
      '#attributes' => array(
        'id' => 'module-edit-tabs',
      ),
    );


    /** Genneral Settings */
    $form['general'] = array(
      '#type' => 'details',
      '#title' => $this->t('General Setting'),
      '#group' => 'top_tabs',
    );

    $form['general']['hash'] = array(
      '#type' => 'hidden',
      '#value' => "",
    );

    $form['general']['hide_on'] = array(
      '#type' => 'checkboxes',
      '#options' => array('xs' => $this->t('XS'), 'sm' => $this->t('SM'), 'md' => $this->t('MD'), 'lg' => $this->t('LG')),
      '#title' => $this->t('Disable on...'),
      '#weight' => 100,
    );

    $form['general']['admin_label'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Admin Label'),
      '#weight' => 101,
    );

    /** Advance Settings */
    $form['advance'] = array(
      '#type' => 'details',
      '#title' => $this->t('Advance Design Settings'),
      '#group' => 'top_tabs',
    );

    $form['advance']['bg_color'] = array(
      '#type' => 'color',
      '#title' => $this->t('Background Color'),
      '#default_value' => '#ffffff',
    );

    /** Custom CSS */
    $form['css'] = array(
      '#type' => 'details',
      '#title' => $this->t('Custom CSS'),
      '#group' => 'top_tabs',
    );

    $form['css']['id'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Custom Id'),
    );

    $form['css']['class'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Custom Classes'),
    );

    $form['css']['style'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Custom Styles'),
    );

    $form['submit'] = array(
        '#markup' => '<div id="shortcode-submit" class="button js-form-submit form-submit"> Save </div>',
        '#allowed_tags' => ['div'],
      );
//    $form['actions']['test'] = array(
//      '#type' => 'submit',
//      '#value' => $this->t('Save'),
//    );

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
