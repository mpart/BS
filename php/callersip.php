<?php

	/*
	 * Copyright jounilaa 10.11.2014 @ 
	 * 
 	 * Callers IP
	 */

	//echo "content-type: text/html; charset=utf-8\r\n\r\n" ; // Lighttpd
	header("content-type: text/html; charset=utf-8"); // Apache

	if($_SERVER)
		if($_SERVER['REMOTE_ADDR'])
			echo "function callers_ip( ){ return \"" . $_SERVER['REMOTE_ADDR'] . "\"; } ";
?>
