
function wc_document_ready(){
	// Called from wc_representation.js (document ready function)
	bind_textfield_additions();
}

function show_text_field( textfieldId, headerId ) {
	wc_sortorder( textfieldId );
	if( headerId == "skeyword" && textfieldId == "keyword" ){ // Rename default
		document.getElementById( "sq" ).innerHTML = "Keyword search ";
		document.getElementById( "sq" ).style.display="inline-block";
		document.getElementById( "q" ).style.display="inline-block";
		document.getElementById( "q" ).focus();
	}else{ // Show text field
		document.getElementById( textfieldId ).style.display="inline-block";
		document.getElementById( headerId ).style.display="inline-block";
		document.getElementById( textfieldId ).focus();
	}
	//if( textfieldId != "keyword" && textfieldId != "q" && document.getElementById( "sq" ).innerHTML=="Keyword search" ){ // Hide default
	//	document.getElementById( "q" ).style.display="none";
	//	document.getElementById( "sq" ).style.display="none";
	//}
}

function hide_advanced_text_fields(){
	document.getElementById("q").style.display="none";
	document.getElementById("q").value="";
	document.getElementById("sq").style.display="none";
	document.getElementById("title").style.display="none";
	document.getElementById("title").value="";
	document.getElementById("subject").style.display="none";
	document.getElementById("subject").value="";
	document.getElementById("authorname").style.display="none";
	document.getElementById("authorname").value="";
	document.getElementById("isbn").style.display="none";
	document.getElementById("isbn").value="";
	document.getElementById("stitle").style.display="none";
	document.getElementById("ssubject").style.display="none";
	document.getElementById("sauthorname").style.display="none";
	document.getElementById("sisbn").style.display="none";
}
function bind_textfield_additions(){
	$('#authorchoice').bind("click", function() {
		show_text_field( "authorname", "sauthorname" );
	});
	$('#titlechoice').bind("click", function() {
		show_text_field( "title", "stitle" );
	});
	$('#subjectchoice').bind("click", function() {
		show_text_field( "subject", "ssubject" );
	});
	$('#isbnchoice').bind("click", function() {
		show_text_field( "isbn", "sisbn" );
	});
	$('#keywordchoice').bind("click", function() {
		show_text_field( "keyword", "skeyword" );
	});
	$('#removechoice').bind("click", function() {
		hide_advanced_text_fields();
		//show_text_field("q","sq"); // basic query
		show_text_field("subject","ssubject"); // default query (recommended)
		wc_init(); // clear sortorder
		document.getElementsByName( "startRecord" )[0].value = 0; // clear position
	});
	if( $('#debugchoice') )
		$('#debugchoice').bind("click", function() {
			wc_debug_switch();
		});
}

function wc_show_progress( persent ){
	var prg = document.getElementById("prg"); 
	if( ! prg ){
 		wc_add_result_location_row( "<CENTER>Progress: <PROGRESS id=\"prg\" value=\""+persent+"\" max=\"100\"></PROGRESS></CENTER>");
	}
	prg = document.getElementById("prg");
	if( prg ){
		prg.value = persent;
		prg.style.visibility="visible"; // collapse
	}
}
function wc_remove_progress( ){

	prg = document.getElementById("prg");
	if( prg!=null ){
		prg.style.visibility="collapse";
		wc_delete_last_result_row( );
	}
}
function wc_delete_last_result_row( ){
        var rtable = document.getElementById("result_table");
        var rowcount = document.getElementById("result_table").rows.length;
        if( rtable ){
                if( rowcount > 0 )
                        rtable.deleteRow( (rowcount-1) );
		return document.getElementById("result_table").rows.length;
	}
	return -1;
}
function wc_clear_result_table(){
	while( wc_delete_last_result_row() > 0 ){ ; }
}
