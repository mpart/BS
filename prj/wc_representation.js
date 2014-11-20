$(document).ready( function() {

	resizeWindow(); 
	hide_advanced_text_fields();
	//show_text_field("q","sq"); // basic query, default keyword search
	show_text_field("subject","ssubject"); // default query, recommended

	document.getElementById("querybutton").type="button"; // javascript enabled

	// Recheck size (to test in desktop)
	$(window).bind("resize", resizeWindow);

	function resizeWindow(e){
		var wsize = $(window).width();

		// Load CSS again if different sizes are needed
		$("link#wc_css").attr({href : "bs.css"});

		if( $(window).width() > 1200 ){

			//document.getElementById("logo").src="http://static1.worldcat.org/wcpa/rel20140925/images/logo_wcmasthead_en.png";
			document.getElementById("logo").innerHTML="<H1 class=\"logo\"><SMALL>Bookshelf<SUP><SMALL>&copy;</SMALL></SUP> search</SMALL></H1>";
			for( var indx=0; indx<document.getElementsByClassName("textfields").length; ++indx)
			  document.getElementsByClassName("textfields")[ indx ].size = wsize/14;

		}else if( $(window).width() > 720 ){

			// Swap bigger logo if needed
			//document.getElementById("logo").src="http://static1.worldcat.org/wcpa/rel20140925/images/logo_wcmasthead_en.png";
			document.getElementById("logo").innerHTML="<H1 class=\"logo\"><SMALL>Bookshelf <SUP><SMALL>&copy;</SMALL></SUP> search</SMALL></H1>";

			// Resize text fields
			for( var indx=0; indx<document.getElementsByClassName("textfields").length; ++indx)
			  document.getElementsByClassName("textfields")[ indx ].size = 80;
			  
		}else{
			//document.getElementById("logo").src="http://www.worldcatmobile.org/images/masthead_worldcat_beta_en.gif";
			document.getElementById("logo").innerHTML="<H1 class=\"logo\"><SMALL>Bookshelf<SUP><SMALL>&copy;</SMALL></SUP> search</SMALL></H1>";
			for( var indx=0; indx<document.getElementsByClassName("textfields").length; ++indx)
			  document.getElementsByClassName("textfields")[ indx ].size = 45;
		}

	}
	
	wc_document_ready();
	wc_data_document_ready();
	wc_location_document_ready();
 });

