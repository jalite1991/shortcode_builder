<?php
/**
 * @file
 * contains Drupal\shortcode_builder\Plugin\Field\FieldWidget\ShortcodeBuilderDefaultWidget
 */

namespace Drupal\shortcode_builder\Plugin\Field\FieldWidget;


use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Field\WidgetBaseInterface;
use Drupal\Core\Form\FormStateInterface;

use \Drupal\Core\Url;
use Drupal\Component\Serialization\Json;


/**
 * @FieldWidget(
 *   id = "shortcode_builder_widget",
 *   label = @Translation("Shortcode Builder Widget"),
 *   field_types = {
 *     "shortcode_builder",
 *     "text_long",
 *   }
 * )
 */
class ShortcodeBuilderDefaultWidget extends WidgetBase implements WidgetBaseInterface
{

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state)
  {

    $element['#attached']['library'][] = 'shortcode_builder/edit_page';

    $element['builder'] = $element + array(
      '#markup' => '<div id="bfb-builder" class="builder bfb-wrapper" data-bfb-value="0"></div>',
      '#allowed_tags' => ['div'],
    );

    $element['value'] = $element + array(
        '#type' => 'textarea',
        '#empty_value' => '',
        '#default_value' => (isset($items[$delta]->value)) ? $items[$delta]->value : NULL,
        '#description' => t('Builder'),
        "#attributes" => [
            "class" => ["textarea-builder"],
          ],
      );

    return $element;
  }
}
