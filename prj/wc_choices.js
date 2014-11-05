
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
	// document.getElementById("q").value="";
	document.getElementById("sq").style.display="none";
	document.getElementById("title").style.display="none";
	document.getElementById("title").value="";
	document.getElementById("subject").style.display="none";
	document.getElementById("subject").value="";
	document.getElementById("authorname").style.display="none";
	document.getElementById("authorname").value="";
	document.getElementById("isbn").style.display="none";
	document.getElementById("isbn").value="";
	document.getElementById("location").style.display="none";
	document.getElementById("location").value="";
	document.getElementById("stitle").style.display="none";
	document.getElementById("ssubject").style.display="none";
	document.getElementById("sauthorname").style.display="none";
	document.getElementById("sisbn").style.display="none";
	document.getElementById("slocation").style.display="none";
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
	$('#locationchoice').bind("click", function() {
		show_text_field( "location", "slocation" );
	});
	$('#removechoice').bind("click", function() {
		hide_advanced_text_fields();
		show_text_field("q","sq"); // basic query
		wc_init(); // clear sortorder
	});
}
