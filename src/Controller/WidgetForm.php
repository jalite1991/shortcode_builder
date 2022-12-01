<?php

/**
 * Created by PhpStorm.
 * User: jfloyd
 * Date: 3/29/17
 * Time: 1:15 PM
 */

namespace Drupal\shortcode_builder\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenDialogCommand;

class WidgetForm
{

  /**
   * Return details about a specific database log message.
   *
   * @param $method
   *   The method used in the request of this page.
   *
   * @param int $event_id
   *  Unique ID of the database log message.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *  AJAX response of commands for adding to dblog table.
   */
  public function ajaxEventDetails($method, $mid)
  {
    $response = array();
    $redirect = TRUE;

    $form = \Drupal::formBuilder()->getForm('\Drupal\shortcode_builder\Form\WidgetForm', $mid);


    //    return $form->getForm('\Drupal\shortcode_builder\Form\WidgetForm');

    //    // Get url to original event detail page.
    //    $event_url = Url::fromRoute('dblog.event', array('event_id' => $event_id));
    // Using ajax?
    if ($method == 'ajax') {
      //      $redirect = FALSE;
      //      // Get the details of the logged event.
      //      $event = parent::eventDetails($event_id);
      //      // Valid event?
      //      if (!empty($event)) {
      //        // Add link to event detail page to event.
      //        $event_link = Link::fromTextAndUrl($event_url->toString(), $event_url);
      //        $event['dblog_table']['#rows'][] = array(
      //          array('data' => $this->t('Event Log'), 'header' => TRUE),
      //          array('data' => $event_link),
      //        );
      //        // Build render array for event details.
      //        $event_details = array(
      //          '#theme' => 'ajax_dblog_event',
      //          '#event' => $event,
      //          '#event_id' => $event_id,
      //          '#row_id' => 'dblog-event-row-' . $event_id,
      //          '#details_id' => 'dblog-event-details-' . $event_id,
      //        );
      //
      // Create an AjaxResponse.
      $response = new AjaxResponse();
      //        // Remove old event details.
      //        $response->addCommand(new RemoveCommand('.dblog-event-row'));
      //        // Insert event details after event.
      //        $response->addCommand(new HtmlCommand('#edit-field-builder-0-value--description', $form));
      $response->addCommand(new OpenDialogCommand("#shortcode-modal", $mid . " Widget Configuration Form", $form, array("dialogClass" => "shortcode-modal", "modal" => TRUE)));
      //        // Unwrap new row.
      //        $response->addCommand(new InvokeCommand('#' . $event_details['#row_id'],'unwrapEventRow', ['#' . $event_details['#row_id']]));
      //        // SlideDown event details.
      //        $response->addCommand(new SlideDownCommand('#dblog-event-details-' . $event_id));
      //      }
    } else {
      $response = $form;
    }
    //
    //    if ($redirect) {
    //      // Redirect to actual page.
    //      $response = new RedirectResponse($event_url->toString(), 302);
    //    }

    return $response;
  }
}
