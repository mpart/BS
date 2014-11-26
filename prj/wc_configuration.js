//var use_local_files = "true"; 
var use_local_files = "false"; 

//
// If Cross-origin check does not prevent using outside resources (otherwice remove the key to not to show it)
//
var service_key = "wskey=xvIBPSpBwemdHlGsOmjR15cFx7hQ01hyMJ9lXGOfnOE8UFOKnqHwVwF6MQHlwzn3nLrp4iuL6rIomj1s&";

// Books
//var querybaseurl = "books.php?";
var querybaseurl = "../php/books.php?";
//var querybaseurl = "http://192.168.1.2:8080/cgi/books.php?";
//var querybaseurl = "http://127.0.0.1/cgi/books.php?";
//var querybaseurl = "http://users.metropolia.fi/~jounilaa/php/books.php?";
//var querybaseurl = "http://www.worldcat.org/webservices/catalog/search/worldcat/sru?";
if( use_local_files=="true" )
	querybaseurl += service_key ;

// Original book search to show in debug text and to remember
var originalbaseurl = "http://www.worldcat.org/webservices/catalog/search/worldcat/sru?";

// Locations
// With question mark:
//var idquerybaseurl = "location.php?";
var idquerybaseurl = "../php/location.php?";
//var idquerybaseurl = "http://192.168.1.2:8080/cgi/location.php?";
//var idquerybaseurl = "http://127.0.0.1/cgi/location.php?";
//var idquerybaseurl = "http://users.metropolia.fi/~jounilaa/php/location.php?";
// Without question mark (when use_local_files is true to append oclcid):
//var idquerybaseurl = "http://www.worldcat.org/webservices/catalog/content/libraries";
// Original location search
var idoriginalbaseurl = "http://www.worldcat.org/webservices/catalog/content/libraries";


var baseref = document.getElementsByTagName("BASE")[0]; 
if( ! baseref ){
	baseref = document.createElement("BASE"); 
}
if( use_local_files == "true" ){
	baseref.setAttribute( "href", "" ); // Opera ja localhost: Cross-origin check ... Access denied
}else{
	//baseref.setAttribute( "href", "http://users.metropolia.fi/~jounilaa/prj/" ); 
	//baseref.setAttribute( "href", "http://127.0.0.1/prj/" ); // viimeinen '/' oltava
	baseref.setAttribute( "href", "http://192.168.1.2:8080/prj/" ); // viimeinen '/' oltava
}
