var sortorder	= "atstart";
var xhttp;
var showdebug 	= false;
var querystr	= "";

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
	if(showdebug==false){
		document.getElementById("debug_table").style.visibility = "collapse";
		return;
	}
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

	if( document.getElementsByName("startRecord") && document.getElementsByName("startRecord").length>0 )
		document.getElementsByName("startRecord")[0].value=1;
	if( document.getElementsByName("maximumRecords") && document.getElementsByName("maximumRecords").length>0 )
		document.getElementsByName("maximumRecords")[0].value=5;

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
	var iname = [ "operation", "version", "sortKeys", "recordPacking", "startRecord", "maximumRecords", "recordSchema", "wskey" ]; // , "stylesheet" ];

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
		wc_debug_text("new XMLHttpRequest");
	}else if (window.ActiveXObject){   	// Internet Explorer
		xhttp = null;
		xhttp = new ActiveXObject("Microsoft.XMLHTTP"); // MSXML2.XMLHTTP
		wc_debug_text("new ActiveXObject");
	}
	if( xhttp == null ){
		wc_debug_text( "XMLHttpRequest or ActiveXObject was not found.");
		return;
	}

	xhttp.onreadystatechange = wc_parse_responce;

	wc_debug_text( "Original URL: [" + originalbaseurl + "" + querystr + "]");
	wc_debug_text( "URL to open: [" + getstr + "]");
	wc_debug_text( "<A href=\"" + getstr + "\"> Link to data </A>");
	
	xhttp.open( "GET", getstr,  true);

	//xhttp.setRequestHeader("Connection","close");
	wc_debug_text( "After setRequestHeader");

	xhttp.send(null);
	wc_debug_text( "After xhttp.send");
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
// recordIdentifier might be in form: "sc <OCLCID>" for example, to be checked 

	//wc_remove_progress( );

	//wc_debug_text( "wc_parse_responce called");

	if( wc_get_xhttp_status( xhttp ) ){

		wc_debug_text( "wc_parse_responce: going to wc_clear_result_table");

		wc_clear_result_table( );
		
		var xmlresponce = xhttp.responseXML;
		if(xmlresponce==null){
			wc_remove_progress( );
			wc_debug_text("xmlresponce was null");
			return;
		}
		var records = xmlresponce.getElementsByTagName( "record" );
		var recordstotal = xmlresponce.getElementsByTagName( "numberOfRecords" ); // toimiva seka Chromessa ett?? Firefoxissa, myos Androidin oletusselaimella
		var indx = 0; var undx = 0;
		var title = "" ; var identifier = "";
		var author = ""; var ridentifier;
		var oclcid = "";
		var rauthor; var rtitle;
		var recnum = 0;
		var recnum2 = 0;
		
		// Chrome
		var tmpElem1 = ["", ""];
		var tmpElem2 = ["", ""];


		if( ! records || ! recordstotal || ! recordstotal[0] || records.length==0 ){
			var descriptiontxt = "<!-- IDENTIFIER --><H5><CENTER> No results. </CENTER></H5>";
			wc_debug_text("No results (records or recordstotal[0] was null or length was zero).");
			document.getElementById( "searchresultstext" ).innerHTML = "0 .";
			wc_show_error_responce_message( descriptiontxt, xmlresponce );
			return;
		}

		// Records numbers 
		recnum = Number( document.getElementsByName( "startRecord" )[0].value ); 
		recnum2 = recnum + Number( records.length ) - 1;
		if( Number( records.length ) > 0 && recordstotal!=null && recordstotal[0]!=null)
			document.getElementById( "searchresultstext" ).innerHTML = recnum + "-" + recnum2 + " / " + recordstotal[0].childNodes[0].nodeValue + " .";// + recordstotal[0].textContent + " ."; // toimiva joka selaimessa
		else if( Number( records.length ) > 0 )
			document.getElementById( "searchresultstext" ).innerHTML = recnum + "-" + recnum2;
		else
			document.getElementById( "searchresultstext" ).innerHTML = "0 .";

		for( indx=0; indx<records.length; ++indx){
			wc_debug_text( "wc_parse_responce: record "+indx+".");
			// Vastauksessa:
			// searchRetrieveResponse -> records -> record -> recordData -> oclcdcs -> dc:title   18.11.2014
			// XML :dc Namespace: http://purl.org/dc/elements/1.1/ -> http://dublincore.org/documents/2012/06/14/dcmi-terms/?v=elements
			// http://www.w3schools.com/xml/xml_doctypes.asp
			// #1 The first rule, for a valid XML document, is that it must be well formed (see previous paragraph).
			// #2 The second rule is that a valid XML document must conform to a document type.
			// Namespace:
			// root=searchRetrieveResponse
			// -> <dc:contributor>
			// -> <dc:identifier>
			// -> <dc:title>

			
			if( records==null )
				wc_debug_text( "wc_parse_responce: records was null.");
			if( records[indx]==null )
				wc_debug_text( "wc_parse_responce: record at "+indx+" was null.");
			if( records[indx].textContent=="" ){
				wc_debug_text( "wc_parse_responce: record at "+indx+" was empty.");
				continue;
			}
			
			// namespace pois !! -> toimii myos Chromessa
			if( navigator.userAgent.indexOf("Firefox") != -1 ) { // "Chrome" "Opera" "Firefox" "MSIE"
				rtitle = records[indx].getElementsByTagName( "dc:title" );
			}else{
				rtitle = records.item(indx).getElementsByTagName( "title" ); 
			} // .attributes.getNamedItem("attribuutti");

			wc_debug_text( "$.browser="+$.browser );

			if(rtitle==null || rtitle[0]==null){
				wc_debug_text( "wc_parse_responce: rtitle was null.");
				continue;
			}else	
				title = rtitle[0].childNodes[0].nodeValue;
			if(title=="")
				wc_debug_text( "wc_parse_responce: title was empty.");
			if(rtitle.length==0)
				wc_debug_text( "wc_parse_responce: rtitle length was zero.");
			var rauthor;
			if( navigator.userAgent.indexOf("Firefox") != -1 ) { 
				rauthor = records[indx].getElementsByTagName( "dc:creator" );
			}else{
				rauthor = records[indx].getElementsByTagName( "creator" );
			}
			if(rauthor==null)
				wc_debug_text( "wc_parse_responce: rauthor was null.");
			for(undx=0; undx<rauthor.length; ++undx)
				author += rauthor[undx].childNodes[0].nodeValue + " "; // + a loop to search every authoR, VIELA JOKA AUTHOR
			if( navigator.userAgent.indexOf("Firefox") != -1 ) { 
				ridentifier = records[indx].getElementsByTagName( "dc:identifier" );
			}else{
				ridentifier = records[indx].getElementsByTagName( "identifier" );
			}
			if(ridentifier==null)
				wc_debug_text( "wc_parse_responce: ridentifier was null.");
			for(undx=0; undx<ridentifier.length; ++undx)
				identifier += ridentifier[undx].childNodes[0].nodeValue + " "; 
			if( navigator.userAgent.indexOf("Firefox") != -1 ) { 
				ridentifier = records[indx].getElementsByTagName( "oclcterms:recordIdentifier" );
			}else{
				ridentifier = records[indx].getElementsByTagName( "recordIdentifier" ); // KORJAUS 26.11.2014
			}
			if( ridentifier && ridentifier[0] ){
				oclcid = ridentifier[0].childNodes[0].nodeValue;
				wc_debug_text( "wc_data: oclcid was [" + oclcid + "]" );
			}
			if( title!=null && title[0]!=null )
				wc_add_result_row( indx, title, author, identifier, oclcid );
			
			wc_debug_text( "indx="+indx+" author="+author );
			
			title=""; author=""; identifier="";
		}

		wc_debug_text("SUCCESS");
	}else{
		if(xhttp.readyState == 4){
			wc_show_error_responce_message( "No records were found." , null );
		}
	}
}

function wc_add_result_row( indx, titletxt, authortxt, isbntxt, oclcid ){
	var isbnlist = "";
	var rtable = document.getElementById("result_table");
	var rrow = rtable.insertRow(indx);

	wc_debug_text( "wc_add_result_row" );

	if( !rrow ){
		wc_debug_Text("Could not insert a row.");
		return;
	}
	rrow.setAttribute("class","result_table");
	$("link#wc_css").attr({href : "bs.css"}); // reload

	var rcol1 = rrow.insertCell(0);
	var rcol2 = rrow.insertCell(1);
	var resulttxt = "<H5>\"" + titletxt + "\"";
	if( authortxt!="" )
		resulttxt = resulttxt + "<SPAN>, " + authortxt + "   </SPAN>";
	else
		wc_debug_text( "wc_add_result_row: authortxt was empty" );

	if( isbntxt!="" ){
		isbnlist = wc_search_isbn( isbntxt );
		resulttxt = resulttxt + "<BR><SPAN><SMALL><BR> ISBN: " + isbnlist + "<SMALL></SPAN>";
	}else
		wc_debug_text( "wc_add_result_row: isbntxt was empty" );

	resulttxt = resulttxt + "</H5>";

	if( titletxt.search("IDENTIFIER") != 5 ){
		rcol1.innerHTML = resulttxt;
		rcol2.innerHTML = "<SPAN id=\""+indx+"\" class=\"lineselectortext\"> location </SPAN><DIV class=\"lineselectorsymbol\">&#x21BB;</DIV>";
		wc_debug_text( "wc_add_result_row: after innerHTML 1" );
	}else{
		rcol1.innerHTML = titletxt;
		wc_debug_text( "wc_add_result_row: after innerHTML 2" );
	}

	wc_get_location_code( indx, isbntxt, oclcid, titletxt, authortxt );
	
}

function wc_get_location_code( indx, isbntxt, oclcid, title, author ){
	var strictisbn = "";
	strictisbn = wc_search_isbn( isbntxt ); 
        $("#"+indx).bind( "click", function() { // bind < JS 1.7
                //wc_location_query( strictisbn, oclcid, title, author );
                wc_location_query( isbntxt, oclcid, title, author );
        });
	wc_debug_text( "wc_get_location_code: oclcid=[" + oclcid + "]" );
	wc_debug_text( "wc_get_location_code" );
}

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
	//var regtxt = "([0-9]{1,3}[ -]?[0-9]{1,5}[ -]?[0-9]{1,7}[ -]?[0-9]{1,6}[ -]?[0-9]{1}?[ \x09\x08\n\r\t])+"; 
	var regtxt = "([0-9]{1,3}[ -]?[0-9]{1,5}[ -]?[0-9]{1,7}[ -]?[0-9]{1,6}[ -]?[0-9]{1}?[ \x09\x08\n\r\t])+?";
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

// Not in use 26.11.2014
function wc_search_issn( text ){
	// http://www.issn.org/understanding-the-issn/what-is-an-issn/
	// acronym ISSN followed by two groups of four digits, separated by a hyphen. The eighth digit is a check digit calculated according to a 
	// modulus 11 algorithm on the basis of the 7 preceding digits; this eighth control digit may be an ???X??? if the result of the computing is 
	// equal to ???10???, in order to avoid any ambiguity.
        var regtxt = new RegExp( "[0-9]{4}[ -]?[0-9|X]{4}[ \x09\x08\n\r\t]" );
	return wc_search_regexp( regtxt, text );
}

function wc_get_location_prompt( ){
	return prompt("Enter location", "");
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
function wc_show_error_responce_message( desctxt, xmlresponce ){
	// -> <diagnostics> -> <diagnostic> -> 	<message>
	//					<uri>
	//					<details>
	if( xmlresponce == null ){
		wc_debug_text("wc_show_error_responce_message: xmlresponce was null.");
		wc_debug_text( desctxt );
	   	wc_add_result_location_row( "<CENTER><H5>"+desctxt+"</H5></CENTER>" );
		return;
	}
	wc_debug_text("At wc_show_error_responce_message.");
	var errmessage = xmlresponce.getElementsByTagName( "message" );
	if(errmessage==null || errmessage.length==0 ){
		wc_debug_text("wc_show_error_responce_message: errmessage was null.");
		wc_debug_text( desctxt );
		return;
	}
	var errtxt = errmessage[0].firstChild.nodeValue;
	var errdetails = xmlresponce.getElementsByTagName( "details" );
	if( errdetails!=null && errdetails.length>0 ){
		if( errdetails[0]!=null && errdetails[0].firstChild!=null )
			errtxt += ": " + errdetails[0].firstChild.nodeValue;
	}else{
		wc_debug_text("wc_show_error_responce_message: errdetails==null or errdetails.length<=0 .");
	}
	// Esim. Worldcat API: "General System Error: java.lang.NullPointerException"
	// tai: kirjaa ei ole listattu, paikkaa ei tunneta tms.
	wc_add_result_location_row( "<CENTER><H5>"+desctxt+"</H5><H6>Description:</H6><H5>"+errtxt+"</H5></CENTER>" );
	wc_debug_text( "Description:" + desctxt );
	wc_debug_text( "Diagnostics message:" + errtxt );
}
function wc_add_result_location_row( htmltxt ){
        var rtable = document.getElementById("result_table");
	var rowcount = document.getElementById("result_table").rows.length;
        var rrow = rtable.insertRow(rowcount);
        if( !rrow ){
                wc_debug_Text("Could not insert a row.");
                return;
        }
        rrow.setAttribute("class","result_table");
        $("link#wc_css").attr({href : "bs.css"}); // reload

        var rcol1 = rrow.insertCell(0);
	if( htmltxt!="" )
        	rcol1.innerHTML = htmltxt;
}
