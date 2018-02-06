import { OIL_CONFIG } from './constants.js';
import { extend } from './utils';
import { logInfo, logError } from './log';

const defaultConfig = {
  'preview_mode': false,
  'advanced_settings': false,
  'cookie_expires_in_days': 31,
  'privacy_page_url': undefined,
  'label_intro_heading': 'Um euch die besten Inhalte präsentieren zu können, brauchen wir euer Einverständnis',
  'label_later_heading': 'Um euch die besten Inhalte präsentieren zu können, brauchen wir euer Einverständnis',
  'label_intro': undefined,
  'label_intro_start': 'Wir verwenden <a href="//oil.asideas.de/legal/thirdparties.html" target="_blank">Cookies</a>, um unser Angebot zu verbessern und euch maßgeschneiderte Inhalte zu präsentieren. Es ist dafür erforderlich, bei eurem Besuch dem Datenschutz entsprechend bestimmte Informationen zu erheben und ggf. auch an <a href="//oil.asideas.de/legal/companies.html" target="_blank">Partner</a> zu übertragen.',
  'label_intro_end': 'Jetzt Einverständnis erklären:',
  'label_later':  undefined,
  'label_later_start': 'Wir verwenden Cookies, um unser Angebot zu verbessern und euch maßgeschneiderte Inhalte zu präsentieren. Es ist dafür erforderlich, bei eurem Besuch dem Datenschutz entsprechend bestimmte Informationen zu erheben und ggf. auch an Partner zu übertragen. In unseren Datenschutzbestimmungen erfahren Sie, wie Sie Cookies deaktivieren können',
  'label_later_end': 'Jetzt Einverständnis erklären:',
  'label_button_yes_soi': 'Jetzt zustimmen',
  'label_button_yes_poi': 'Global zustimmen',
  'label_button_no': 'Nein, jetzt nicht',
  'label_button_back': 'Zurück',
  'label_button_privacy': 'Mehr erfahren',
  'label_button_advanced_settings': 'Mehr Informationen',
  'label_advanced_settings_heading': 'Bitte wähle eine Datenschutzeinstellung aus:',
  'label_advanced_settings_text': '',
  'label_advanced_settings_essential_title': 'Nur erforderliche Cookies',
  'label_advanced_settings_essential_verbose': 'Diese Cookies sind für die grundlegenden Funktionen der Website erforderlich.',
  'label_advanced_settings_functional_text': 'Funktionelle Cookies',
  'label_advanced_settings_functional_verbose': 'Diese Cookies ermöglichen uns die Analyse der Website-Nutzung, damit wir deren Leistung messen und verbessern können.',
  'label_advanced_settings_advertising_text': 'Marketing-Cookies',
  'label_advanced_settings_advertising_verbose': 'Diese Cookies werden von Werbeagenturen verwendet, um Ihnen Werbung zu unterbreiten, die für Ihre Interessen relevant ist.',
  'poi_activate_poi': false,
  'poi_hub_origin': '',
  'poi_hub_path': '',
  'poi_subscriber_set_cookie': true,
  'oil_ignore': false,
  'poi_group_name': '',
  'persist_min_tracking': true
};

let cachedConfig = null;


/**
 *
 * Get the hub iFrame domain with protocol prefix for the current location
 * @param config - current config
 * @returns {string, null} domain iframe orgin
 */
function getHubDomain(config) {
  if (config[OIL_CONFIG.ATTR_HUB_ORIGIN]) {
    return config[OIL_CONFIG.ATTR_HUB_ORIGIN].indexOf('http') !== -1 ? config[OIL_CONFIG.ATTR_HUB_ORIGIN] : location.protocol + config[OIL_CONFIG.ATTR_HUB_ORIGIN];
  }
  return null;
}


/**
 * Get the hub iFrame URL with protocol prefix for the current location
 * @param config - current config
 * @returns {string, null} complete iframe orgin
 */
function getHubLocation(config) {
  if (config[OIL_CONFIG.ATTR_HUB_ORIGIN] && config[OIL_CONFIG.ATTR_HUB_PATH]) {
    return getHubDomain(config) + config[OIL_CONFIG.ATTR_HUB_PATH];
  }
  return null;
}


/**
 * Merges options or the given element in the following order:
 * - the given defaults
 * - the given options
 * @param options - an object with specific options
 * @param defaults - an object with default options
 * @returns {{}} merged options
 * @function
 */
export function mergeOptions(options, defaults) {
  defaults = defaults || {};
  options = options || {};
  let merged = extend(true, {}, defaults, options);
  logInfo('Got the following merged config:', merged);
  return merged;
}


/**
 * Read configuration of component from JSON script block
 * @param configurationElement - DOM config element
 * @returns {{}} extracted configuration as JSON
 * @function
 */
export function readConfiguration(configurationElement) {
  let parsedConfig = null;
  try {
    if (configurationElement && configurationElement.text) {
      parsedConfig = JSON.parse(configurationElement.text);
      // normalize path and origin with protocol prefix
      parsedConfig[OIL_CONFIG.ATTR_HUB_ORIGIN] = getHubDomain(parsedConfig);
      parsedConfig[OIL_CONFIG.ATTR_HUB_LOCATION] = getHubLocation(parsedConfig);
      logInfo('Got the following parsed config', parsedConfig);
    }
  } catch (errorDetails) {
    logError('Error during passing configuration', errorDetails);
  }
  return mergeOptions(parsedConfig, defaultConfig);
}


/**
 * Get OIL configuration from HTML document
 * @returns Object parsed config
 */
export function getConfiguration() {
  if (!cachedConfig) {
    let configurationElement = document.querySelector('script[type="application/configuration"]#oil-configuration');
    if (configurationElement === null) {
      logInfo('No configuration script found, using default values');
    }
    cachedConfig = readConfiguration(configurationElement);
  }
  return cachedConfig;
}

/**
 * Checks if POI is activated.
 * @returns {*}
 */
export function isPoiActive() {
  cachedConfig = getConfiguration();
  let result = cachedConfig[OIL_CONFIG.ATTR_ACTIVATE_POI];
  return result ? result : false;
}

/**
 * Checks if POI set SOI is activated.
 * @returns {*}
 */
export function isSubscriberSetCookieActive() {
  cachedConfig = getConfiguration();
  let result = cachedConfig[OIL_CONFIG.ATTR_SUB_SET_COOKIE];
  return result ? result : false;
}

/**
 * Checks if PreviewMode is activated.
 * @returns {*}
 */
export function isPreviewMode() {
  cachedConfig = getConfiguration();
  let result = cachedConfig[OIL_CONFIG.ATTR_PREVIEW_MODE];
  return result ? result : false;
}

/**
 * Reset configuration, reread from HTML.
 */
export function resetConfiguration() {
  cachedConfig = null;
}
