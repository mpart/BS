<?php

	/*
	 * Copyright jounilaa 10.11.2014 @ 
	 * 
 	 * Callers IP
	 */

	//echo "content-type: application/javascript; charset=utf-8 \r\n\r\n" ; // Lighttpd without PHP-module
	header("content-type: application/javascript; charset=utf-8"); // Apache

	if($_SERVER)
		if($_SERVER['REMOTE_ADDR'])
			echo "function callers_ip( ){ return \"" . $_SERVER['REMOTE_ADDR'] . "\"; } ";
?>
