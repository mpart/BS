

var sortorder 	 = "atstart";
var querystr  	 = "";
var querybaseurl = "http://127.0.0.1/cgi/books.php?";
//var querybaseurl = "http://users.metropolia.fi/~jounilaa/php/books.php?";
var originalbaseurl = "http://www.worldcat.org/webservices/catalog/search/worldcat/sru?";
var xhttp;
var showdebug = false;

var baseref = document.getElementsByTagName("BASE")[0]; 
if( ! baseref ){
	baseref = document.createElement("BASE"); 
}
//baseref.setAttribute( "href", "http://users.metropolia.fi/~jounilaa/prj/" ); 
baseref.setAttribute( "href", "http://127.0.0.1/prj/" ); // viimeinen '/' oltava

function tag_wc_debug_switch( ){
}
function wc_debug_switch( ){
	// Set debug on->off or off->on
	if(showdebug==false){
	 	showdebug=true;
		document.getElementById("debug_table").style.visibility = "visible";
	}else{
		showdebug=false;
		document.getElementById("debug_table").style.visibility = "collapse";
	}
}

function tag_wc_debug_text( dtext ){
}
function wc_debug_text( dtext ){
	if(dtext!=""){
		document.getElementById("debug").innerHTML += "<BR>"+dtext; // debug
	}
	if(showdebug==true)
		document.getElementById("debug_table").style.visibility = "visible";
}

function wc_data_document_ready(){
	// Called from wc_representation.js (document ready function)

	wc_init();

	$('#querybutton').bind( "click", function() { // bind < JS 1.7
		wc_form_query();
	});
	$('#linknext').bind( "click", function() { // bind < JS 1.7
		wc_get_next_results_query();
	});
	$('#linkprevious').bind( "click", function() { // bind < JS 1.7
		wc_get_previous_results_query();
	});
	$('#linkresults').bind( "click", function() { // bind < JS 1.7
		wc_form_query();
	});

}

function wc_init(){
	sortorder="atstart";
	querystr="";
	document.getElementById("debug_table").style.visibility = "collapse";
}

function wc_sortorder( inputid ){

	if( sortorder==="atstart" ){
		if( inputid=="authorname" ){
			document.getElementById("isort").value = "Author";
			sortorder="Author";
			wc_debug_text( " 11 sortorder=[" + sortorder + "] " ) ; // debug
		}else if( inputid=="title" ){
			document.getElementById("isort").value = "Title";
			sortorder="Title";
			wc_debug_text( " 22 sortorder=[" + sortorder + "] " ); // debug
		}
	}
	wc_debug_text( "SORTORDER inputid=[" + inputid + "] sortorder=[" + sortorder + "] " ); // debug

}
function wc_form_query(){
	querystr = "query=";
	var itxt = "";
	var ifields = [ "title", "authorname", "subject", "isbn", "q" ];
	var indx=0;

	for(indx=0; indx<ifields.length; ++indx){
		itxt = document.getElementById( ifields[indx] ).value ;
		if( itxt!="" ){
			if( querystr!="query=" )
				querystr += "+AND+"
			switch( ifields[indx] ){
				case "title":
					querystr += "srw.ti+all+\"" + itxt + "\"" ;
					break;
				case "authorname":
					querystr += "srw.au+all+\"" + itxt + "\"" ;
					break;
				case "subject":
					querystr += "srw.su+all+\"" + itxt + "\"" ;
					break;
				case "isbn":
					querystr += "srw.bn+all+\"" + itxt + "\"" ;
					break;
				case "q":
					querystr += "srw.kw+all+\"" + itxt + "\"" ;
					break;
				default:
					break;
			}
		}
	}

	querystr += "&";

	wc_add_form_hidden_inputs();

	wc_populate_result_table();
}

function wc_add_form_hidden_inputs(){
	var indx=0;
	var atxt="";
	var iname = [ "operation", "version", "sortKeys", "recordPacking", "startRecord", "maximumRecords", "recordSchema", "wskey" ];

	for(indx=0; indx<iname.length; ++indx){	
		if( document.getElementsByName( iname[indx] ).length > 0 ){
		atxt = document.getElementsByName( iname[indx] )[0].value ;
		if( atxt!="" )
			querystr += iname[indx] + "=" + atxt + "&";
		}
	}
}

function wc_get_xhttp_status( obj ){
	if(obj.readyState == 0) {
		wc_show_progress( 10 );
		wc_debug_text( "Sending request ... status="+obj.status ); }
	if(obj.readyState == 1) { 
		wc_show_progress( 25 );
		wc_debug_text( "Connection established ... status="+obj.status ); }
	if(obj.readyState == 2) { 
		wc_show_progress( 50 );
		wc_debug_text( "Responce received ... status="+obj.status ); }
	if(obj.readyState == 3) { 
		wc_show_progress( 75 );
		wc_debug_text( "Processing responce ... status="+obj.status ); }
	if(obj.readyState == 4){
		wc_show_progress( 100 );
		wc_debug_text( "Responce processed, status=" + obj.status );

		if( obj.getResponseHeader("Contentlen") )
			wc_debug_text( "content length: "+ obj.getResponseHeader("Contentlen") );

		if(obj.status == 200){
			wc_debug_text( "SUCCESS 1" );
			return true;
		}else if(obj.status == 404){
			wc_debug_text( "File not found" );
		}else{
			wc_debug_text( "Error, status: " + obj.status + " (" + obj.statustext + ") " );
		}
		return false;
	}
}

function wc_populate_result_table(){

	var getstr = encodeURI( ""+querybaseurl+""+querystr );

	wc_clear_result_table();

	// eri asia kuin jQuery, ks. http://api.jquery.com/jquery.get/

	if( window.XMLHttpRequest ){
		xhttp = null;
		xhttp = new XMLHttpRequest();
	}else if (window.ActiveXObject){   	// Internet Explorer
		xhttp = null;
		xhttp = new ActiveXObject("Microsoft.XMLHTTP"); // MSXML2.XMLHTTP
	}
	if( xhttp == null ){
		wc_debug_text( "AJAX not usable, XMLHttpRequest or ActiveXObject was not found.");
		return;
	}	

	xhttp.onreadystatechange = wc_parse_responce;

	wc_debug_text( "Original URL: [" + originalbaseurl + "" + querystr + "]");
	wc_debug_text( "URL to open: [" + getstr + "]");
	
	xhttp.open( "GET", getstr,  true);

	xhttp.setRequestHeader("Connection","close");

	xhttp.send(null);
}

function wc_parse_responce( ){

// records -> record -> recordData -> oclcdcs -> 
// ISBN: <dc:identifier>
// Title: <dc:title>
// Author: ei sisally hakuun, selitekentassa, haettava ISBN-numerolla erikseen jolloin sijainti tulee mukaan?
//         lahin creator: <dc:creator> (jos loytyy) http://dublincore.org/documents/usageguide/elements.shtml
// Subject: monta <dc:subject>
// Relation: <dc:relation>
// "numberOfRecords"
// "nextRecordPosition"

// OCLCID: record -> recordData -> oclsdcs -> oclcterms:recordIdentifier

	//wc_remove_progress( );

	if( wc_get_xhttp_status( xhttp ) ){

		wc_clear_result_table( );
		
		var xmlresponce = xhttp.responseXML;
		if(xmlresponce==null){
			wc_remove_progress( );
			wc_debug_text("xmlresponce was null");
			return;
		}
		var records = xmlresponce.getElementsByTagName( "record" );
		var recordstotal = xmlresponce.getElementsByTagName( "numberOfRecords" );
		var indx = 0; var undx = 0;
		var title = "" ; var identifier = "";
		var author = ""; var ridentifier;
		var oclcid = "";
		var rauthor;
		var recnum = 0;
		var recnum2 = 0;

		if( ! records || ! recordstotal || ! recordstotal[0] || records.length==0 ){
			wc_debug_text("No results (records or recordstotal[0] was null or length was zero).");
			wc_add_result_row( 0, "<!-- IDENTIFIER --><H5><CENTER> No results. </CENTER></H5>", "", "" );
			document.getElementById( "searchresultstext" ).innerHTML = "0 .";
			return;
		}

		// Records numbers
		recnum = Number( document.getElementsByName( "startRecord" )[0].value );
		recnum2 = recnum + Number( records.length ) - 1;
		if( Number( records.length ) > 0)
			document.getElementById( "searchresultstext" ).innerHTML = recnum + "-" + recnum2 + " / " + recordstotal[0].textContent + " .";
		else
			document.getElementById( "searchresultstext" ).innerHTML = "0 .";

		for( indx=0; indx<records.length; ++indx){
			title = records[indx].getElementsByTagName( "dc:title" );
			var rauthor = records[indx].getElementsByTagName( "dc:creator" );
			for(undx=0; undx<rauthor.length; ++undx)
				author += rauthor[undx].textContent + " "; // + a loop to search every authoR, VIELA JOKA AUTHOR
			ridentifier = records[indx].getElementsByTagName( "dc:identifier" );
			for(undx=0; undx<ridentifier.length; ++undx)
				identifier += ridentifier[undx].textContent + " "; 
			ridentifier = records[indx].getElementsByTagName( "oclcterms:recordIdentifier" );
			if( ridentifier[0] )
				oclcid = ridentifier[0].textContent;
			if( title[0]!="" )
				wc_add_result_row( indx, title[0].textContent, author, identifier, oclcid );
			
			title=""; author=""; identifier="";
		}

		//if(records.length==0)
		//	wc_add_result_row( ); // tyhja

		//document.getElementById("test").innerHTML = xhttp.responseXML;
		wc_debug_text("SUCCESS");
	}
}

function wc_add_result_row( indx, titletxt, authortxt, isbntxt, oclcid ){
	var isbnlist = "";
	var rtable = document.getElementById("result_table");
	var rrow = rtable.insertRow(indx);
	if( !rrow ){
		wc_debug_Text("Could not insert a row.");
		return;
	}
	rrow.setAttribute("class","result_table");
	$("link[#wc_css]").attr({href : "bs.css"}); // reload

	var rcol1 = rrow.insertCell(0);
	var rcol2 = rrow.insertCell(1);
	var resulttxt = "<H5>\"" + titletxt + "\"";
	if( authortxt!="" )
		resulttxt = resulttxt + "<SPAN>, " + authortxt + "   </SPAN>";
	if( isbntxt!="" ){ // match palauttaa pilkuilla erotellun listan
		isbnlist = wc_search_isbn( isbntxt );
		resulttxt = resulttxt + "<BR><SPAN><SMALL><BR> ISBN: " + isbnlist + "<SMALL></SPAN>";
	}
	resulttxt = resulttxt + "</H5>";

	if( titletxt.search("IDENTIFIER") != 5 ){
		rcol1.innerHTML = resulttxt;
		rcol2.innerHTML = "<SPAN id=\""+indx+"\" class=\"lineselectortext\"> location </SPAN><DIV class=\"lineselectorsymbol\">&#x21BB;</DIV>";
	}else{
		rcol1.innerHTML = titletxt;
	}

	wc_get_location_code( indx, isbntxt, oclcid, titletxt, authortxt );
	
}

function wc_get_location_code( indx, isbntxt, oclcid, title, author ){
	var strictisbn = "";
	strictisbn = wc_search_isbn( isbntxt, oclcid );
        $("#"+indx).bind( "click", function() { // bind < JS 1.7
                //wc_location_query( strictisbn, oclcid, title, author );
                wc_location_query( isbntxt, oclcid, title, author );
        });
}

function old_wc_clear_resulttable(){
	var rtable = document.getElementById("result_table");
	var rowcount = rtable.rows.length;
	var indx=0;
	for(indx=0; indx<rowcount; ++indx){
		rtable.deleteRow( indx );
	}
}

// ei viela kokeiltu 26.10.2014
//
function wc_search_isbn( text ){ 
	// s. 8 "User manual"
	// ISBN 978-0-571-08989-5
	// ISBN 978 0 571 08989 5 (The use of hyphens or spaces has no lexical significance and is purely to enhance readability.)
	// Prefix element - 3
	// Registration group element - 1..5
	// Registrant element - 1..7
	// Publication element - 1..6
	// Check digit - 1
	// Tarkistussumman lasku:
	// 	S1 = Summa( 1. x1 2. x3 3. x1 ... ) / 10 josta jakojaannos
	// 	jos S1 on 0, tarkistussumma on 0
	//	S2 = 10 - S1
	//	S2 on tarkistussumma
	// https://www.isbn-international.org/content/isbn-users-manual    (ja http://www.isbn.org)
	var regtxt = "([0-9]{1,3}[ -]?[0-9]{1,5}[ -]?[0-9]{1,7}[ -]?[0-9]{1,6}[ -]?[0-9]{1}?[ \x09\x08\n\r\t])+"; 
	return wc_search_regexp( regtxt, text );
}
function wc_search_regexp( regtxt, text ){
	if( text!="" ){
                var reg = new RegExp( regtxt, "g" );
		var resulttxt = "";
		var indx=0;
		//reg.lastindex = lastindx; 
		reg.lastindex = 0; 
                var result = reg.exec( text ); 
		if(result==null){
			return "ISBN not found in record";
		}else{
			for(indx=0; indx<result.length ; indx++){ // Every group
				wc_debug_text( "RegExp exec result "+indx+". ["+result[ indx ]+"]" );
				if( indx>0 )
					resulttxt += ", ";
				resulttxt += result[ indx ];
			}
                        return resulttxt;
		}
        }
        return false;
}
function wc_search_issn( text ){
	// http://www.issn.org/understanding-the-issn/what-is-an-issn/
	// acronym ISSN followed by two groups of four digits, separated by a hyphen. The eighth digit is a check digit calculated according to a 
	// modulus 11 algorithm on the basis of the 7 preceding digits; this eighth control digit may be an “X” if the result of the computing is 
	// equal to “10”, in order to avoid any ambiguity.
        var regtxt = new RegExp( "[0-9]{4}[ -]?[0-9|X]{4}[ \x09\x08\n\r\t]" );
	return wc_search_regexp( regtxt, text );
}

function wc_get_location_prompt( ){
	return prompt("Enter location", "");
}

function old_wc_clear_result_table( ){
	var tbl = document.getElementById("result_table");
	var indx = 0;
	if( !tbl )
		return;
	var tbllen = tbl.rows.length;
	wc_debug_text("wc_clear_result_table rowcount: " + tbllen );
	if( !tbllen )
		return;
	for(indx=(tbllen-1); indx>=0; --indx)
		tbl.deleteRow( indx );
}

function wc_get_next_results_query( ){
	var num = Number( document.getElementsByName( "startRecord" )[0].value );
	document.getElementsByName( "startRecord" )[0].value = num + Number( document.getElementsByName( "maximumRecords" )[0].value );
	wc_form_query();
}
function wc_get_previous_results_query( ){
	var num = Number( document.getElementsByName( "startRecord" )[0].value );
	document.getElementsByName( "startRecord" )[0].value = num - Number( document.getElementsByName( "maximumRecords" )[0].value );
	if( Number( document.getElementsByName( "startRecord" )[0].value ) < 0 )
		document.getElementsByName( "startRecord" )[0].value = 0;
	wc_form_query();
}

