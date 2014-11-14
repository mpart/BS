<?php

	/*
	 * Copyright jounilaa 24.9.2014 - 19.10.2014, 22.10.2014, 7.11.2014. 12.11.2014 @ 
	 *
	 * PHP and extensions needed:
	 * php55-5.5.16                   "PHP Scripting Language"
	 * php55-openssl-5.5.16           SSL, "The openssl shared extension for php"
	 *
	 * File to use HttpRvp -proxy copying cookies in between client and proxyed
	 * server (client browser stores the cookies bypassed through the proxy). 
	 *
	 * ! If cookie - environment variables are set.
	 *
	 * In example proxy-code uses cURL library with default cookie transport
	 * mechanism (not working 18.10.2014), 30.9.2014.
	 */

	error_reporting(E_ALL);

	/*
	 * If defined, HttpRvp removes chunks and returns only one responce instead."); 
	 */
	/* Clearly faster without this setting: */
	define("REMOVECHUNKS", 1); 

	/*
	 * If "true", output debug html instead of headers (garbled output).
	 */
	//define("DEBUG", 1);
	//define("DEBUGFILE", "file.log"); // not working 29.10.2014

	//echo "Otsikkorivi";

	include 'HttpRvp.php';				// ":.:" in path to search php-files
							// unknown error: '/home1-3/j/jounilaa/public_html/php/

	/*
	 * If defined and output is not chunked, counts Content-length: again and
	 * returns the corrent length. STILL IN TEST: 22.10.2014 .
	 */
	//define("REWRITECONTENTLENGTH", 0);
	
	//define( "PRINTNOHEADERS", 0 );
	
	/*
	 * Do not print all headers other than related to MIME (and other HTTP-relevant).
	 */
	//define("CGIENABLE", 0);

	/*
	 * Variables.
 	 *
	 * Do not forget to end the line with \r\n or the connection will be endless.
	 */
	$urlextra = ""; $urlpath=""; $httpextra = ""; $httppostextra = "";
	$appendnametourl = "";
	$uriarray = ["",""];
	$ret = false;

	// to fsockopen: ssl (tls) or none

	// Worldcat
	//$hoststring = 'ssl://www.worldcat.org'; 			// String to use to open the connection with fsockopen
	$hoststring = 'www.worldcat.org'; 				// String to use to open the connection with fsockopen
	$hostname = "www.worldcat.org"; 				// Hostname to attach to HTTP GET/POST requests 
	//$hostport = getservbyname('https', 'tcp');			// Port to establish the connection to
	$urlpath = "/webservices/catalog/content/libraries";
	//$urlextra = "";	// Extra GET variables.
	$urlextra = "wskey=xvIBPSpBwemdHlGsOmjR15cFx7hQ01hyMJ9lXGOfnOE8UFOKnqHwVwF6MQHlwzn3nLrp4iuL6rIomj1s&";
	$hostport = getservbyname('http', 'tcp');			// Port to establish the connection to
	//$httpextra = "Accept: text/xml; text/html\r\n";		// Extra HTTP headers.
	/*
	 * Include headers in request from client, not here. These are not replaced. */
	$httpextra .= "Accept-Charset: charset=iso-8859-1\r\n";		// Extra HTTP headers.
	$httpextra .= "Via: Rvp.php\r\n";
	$httppostextra = ""; // GET is used not POST, extra POST variables
	//$httpextra = "Content-Type: text/xml; charset=iso-8859-1\r\n";	// Extra HTTP headers.
	//$httpextra = "Content-Type: charset=UTF-8\r\n";			// Extra HTTP headers.
	$appendnametourl = "oclcid"; // GET variable whos value is appended to the URL -part before "?"
	/*
	 * Init socket to host.
	 */
	$rvpproxy = new HttpRvp($hoststring, $hostport);

	if( ! $rvpproxy ){
		echo "<!-- Error: new HttpRvp failed. -->";
		exit();
	}


/*	if($_GET){ 
		foreach ($_GET as $key => $value) {
                         echo "Debug get: key=$key value=$value.<BR>";
		}
	}else{
		echo "<H3>No _GET parameters.</H3>";
	}
	if($_REQUEST){
		foreach ($_REQUEST as $key => $value) {
                         echo "Debug request: key=$key value=$value.<BR>";
		}
	}else{
		echo "<H3>No _REQUEST parameters.</H3>";
	}
	if( isset( $_SERVER ) ){
		$ret = $_SERVER[ 'REQUEST_URI' ];
		echo "<H3>_SERVER[ 'REQUEST_URI' ]:"; 
		echo "$ret </H3>";
		$uriarray = explode( "?", $ret, 2 );
		if( count( $uriarray ) > 1 ){
			echo "<BR><BR><H4> $uriarray[1] </H4>";
			$urlextra = $uriarray[1] . $urlextra;
		}
	}
*/

	/*
	 * Proxy request to the remote server and output the result to the client.
	 */
	$ret = $rvpproxy->http_proxy_by_string( $hostname, $httppostextra, $httpextra, $urlpath, $urlextra, $appendnametourl );
	if( ! $ret ){
		echo "<!-- Error: http_proxy_by_string returned $ret . -->";
	}

	/*
	 * Close connection (not necessary, the same in the constructor).
	 */		
	$rvpproxy->close_socket();

	//echo "<DOCTYPE html>";

	unset($rvpproxy);	// Unnecessary before exit.
	
?>