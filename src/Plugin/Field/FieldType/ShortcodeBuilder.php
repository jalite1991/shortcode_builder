<?php
/**
 * @file
 * contains Drupal\shortcode_builder\Plugin\Field\FieldType\ShortcodeBuilder
 */

namespace Drupal\shortcode_builder\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Provides a field type of baz
 *
 * @FieldType(
 *   id = "shortcode_builder",
 *   label = @Translation("Shortcode Builder"),
 *   category = @Translation("Custom"),
 *   default_widget = "shortcode_builder_widget",
 *   default_formatter = "shortcode_builder_formatter"
 * )
 */
class ShortcodeBuilder extends FieldItemBase implements FieldItemInterface
{

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition)
  {
    // TODO: Implement schema() method.
    return array(
      'columns' => array(
        'value' => array(
          'type' => 'text',
          'size' => 'big',
        ),
      ),
    );
  }


  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['value'] = DataDefinition::create('string');

    return $properties;
  }


  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $value = $this->get('value')->getValue();
    return $value === NULL || $value === '';
  }
}
