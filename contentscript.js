/*
Copyright (c) 2013 David Montoya - davidmontoyago@gmail.com

See the file license.txt for copying permission.
*/
(function($) {

	// height(px) for every square of the bar
	var SQUARE_HEIGHT = 16;
	var MARK_IMG_URL = chrome.extension.getURL("mark.png");
	var bookmarkConsec = 0;
	
	function init() {
		if ($('#markers-bar').length) {		
			toggleBar();
		} else {	
			createBar();
			createContextMenu();
		}
	}

	function toggleBar() {
		$('#markers-bar').animate({width:'toggle'},'slow');
	}

	function createBar() {
		var $bar = $('<div>', {
				id: 'markers-bar',
				height: $(document).height()
			}).
		css({
			'display': 'none',
			'cursor': 'pointer'
		});
		
		// guides for bookmarking
		$bar.append($('<hr>', {id: 'topLineGuide'}).css({'display': 'none','position': 'absolute'}),
				    $('<hr>', {id: 'bottomLineGuide'}).css({'display': 'none','position': 'absolute'}));	
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
			$('#topLineGuide, #bottomLineGuide').show();
		});
		$bar.on("mouseout", function(event){
			$('#topLineGuide, #bottomLineGuide').hide();
		});
		toggleBar();
	}

	function createContextMenu() {
		var $contextmenu = $('<ul>', {
				id: 'page-section-marker-menu',
				class: 'contextMenu' 
			}).
		append('<li><a href="#delete">Delete All Bookmarks</a></li>',
			   '<li class="separator"><b>Go To...</b></li>');
		$('body').append($contextmenu);
	
		$('#markers-bar').contextMenu({
			menu:'page-section-marker-menu'
	    },
		function(action, el, pos) {				
			if (action == "delete") {
				$('#markers-bar').find('img').remove();
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
		var $mark = createMark(bookmarkPosTop); 
	
		//add goto option to the menu	
		var bookmarkMenuOption = "bookmark-menu-option-" + bookmarkConsec;
		var $menuOptionLink = createMenuOptionLink(bookmarkMenuOption, parseInt(bookmarkPosTop.replace("px", "")), bookmarkConsec);
		var $menuOption = $('<li>').append($menuOptionLink);
		$('#page-section-marker-menu').append($menuOption);
			
		var $markInput = createMarkInput(bookmarkConsec);
		$markInput.on('change', function(event) {
			$menuOptionLink.text($(this).val());		
		});
		
		$mark.qtip({
			content: $markInput,
			hide: { 
				when: 'mouseleave', 
				fixed: true 
			},
			position: {
				my: 'left center',
				at: 'right center'
			},
			style: { 
				def: false,
				classes: 'mark-input qtip-rounded'
			}
		});	
	    
	    $mark.on('click', function(event) {
			var $this = $(this); 				
			$this.qtip('api').destroy();
			$menuOption.remove();
			$this.remove();		
		});
	
		$bar.append($mark);
	}
	
	function createMark(top) {	
		return $('<img>', {
			src: MARK_IMG_URL 
		}).
		css({
			'position': 'absolute',
			'top': top
		});
	}
	
	function createMarkInput(initialName) {
		return $markInput = $('<input>', {
				type: 'text',
				maxlength: 30
		}).
		css('height', SQUARE_HEIGHT + 'px').
		val(initialName); 
	}
	
	function createMenuOptionLink(optionId, ref, name) {
		return $('<a>', {
				id: optionId,
				href: '#'+ref
			}
		).text(name);
	}
	
	init();
})(jQuery);
