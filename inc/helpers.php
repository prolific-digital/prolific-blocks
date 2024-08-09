<?php

/**
 * Add SVG support to the list of allowed mime types for uploads.
 *
 * This function enables the uploading of SVG files by adding the SVG mime type
 * to the list of allowed mime types in WordPress.
 *
 * @param array $upload_mimes An associative array of mime types keyed by the file extension regex corresponding to those types.
 * @return array The modified array of mime types.
 */
function add_svg_to_upload_mimes($upload_mimes) {
  $upload_mimes['svg'] = 'image/svg+xml';
  return $upload_mimes;
}
add_filter('upload_mimes', 'add_svg_to_upload_mimes');
