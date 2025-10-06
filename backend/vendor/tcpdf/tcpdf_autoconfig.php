<?php
//============================================================+
// File name   : tcpdf_autoconfig.php
// Begin       : 2008-06-11
// Last Update : 2010-01-27
//
// Description : TCPDF autoconfiguration file.
//               Automatically loads the right configuration
//               for the current environment.
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * TCPDF autoconfiguration file.
 * Automatically loads the right configuration for the current environment.
 * @package com.tecnick.tcpdf
 * @author Nicola Asuni
 * @version 1.0.001
 */

// Automatically set configuration based on environment
if (!defined('K_TCPDF_EXTERNAL_CONFIG')) {
	
	// Detect if we are running from CLI
	if (php_sapi_name() == 'cli') {
		// CLI environment
		define('K_TCPDF_EXTERNAL_CONFIG', true);
		define('K_PATH_MAIN', dirname(__FILE__).'/');
		define('K_PATH_URL', dirname(__FILE__).'/');
		define('K_PATH_FONTS', K_PATH_MAIN.'fonts/');
		define('K_PATH_CACHE', K_PATH_MAIN.'cache/');
		define('K_PATH_URL_CACHE', K_PATH_URL.'cache/');
		define('K_PATH_IMAGES', K_PATH_MAIN.'images/');
		define('K_PATH_URL_IMAGES', K_PATH_URL.'images/');
		define('K_BLANK_IMAGE', K_PATH_IMAGES.'_blank.png');
		define('PDF_PAGE_FORMAT', 'A4');
		define('PDF_PAGE_ORIENTATION', 'P');
		define('PDF_CREATOR', 'TCPDF');
		define('PDF_AUTHOR', 'TCPDF');
		define('PDF_UNIT', 'mm');
		define('PDF_MARGIN_HEADER', 5);
		define('PDF_MARGIN_FOOTER', 10);
		define('PDF_MARGIN_TOP', 27);
		define('PDF_MARGIN_BOTTOM', 25);
		define('PDF_MARGIN_LEFT', 15);
		define('PDF_MARGIN_RIGHT', 15);
		define('PDF_FONT_NAME_MAIN', 'helvetica');
		define('PDF_FONT_SIZE_MAIN', 10);
		define('PDF_FONT_NAME_DATA', 'helvetica');
		define('PDF_FONT_SIZE_DATA', 8);
		define('PDF_FONT_MONOSPACED', 'courier');
		define('PDF_IMAGE_SCALE_RATIO', 1.25);
		define('HEAD_MAGNIFICATION', 1.1);
		define('K_CELL_HEIGHT_RATIO', 1.25);
		define('K_TITLE_MAGNIFICATION', 1.3);
		define('K_SMALL_RATIO', 2/3);
		define('K_THAI_TOPCHARS', true);
		define('K_USE_CORE_FONTS', false);
		define('K_TIMEZONE', 'UTC');
	} else {
		// Web environment - use the config file
		require_once(dirname(__FILE__).'/config/tcpdf_config.php');
	}
}

//============================================================+
// END OF FILE
//============================================================+
