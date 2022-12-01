<?php
/**
 * @file
 * Contains \Drupal\shortcode_builder\WidgetManager.
 */

namespace Drupal\shortcode_builder;


use Drupal\Component\Plugin\Factory\DefaultFactory;
use Drupal\Core\Discovery\YamlDiscovery;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * Provides an Shortcode Module plugin manager.
 *
 * @see Drupal\shortcode_builder\Plugin\WidgetInterface
 * @see Drupal\shortcode_builder\Annotation\Widget
 * @see plugin_api
 */
class WidgetManager extends DefaultPluginManager {

  /**
   * Constructs a WidgetManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct(
      'Plugin/ShortcodeWidget',
      $namespaces,
      $module_handler,
      'Drupal\shortcode_builder\Plugin\WidgetInterface',
      'Drupal\shortcode_builder\Annotation\Widget'
    );
    $this->alterInfo('module_info');
    $this->setCacheBackend($cache_backend, 'module_info_plugins');
  }

  /**
   * Retrieves all defined routes from .bfb_modules.yml files.
   *
   * @return array
   *   The defined routes, keyed by provider.
   */
  protected function getRouteDefinitions() {
    // Always instantiate a new YamlDiscovery object so that we always search on
    // the up-to-date list of modules.
    $discovery = new YamlDiscovery('bfb_modules', $this->moduleHandler->getModuleDirectories());
    return $discovery->findAll();
  }
}
