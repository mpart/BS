// Locations
//var idquerybaseurl = "http://192.168.1.2:8080/cgi/location.php?";
//var idquerybaseurl = "http://127.0.0.1/cgi/location.php?";
var idquerybaseurl = "http://users.metropolia.fi/~jounilaa/php/location.php?";
var idoriginalbaseurl = "http://www.worldcat.org/webservices/catalog/content/libraries";
var idquerypath = "";

// xISBN haku: http://xisbn.worldcat.org/xisbnadmin/doc/api.htm ei löydy
// IP-osoitteella: 
// http://www.oclc.org/developer/develop/web-services/worldcat-registry/sruxsd-interface/openurl-resolver-resource.en.html //

// Esim. "Kun kyyhkyset katosivat"
// http://www.worldcat.org/webservices/catalog/content/libraries/isbn/9789520107819?IP=85.76.13.104&wskey=KEY&


// http://oclc.org/developer/develop/web-services/worldcat-search-api/library-locations.en.html
// http://www.worldcat.org/webservices/catalog/content/libraries/isbn/{ISBN}?ip={IP_Address}
// http://www.worldcat.org/webservices/catalog/content/libraries/issn/{ISSN}?ip={IP_Address}
// http://www.worldcat.org/webservices/catalog/content/libraries/{OCLCID}?ip={IP_Address}
//
// Parametrit:
// ip
// location (esim. "Finland")
// HUOM, JOS GPS:
// lat lon
// libtype
// maximiumLibraries
// format xml|json => XML jos jattaa taman pois
// frbrGrouping default:on	"similar editions"
// wskey
// ?ip= => Ei tunnista suomalaista IPv4-osoitetta, ei edes googlen, location toimii
//
// http://www.worldcat.org/webservices/catalog/content/citations/801954210? HTML snippet
// cformat= apa, chicago, harvard, mla, turabian, or all
//
// http://www.worldcat.org/webservices/catalog/content/{OCLCNumber}
// recordSchema=info%3Asrw%2Fschema%2F1%2Fdc&
// 


function wc_location_document_ready(){
	// Called from wc_representation.js (document ready function)

	idquerypath = "maximumLibraries=5&frbrGrouping=on&";
	//idquerypath = "&maximiumLibraries=5&frbrGrouping=off&";
	//idquerypath = "ip=" + callers_ip() + "&maximiumLibraries=5&format=xml&frbrGrouping=off&";

	wc_debug_text("wc_location_document_ready");

}

function wc_location_query( isbnid, oclcid, title, author ){
	var rowtext="";
	var matchtext = "";
	var location = ""; // IP is not found in every case (localhost or some IP-addresses)
	matchtext = wc_search_isbn( isbnid );
	if( matchtext!=null && matchtext!="" ) {
		//wc_debug_text( "ISBN text array length:" + matchtext.length );
		location = wc_get_location_prompt( "\n ISBN " + matchtext );
	}else{
		location = wc_get_location_prompt( "" );
	}
	wc_clear_result_table( );
	rowtext += "<H4>Locations:</H4>";
	rowtext += "<H5>Title: <I>" + title + "</I></H5>";
	rowtext += "<H5>Author: " + author + "</H5>";
	rowtext += "<H5>ISBN: ";
	isbnid += " ";
	if( matchtext!=null)
		rowtext += matchtext;
	else
		rowtext += "No record.";
	rowtext += "</H5>";
	//rowtext += "<DIV align=\"left\"><BUTTON onclick=\"wc_location_query(";
	rowtext += "<DIV id=\"locationchoice\" class=\"choicetext\" align=\"left\" onclick=\"wc_location_query(";
	rowtext += "'"+ isbnid+"', '"+oclcid+"', '"+title+"', '"+author+"' )\"><H5>Update location</H5></DIV>";
	// rowtext += "</BUTTON></DIV>";
	wc_debug_text( rowtext );
	wc_add_result_location_row( rowtext );

	//$('#locationchoice').bind("click", function() {
	//	wc_location_query( isbnid, oclcid, title, author );
	//});

	document.getElementById( "searchresultstext" ).innerHTML = "1 .";
	wc_parse_locations( oclcid, location );
}
function wc_get_location_prompt( text ){
	var txt = prompt("Enter location " + text, "");
	if( txt.test( "http://" ) )
		txt = "";
        return txt;
}
function wc_parse_locations( oclcid, locationtxt ){

	var qstring  = ""+idquerybaseurl;
	var getidstr = "";
	wc_debug_text("location: ["+locationtxt+"]");
	if( locationtxt!=null && locationtxt != "" )
		qstring += "location="+locationtxt+"&";
	else
		qstring += "ip=" + callers_ip() +"&";
	if(oclcid!="")
		qstring += "oclcid="+ oclcid.trim() +"&";
	qstring += idquerypath;
	getidstr = encodeURI( qstring );

	wc_debug_text("getidstr: " + getidstr + " ." );

	xhttp = null;

        if( window.XMLHttpRequest ){
                xhttp = null;
                xhttp = new XMLHttpRequest();
        }else if (window.ActiveXObject){        // Internet Explorer
                xhttp = null;
                xhttp = new ActiveXObject("Microsoft.XMLHTTP"); // MSXML2.XMLHTTP
        }
        if( xhttp == null ){
                wc_debug_text( "AJAX not usable, XMLHttpRequest or ActiveXObject was not found.");
                return;
        }       

        xhttp.onreadystatechange = wc_parse_location_responce;

        wc_debug_text( "Original URL: [" + idoriginalbaseurl + "/" + oclcid + "?" + idquerypath + "]");
        wc_debug_text( "URL to open: [" + getidstr + "]");
        
        xhttp.open( "GET", getidstr,  true);

        xhttp.setRequestHeader("Connection","close");

        xhttp.send(null);

}


function wc_parse_location_responce(){
	// holdings -> holding 	-> physicalLocation
	//			-> physicalAddress -> text
	// library -> opacUrl	URL of librarys local catalog
	var indx=0;
	var undx=0;
	var location="";
	var locationtext="";
	var address="";
	var addresstext="";
	var link="";
	var linktext="";
	var rowtext="";


        if( wc_get_xhttp_status( xhttp ) ){
                var xmlresponce = xhttp.responseXML;
                if(xmlresponce==null){
                        wc_debug_text("xmlresponce was null");
			wc_remove_progress();
			wc_debug_text("Progress removed.");
                        return;
                }

		wc_remove_progress();
		wc_debug_text("Progress removed.");

                var holdings = xmlresponce.getElementsByTagName( "holding" );
		if( holdings!=null && holdings.length != 0){
			wc_debug_text("holding was not null, size "+holdings.length+".");
		   	for( indx=0; indx<holdings.length; ++indx){
				addresstext=""; locationtext=""; linktext=""; rowtext="";
				wc_debug_text( indx+". holding .");
				location = holdings[indx].getElementsByTagName( "physicalLocation" );
				if( location!=null && location.length>0 )
					for(undx=0; undx<location.length ; ++undx){
						locationtext += "<H4> "+location[undx].firstChild.nodeValue +"</H4>";
					}
				wc_debug_text("Holdings: <BR>  location: " + location[0].firstChild.nodeValue );
				address = holdings[indx].getElementsByTagName( "physicalAddress" );
				if( address!=null && address.length>0 )
					for(undx=0; undx<address.length ; ++undx){
						addresstext += address[undx].getElementsByTagName( "text" )[0].firstChild.nodeValue;
					}
				wc_debug_text("<BR>  address: " + addresstext );
				link = holdings[indx].getElementsByTagName( "electronicAddress" );
				if( link!=null && link.length>0 )
					for(undx=0; undx<link.length ; ++undx){
						linktext += link[undx].getElementsByTagName( "text" )[0].firstChild.nodeValue;
					}
				wc_debug_text("<BR>  electronic address: " + linktext );
				rowtext += "<P>";
				if(locationtext!="")
					rowtext += locationtext + " ";
				if(addresstext!="")
					rowtext += addresstext;
				if(linktext!="")
					rowtext += " <BR> Link to the record: <A href=\"" + linktext + "\"> link </A>.";
				rowtext += "</P>";
				//wc_add_result_location_row( indx+1 , rowtext, "", "" );
				wc_add_result_location_row( rowtext );
				wc_debug_text("Locationrow added at "+(indx+1)+".");
			}
		}else{
			var descriptiontxt = "No holdings were found.";
			//wc_add_result_location_row( 1 , "<CENTER><P> Holding were not found. </P></CENTER>", "", "" );
			//wc_add_result_location_row( "<CENTER><P> No holding were found. </P></CENTER>" );
			wc_show_error_responce_message( descriptiontxt, xmlresponce );
		}
	}else if( xhttp.readyState == 4 && xhttp.status == 404){ // last
			wc_remove_progress();
			wc_add_result_location_row( "<CENTER><H5>HTTP 404: File not found.</H5></CENTER>" );			
	}
}
