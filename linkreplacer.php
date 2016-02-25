<?php
$str_csvlinks = "/home/pbegley/csvlinks_v2.csv";
$fh = fopen( $str_csvlinks, 'r' );

$csv = fgetcsv( $fh );

$arr_links = array();
while( ( $data = fgetcsv( $fh ) ) !== false ) {
    $arr_link = array(
        'old' => $data[0],
        'new' => $data[2]
    );
    $arr_links[] = $arr_link;
}
fclose($fh);


$arr_files = array();

build_file_list( __DIR__, '.' );
// our file list should be full, start parsing for uservoice urls

foreach( $arr_files as $str_file ) {
    $file = file_get_contents( $str_file );
    foreach( $arr_links as $arr_link ) {
        $file = str_replace( $arr_link['old'], $arr_link['new'], $file );
    }

    if( strpos( strtolower($file), 'klipfolio.uservoice' ) !== false ) {
        var_dump($file);
        die();
    }
    if( strpos( strtolower($file), 'http://https://' ) !== false ) {
        var_dump($file);
        die();
    }
    if( strpos( strtolower($file), 'https://https://' ) !== false ) {
        var_dump($file);
        die();
    }

    $fh = fopen( $str_file, 'w' );
    fwrite( $fh, $file );
    fclose( $fh );
}



function build_file_list( $root, $path ) {
    global $arr_files;
    if( $h = opendir( $root . '/' . $path ) ) {
        while( false !== ($entry = readdir($h) ) ) {
            if ($entry != "." && $entry != "..") {
                if( is_dir( $root . '/' . $entry ) ) {
                    build_file_list( $root . '/' . $entry, '.' );
                }
                else if( strpos( $entry, '.json' ) !== false ) {
                    $file = file_get_contents( $root . '/' . $entry );
                    if( strpos( strtolower( $file ), 'uservoice' ) !== false ) {
                        $arr_files[] = $root . '/' . $entry;
                    }
                }
            }
        }
        closedir($h);
    }
}
