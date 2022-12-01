<?php
/**
 * @file
 * Contains \Drupal\shortcode_builder\Ajax\SlideDownCommand.php
 */

namespace Drupal\shortcode_builder\Ajax;

use Drupal\Core\Ajax\CommandInterface;

// Todo: Correct description
/**
 * An AJAX command for calling the jQuery slideDown() method.
 *
 * The 'insert/after' command instructs the client to use jQuery's after()
 * method to insert the given HTML content after each element matched by the
 * given id.
 *
 * This command is implemented by Drupal.AjaxCommands.prototype.slideDown()
 * defined in ajax_dblog/js/ajax.js.
 *
 * @see http://learn.jquery.com/effects/intro-to-effects/#changing-display-based-on-current-visibility-state
 *
 * @ingroup ajax
 */
class AddBuilderElementCommand implements CommandInterface {

  /**
   * A CSS id string.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var string
   */
  protected $id;

  /**
   * A type.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var string
   */
  protected $type;

  /**
   * A plugin type.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var string
   */
  protected $plugin_type;

  /**
   * Constructs an SlideDownCommand object.
   *
   * @param string $id
   *   A CSS id.
   * @param string|integer $type
   *   A string or number determining how long the animation will run.
   */
  public function __construct($id, $type, $plugin_type = NULL) {
    $this->id = $id;
    $this->type = $type;
    $this->plugin_type = $plugin_type;
  }

  /**
   * Implements Drupal\Core\Ajax\CommandInterface:render().
   */
  public function render() {

    return array(
      'command' => 'addBuilderElement',
      'method' => NULL,
      'id' => $this->id,
      'type' => $this->type,
      'plugin_type' => $this->plugin_type,
    );
  }
}
