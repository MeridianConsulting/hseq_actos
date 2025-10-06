<?php
//============================================================+
// File name   : tcpdf_config.php
// Begin       : 2004-06-11
// Last Update : 2013-05-14
//
// Description : Configuration file for TCPDF.
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
 * Configuration file for TCPDF.
 * @author Nicola Asuni
 * @package com.tecnick.tcpdf
 */

// If you define the constant K_TCPDF_EXTERNAL_CONFIG, all the following settings will be ignored.
// If you use the tcpdf_autoconfig.php, then you can overwrite some values here.

if (!defined('K_TCPDF_EXTERNAL_CONFIG')) {

	// DOCUMENT_ROOT fix for IIS
	if (!isset($_SERVER['DOCUMENT_ROOT']) or empty($_SERVER['DOCUMENT_ROOT'])) {
		if (isset($_SERVER['SCRIPT_FILENAME'])) {
			$_SERVER['DOCUMENT_ROOT'] = str_replace('\\', '/', substr($_SERVER['SCRIPT_FILENAME'], 0, 0-strlen($_SERVER['SCRIPT_NAME'])));
		} elseif (isset($_SERVER['PATH_TRANSLATED'])) {
			$_SERVER['DOCUMENT_ROOT'] = str_replace('\\', '/', substr(str_replace('\\\\', '\\', $_SERVER['PATH_TRANSLATED']), 0, 0-strlen($_SERVER['SCRIPT_NAME'])));
		}	else {
			$_SERVER['DOCUMENT_ROOT'] = '/';
		}
	}

	$k_path_main = dirname(__FILE__).'/../';

	// Automatic calculation for the following K_PATH_MAIN constant
	$k_path_url = $k_path_main; // URL path to tcpdf installation folder (http://www.tcpdf.org)

	/**
	 * Installation path (/var/www/tcpdf/).
	 * By default it is automatically calculated but you can also set it as a fixed string to improve performances.
	 */
	define ('K_PATH_MAIN', $k_path_main);

	/**
	 * URL path to tcpdf installation folder (http://www.tcpdf.org).
	 * By default it is automatically calculated but you can also set it as a fixed string to improve performances.
	 */
	define ('K_PATH_URL', $k_path_url);

	/**
	 * Path for PDF fonts.
	 * By default it is automatically calculated but you can also set it as a fixed string to improve performances.
	 */
	define ('K_PATH_FONTS', K_PATH_MAIN.'fonts/');

	/**
	 * Cache directory for temporary files (full path).
	 */
	define ('K_PATH_CACHE', K_PATH_MAIN.'cache/');

	/**
	 * Cache directory for temporary files (url path).
	 */
	define ('K_PATH_URL_CACHE', K_PATH_URL.'cache/');

	/**
	 * Cache directory for TCPDF images (full path).
	 */
	define ('K_PATH_IMAGES', K_PATH_MAIN.'images/');

	/**
	 * Cache directory for TCPDF images (url path).
	 */
	define ('K_PATH_URL_IMAGES', K_PATH_URL.'images/');

	/**
	 * Backward compatibility
	 */
	define ('K_BLANK_IMAGE', K_PATH_IMAGES.'_blank.png');

	/**
	 * Default page format.
	 */
	define ('PDF_PAGE_FORMAT', 'A4');

	/**
	 * Default page orientation (P=portrait, L=landscape).
	 */
	define ('PDF_PAGE_ORIENTATION', 'P');

	/**
	 * Default creator.
	 */
	define ('PDF_CREATOR', 'TCPDF');

	/**
	 * Default author.
	 */
	define ('PDF_AUTHOR', 'TCPDF');

	/**
	 * Default header title.
	 */
	define ('PDF_HEADER_TITLE', 'TCPDF Example');

	/**
	 * Default header string.
	 */
	define ('PDF_HEADER_STRING', "by Nicola Asuni - Tecnick.com\nwww.tcpdf.org");

	/**
	 * Default image logo.
	 */
	define ('PDF_HEADER_LOGO', '');

	/**
	 * Default image logo width in mm.
	 */
	define ('PDF_HEADER_LOGO_WIDTH', 30);

	/**
	 * Default document unit of measure [pt=point, mm=millimeter, cm=centimeter, in=inch].
	 */
	define ('PDF_UNIT', 'mm');

	/**
	 * Default header margin.
	 */
	define ('PDF_MARGIN_HEADER', 5);

	/**
	 * Default footer margin.
	 */
	define ('PDF_MARGIN_FOOTER', 10);

	/**
	 * Default top margin.
	 */
	define ('PDF_MARGIN_TOP', 27);

	/**
	 * Default bottom margin.
	 */
	define ('PDF_MARGIN_BOTTOM', 25);

	/**
	 * Default left margin.
	 */
	define ('PDF_MARGIN_LEFT', 15);

	/**
	 * Default right margin.
	 */
	define ('PDF_MARGIN_RIGHT', 15);

	/**
	 * Default main font name.
	 */
	define ('PDF_FONT_NAME_MAIN', 'helvetica');

	/**
	 * Default main font size.
	 */
	define ('PDF_FONT_SIZE_MAIN', 10);

	/**
	 * Default data font name.
	 */
	define ('PDF_FONT_NAME_DATA', 'helvetica');

	/**
	 * Default data font size.
	 */
	define ('PDF_FONT_SIZE_DATA', 8);

	/**
	 * Default monospaced font name.
	 */
	define ('PDF_FONT_MONOSPACED', 'courier');

	/**
	 * Ratio used to adjust the conversion of pixels to user units.
	 */
	define ('PDF_IMAGE_SCALE_RATIO', 1.25);

	/**
	 * Magnification factor for titles.
	 */
	define('HEAD_MAGNIFICATION', 1.1);

	/**
	 * Height of cell respect font height.
	 */
	define('K_CELL_HEIGHT_RATIO', 1.25);

	/**
	 * Title magnification respect main font size.
	 */
	define('K_TITLE_MAGNIFICATION', 1.3);

	/**
	 * Reduction factor for small font.
	 */
	define('K_SMALL_RATIO', 2/3);

	/**
	 * Set to true to enable the special procedure used to avoid the overlappind of symbols on Thai language.
	 */
	define('K_THAI_TOPCHARS', true);

	/**
	 * If true enables the possibility to replace TCPDF default fonts with dejavu fonts.
	 */
	define('K_USE_CORE_FONTS', false);

	/**
	 * Default timezone for data functions
	 */
	define('K_TIMEZONE', 'UTC');

} // end of user config

//============================================================+
// END OF FILE
//============================================================+
