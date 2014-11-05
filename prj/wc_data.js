

var sortorder 	 = "atstart";
var querystr  	 = "";
//var querybaseurl = "http://127.0.0.1/cgi/rvp_reverse_proxy_ssl.php?";
var querybaseurl = "http://users.metropolia.fi/~jounilaa/php/rvp_reverse_proxy_ssl.php?";
var originalbaseurl = "http://www.worldcat.org/webservices/catalog/search/worldcat/sru?";
var xhttp;

var baseref = document.getElementsByTagName("BASE")[0]; 
if( ! baseref ){
	baseref = document.createElement("BASE"); 
}
baseref.setAttribute( "href", "http://users.metropolia.fi/~jounilaa/prj/" ); 

function wc_debug_text( dtext ){
	if(dtext!=""){
		document.getElementById("debug").innerHTML += "<BR>"+dtext; // debug
	}
	document.getElementById("debug_table").style.visibility = "visible";
}

function wc_data_document_ready(){
	// Called from wc_representation.js (document ready function)

	wc_init();

	$('#querybutton').bind( "click", function() { // bind < JS 1.7
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
	if(obj.readyState == 0) { wc_debug_text( "Sending request ... status="+obj.status ); }
	if(obj.readyState == 1) { wc_debug_text( "Connection established ... status="+obj.status ); }
	if(obj.readyState == 2) { wc_debug_text( "Responce received ... status="+obj.status ); }
	if(obj.readyState == 3) { wc_debug_text( "Processing responce ... status="+obj.status ); }
	if(obj.readyState == 4){

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

function wc_parse_responce(){

// records -> record -> recordData -> oclcdcs -> 
// ISBN: <dc:identifier>
// Title: <dc:title>
// Author: ei sisally hakuun, selitekentassa, haettava ISBN-numerolla erikseen jolloin sijainti tulee mukaan?
//         lahin creator: <dc:creator> (jos loytyy) http://dublincore.org/documents/usageguide/elements.shtml
// Subject: monta <dc:subject>
// Relation: <dc:relation>
// "numberOfRecords"
// "nextRecordPosition"

	if( wc_get_xhttp_status( xhttp ) ){
		
		var xmlresponce = xhttp.responseXML;
		if(xmlresponce==null)
			wc_debug_text("xmlresponce was null");
		var records = xmlresponce.getElementsByTagName( "record" );
		var recordstotal = xmlresponce.getElementsByTagName( "numberOfRecords" );
		var indx = 0; var undx = 0;
		var title = "" ; var identifier = "";
		var author = ""; var ridentifier;
		var rauthor;

		document.getElementById( "searchresultstext" ).innerHTML = records.length + " / " + recordstotal[0].textContent + " .";

		for( indx=0; indx<records.length; ++indx){
			title = records[indx].getElementsByTagName( "dc:title" );
			var rauthor = records[indx].getElementsByTagName( "dc:creator" );
			for(undx=0; undx<rauthor.length; ++undx)
				author += rauthor[undx].textContent + " "; // + a loop to search every authoR, VIELA JOKA AUTHOR
			ridentifier = records[indx].getElementsByTagName( "dc:identifier" );
			for(undx=0; undx<ridentifier.length; ++undx)
				identifier += ridentifier[undx].textContent + " "; 
			if( title[0]!="" )
				wc_add_result_row( indx, title[0].textContent, author, identifier );
			
			title=""; author=""; identifier="";
		}
		//document.getElementById("test").innerHTML = xhttp.responseXML;
		wc_debug_text("SUCCESS");
	}
}

function wc_add_result_row( indx, titletxt, authortxt, isbntxt ){
	var rtable = document.getElementById("result_table");
	var rrow = rtable.insertRow(indx);
	var rcol1 = rrow.insertCell(0);
	var rcol2 = rrow.insertCell(1);
	var resulttxt = "<HR class=\"resulthr\"><P>" + titletxt + "</P>";
	if( authortxt!="" )
		resulttxt = resulttxt + "<SPAN> Author:" + authortxt + "   </SPAN><BR>";
	resulttxt = resulttxt + "<SPAN> ISBN: " + isbntxt + "</SPAN>";
	rcol1.innerHTML = resulttxt;
	rcol2.innerHTML = "<SPAN id=\""+indx+"\" class=\"lineselectortext\"> location </SPAN><DIV class=\"lineselectorsymbol\">&#x21BB;</DIV>";
}

function wc_clear_resulttable(){
	var rtable = document.getElementById("result_table");
	var rowcount = rtable.rows.length;
	var indx=0;
	for(indx=0; indx<rowcount; ++indx){
		rtable.deleterow( indx );
	}
}

// ei viela kokeiltu 26.10.2014
//
function wc_search_isbn( text ){ 
	if( text!="" ){
		var reg = new RegExec( "^(97(8|9))?\d{9}(\d|X)$" ); 
		var result = reg.test( text );
		if(result==true)
			return true;
		else
			return false;
	}
	return false;
}
