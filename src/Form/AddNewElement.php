<?php
/**
 * @file
 * Contains Drupal\shortcode_builder\Form\BaseForm
 */

namespace Drupal\shortcode_builder\Form;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Database\Database;
use Drupal\Core\Form\Formbase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\shortcode_builder\Ajax\AddBuilderElementCommand;

/**
 * Class BaseForm
 * @package Drupal\shortcode_builder\Form
 */
class AddNewElement extends Formbase
{

  public function getFormId()
  {
    return 'bfb_new_element_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state, $method = null, $element = null, $entity_type = null, $entity_id = null)
  {

    if ($method == 'ajax') {

      $form['#attached']['library'][] = 'shortcode_builder/edit_form';
      $form['#attributes']['class'][] = 'shortcode-form';
      $form['#attributes']['class'][] = 'shortcode-add-element-form';


      // $uuid = \Drupal::entityTypeManager()->getStorage($entity_type)->load($entity_id)->uuid();
      $uuid = rand(0,100);
      $form['uuid'] = [
        '#type' => 'hidden',
        '#value' => $uuid,
        '#weight' => -99,
      ];
      $form['type'] = [
        '#type' => 'hidden',
        '#value' => $element,
        '#weight' => -99,
      ];
      $form['status'] = [
        '#type' => 'hidden',
        '#value' => 0,
        '#weight' => -99,
      ];

      switch ($element) {
        case 'bfb_container':
          $form['rows'] = [
            '#type' => 'select',
            '#title' => $this->t('Select element'),
            '#options' => [
              '1' => $this->t('One'),
              '2' => $this->t('Two'),
              '3' => $this->t('Three'),
              '4' => $this->t('Four'),
            ],
          ];


          $form['actions']['ajaxsubmit'] = array(
            '#type' => 'submit',
            '#value' => $this->t('Save'),
            '#ajax' => [
              'callback' => '\Drupal\shortcode_builder\Form\AddNewElement::ajaxContainerSubmit',
              'wrapper' => 'message-wrapper',
            ],
          );

          break;
        case 'bfb_row':
          $form['rows'] = [
            '#type' => 'select',
            '#title' => $this->t('Select element'),
            '#options' => [
              '1' => $this->t('One'),
              '2' => $this->t('Two'),
              '3' => $this->t('Three'),
              '4' => $this->t('Four'),
            ],
          ];



          $form['actions']['ajaxsubmit'] = array(
            '#type' => 'submit',
            '#value' => $this->t('Save'),
            '#ajax' => [
              'callback' => '\Drupal\shortcode_builder\Form\AddNewElement::ajaxContainerSubmit',
              'wrapper' => 'message-wrapper',
            ],
          );

          break;
        case 'bfb_widget':


          // Get the plugin based on the
          $type = \Drupal::service('plugin.shortcode_builder.module_manager');
          $plugins = $type->getDefinitions();
          $subtypes = array();

          foreach ($plugins as $key => $value ) {
            $subtypes[$key] = $value['title'];
          }


          $form['subtype'] = [
            '#type' => 'select',
            '#title' => $this->t('Select element'),
            '#options' => $subtypes,
          ];

          $form['actions']['ajaxsubmit'] = array(
            '#type' => 'submit',
            '#value' => $this->t('Save'),
            '#ajax' => [
              'callback' => '\Drupal\shortcode_builder\Form\AddNewElement::ajaxModuleSubmit',
              'wrapper' => 'message-wrapper',
            ],
          );

          break;
      }
    }



    $form['messages'] = [
      '#type' => 'container',
      '#attributes' => ['id' => 'message-wrapper'],
    ];

    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state)
  {

    $value = $form_state->getValue('email');
    if ($value == !\Drupal::service('email.validator')->isValid($value)) {
      $form_state->setErrorByName('subtype', t('The email address %mail is not valid', array('%subtype' => $value)));

      return;
    }

  }

  /**
   * @param array              $form
   * @param FormStateInterface $form_state
   */
  public function submitForm(array &$form, FormStateInterface $form_state)
  {

  }


  public function ajaxContainerSubmit(array &$form, FormStateInterface $form_state) {
    $row_array = array(
      'type' => $form_state->getValue('type'),
      'plugin_type' => $form_state->getValue('rows'),
      'uuid' => $form_state->getValue('uuid'),
      'status' => $form_state->getValue('status'),
      'created' => time(),
    );

    // Add row to database
    $conn = Database::getConnection();
    $eid = $conn->insert('shortcode_builder__element')
      ->fields($row_array)
      ->execute();


    // Response
    $response = new AjaxResponse();

    $response->addCommand(new CloseModalDialogCommand( ) );
    $response->addCommand(new AddBuilderElementCommand($eid, $row_array['type'], $row_array['plugin_type'] ));


    return $response;
  }


  public function ajaxModuleSubmit(array &$form, FormStateInterface $form_state) {
    $row_array = array(
      'type' => $form_state->getValue('type'),
      'plugin_type' => $form_state->getValue('subtype'),
      'uuid' => $form_state->getValue('uuid'),
      'status' => $form_state->getValue('status'),
      'created' => time(),
    );

    // Add row to database
    $conn = Database::getConnection();
    $eid = $conn->insert('shortcode_builder__element')
      ->fields($row_array)
      ->execute();


    // Response
    $response = new AjaxResponse();

//    $response->addCommand(new OpenModalDialogCommand( $form_state->getValue('subtype') . " Widget Configuration Form", array("#markup" => $eid), array("dialogClass"=>"shortcode-modal") ));
    $response->addCommand(new CloseModalDialogCommand( ) );
    $response->addCommand(new AddBuilderElementCommand($eid, $row_array['type'], $row_array['plugin_type'] ));


    return $response;
  }

}
