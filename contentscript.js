/*
Copyright (c) 2013 David Montoya - davidmontoyago@gmail.com

See the file license.txt for copying permission.
*/

// height(px) for every square of the bar
var SQUARE_HEIGHT = 16;
var MARK_IMG_URL = chrome.extension.getURL("mark.png");
var bookmarkConsec = 0;

jQuery.fn.qtip.styles.bookmarkTooltip = {    	   
   border: { width:0, radius:0, color:'#ffffff'},          
   background: '#FFFFFF',
   color: '#000000',
   margin:0, padding:0
}

if ($('#line-markers-bar').length) {		
	toggleBar();
} else {	
	createBar();
	createContextMenu();
}

function toggleBar() {
	$('#line-markers-bar').animate({width:'toggle'},'slow');
}

function createBar() {
	var $bar = $('<div id="line-markers-bar" style="display:none;"></div>');	
	$bar.height($(document).height());			
	// guides for bookmarking
	$bar.append('<hr id="topLineGuide" style="display:none; position:absolute;"/>','<hr id="bottomLineGuide" style="display:none; position:absolute;"/>');	
	$bar.css('cursor','pointer');
	$('body').append($bar);	
	
	$bar.on("click", function(event){
		// if click over the bar, not the mark
		if (event.target == this) {
			setBookmark($(this));
		}
	});
	$bar.on("mousemove", function(event){
		// splits the bar in squares & determinates what square the mouse is over
		var posY = event.pageY;
		var end = Math.round(posY / SQUARE_HEIGHT) * SQUARE_HEIGHT;		
		var leftEnd = 0;
		var rightEnd = 0;		
		if (end >= posY) {			
			rightEnd = end;
			leftEnd = end - SQUARE_HEIGHT;
		} else {
			leftEnd = end;
			rightEnd = end + SQUARE_HEIGHT;
		}		
		$('#topLineGuide').css('top',leftEnd+'px');
		$('#bottomLineGuide').css('top',rightEnd+'px');
		$('#topLineGuide').show();		
		$('#bottomLineGuide').show();		
	});
	$bar.on("mouseout", function(event){
		$('#topLineGuide').hide();		
		$('#bottomLineGuide').hide();
	});
	toggleBar();
}

function createContextMenu() {
	var $contextmenu = $('<ul id="page-section-marker-menu" class="contextMenu">'+							
				'<li><a href="#delete">Delete All Bookmarks</a></li>' +
				'<li class="separator"><b>Go To...</b></li>' +
			   '</ul>');
	$('body').append($contextmenu);
	
	$('#line-markers-bar').contextMenu({
        menu:'page-section-marker-menu'
    },
	function(action, el, pos) {				
		if (action == "delete") {
			$('#line-markers-bar').find('img').remove();
			$('#page-section-marker-menu li').has('a[href!="#delete"]').remove();		
			bookmarkConsec = 0;
		} else {			
			// scroll to			
			$(window).scrollTop(action);
		}
    });	
}

function setBookmark($bar) {	
	bookmarkConsec += 1;
	
	var bookmarkPosTop = $('#topLineGuide').css('top');
	var $mark = $('<img src="'+MARK_IMG_URL+'" style="position:absolute;top:'+bookmarkPosTop+'"></img>');
	
	$mark.on("click", function(event){				
		$(this).qtip('api').destroy();
		//TODO: remove menu option
		$(this).remove();		
	});
	
	//add goto option to the menu	
	var bookmarkMenuOption = "bookmark-menu-option-" + bookmarkConsec;
	$('#page-section-marker-menu').append('<li><a id="'+bookmarkMenuOption+'" href="#'+(parseInt(bookmarkPosTop.replace("px", "")))+'">'+(bookmarkConsec)+'</a></li>');
	
	$mark.qtip({
      content: {text: '<input style="height:'+SQUARE_HEIGHT+'px" maxlength="30" type="text" value="'+bookmarkConsec+'" onchange="$(\'#'+bookmarkMenuOption+'\').text(this.value)"/>'},
	  hide: { when: 'mouseout', fixed: true },
	  style: { name: 'bookmarkTooltip' },
	  position: {corner: { target: 'rightMiddle', tooltip: 'leftMiddle'}}
    });
	
	$bar.append($mark);
}
