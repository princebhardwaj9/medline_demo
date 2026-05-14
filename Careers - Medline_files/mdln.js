/**
 *  Main theme scripts
 *
 *  @since 1.0.0
 */

/* global jQuery, BrTrk, Cookies, ms */

/* jshint esversion: 6 */

if( "undefined"==typeof jQuery )throw new Error( "Site JavaScript requires jQuery" );


(function ($, window, document) {

	'use strict';

	/**
	 *  Force focus when accepting cookie banner
	 *
	 *  @since 1.7.1
	 */
	$(function(){
		$(document).on('click', '#onetrust-accept-btn-handler', function(){
			$('a.fusion-logo-link').trigger("focus");
		});
	});

})( jQuery, window, document );


(function ($, window, document) {

	$('.nav-tabs a[data-toggle="tab"]').on('click', function(e){
		var $parent = $(this).closest('li');
		if( $parent.hasClass('active') ){
			return false;
		}
	});


    // The actual plugin constructor
    function MdlnSortable( element, options ) {

        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
		this.options = $.extend({}, MdlnSortable.Defaults, options);

		this._defaults = MdlnSortable.defaults;

        this.init();
    }

	MdlnSortable.defaults = {};

    MdlnSortable.prototype.init = function () {

		var $gridContainer = $(this.element),
			$grid          = $gridContainer.find('.sortable-cards');

		$grid.isotope({
			itemSelector: '.item-card',
			layoutMode: 'fitRows'
		});

		// init filters for container
		$gridContainer.find('.filter-buttons-group').on( 'click', 'button', function(e) {

			var $btn         = $(e.currentTarget),
				filterValue  = $btn.attr('data-filter');

			// if it's an active filter, reset the filtering
			if( $btn.hasClass( 'active' ) ){
				filterValue = "*";
				$btn.removeClass('active');
			} else {
				$btn.addClass('active');
			}

			// reset active state on siblings
			$btn.siblings().removeClass('active');

			$grid.isotope({ filter: filterValue });

		});

    };

    $.fn.mdlnSortable = function ( options ) {

        return this.each(function () {

			var $this = $(this),
				data = $this.data('mdlnSortable');

            if ( !data ) {
				data = new MdlnSortable( this, typeof options == 'object' && options );
				$this.data( 'mdlnSortable', data );
            }

        });

    };

	$.fn.mdlnSortable.Constructor = MdlnSortable;

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {

		var $tab           = $(event.target),
			$panel         = $( $tab.attr('href') ),
			$gridContainer = $panel.find('.mdln-sortable-gallery'),
			$gridFilters   = $panel.find('.filter-buttons-group'),
			$grid          = $panel.find('.sortable-cards');

		if( $gridFilters.length && $gridFilters.is(":visible") ){
			$gridContainer.mdlnSortable();
		}

	});


	if( $('.mdln-sortable-gallery').length ) {

		$('.mdln-sortable-gallery').each( function( i, gridContainer ) {
			var $this = $(this),
				$tab = $this.closest('.tab-pane'),
				$gridContainer = $( gridContainer ),
				$gridFilters = $gridContainer.find('.filter-buttons-group');

			// if the tab exists and is visable (i.e., first tab, and the filters are visible
			if( $tab.length && $tab.is(":visible") && $gridFilters.length && $gridFilters.is(":visible") ){
				$gridContainer.mdlnSortable();
			}

			// if there's no tab and the filters are visible
			if(  ! $tab.length && $gridFilters.length && $gridFilters.is(":visible") ){
				$gridContainer.mdlnSortable();
			}

		});

	}

})( jQuery, window, document );


(function ($, window, document) {

	/**
	 *  Micro Menus
	 */
	$.fn.mdlnScrollProgress = function( options ){
		var $container   = $(this),
			$bar         = $container.find('.mmm-progress-bar'),
			docHeight    = $( document ).height(),
			windowHeight = $(window).height(),
			scrollPercent;

		function check_heights(){
			docHeight    = $( document ).height();
			windowHeight = $(window).height();
		}

		function check_sroll_progress(){
			scrollPercent = ( $(window).scrollTop() / (docHeight - windowHeight) ) * 100;
			scrollPercent = ( scrollPercent >= 100 ) ? 100 : scrollPercent ;
			$bar.css( "width", scrollPercent + "%" );
		}

		$(window).on( "load resize", check_heights );
		$(window).on( "scroll", check_sroll_progress );

	};

	$('.mmm-progress-container').mdlnScrollProgress();


	$.fn.mdlnMicroMenu = function( options ){

		return this.each( function () {

			var currentPageUrl = location.pathname;

			// elements
			var $nav        = $(this),
				$navParent  = $nav.closest('.mdln-micro-menu'),
				$navMenu    = $nav.find('.nav-menu'),
				$menuList   = $nav.find('.menu-items'),
				$listItems  = $menuList.children('li'),
				$links      = $listItems.children('a'),
				$jumpToggle = $nav.find('.jump-toggle'),
				$navHeader  = $nav.find('.nav-header'),
				$menuHeader = $nav.find('.menu-title');

			var $navContainer = $nav.closest('.fusion-fullwidth').addClass('mm-container');

			// heights
			var navHeight = parseInt( $nav.outerHeight() + 1 ),
				navOffset = parseInt( $navParent.offset().top ),
				navHeaderHeight  = parseInt( $navHeader.height() ),
				menuHeaderHeight = parseInt( $menuHeader.height() );

			// cache
			var lastSectionId,
				scrollLinks   = {},
				scrollOffsets = {},
				$scrollSections = $links.map(function(i,e){
					if( '' !== e.hash ){
						var $section = $(e.hash).length && $(e.hash) || $('[name="' + e.hash.slice(1) +'"]');
						if ( $section.length ) {
							scrollLinks[e.hash] = $section;
							scrollOffsets[e.hash] = parseInt( $section.offset().top - navHeight - 30 );
							return $section;
						}
					}
				});

			function check_menu_header_alignment(){
				$menuHeader.css({
					'margin-top' : function() {return  (navHeight - menuHeaderHeight)/2; }
				});
			}

			function check_sticky_scroll() {
				if( $nav.hasClass('mm-type-single-page') ){
					if( $(window).scrollTop() > navOffset ){
						$navParent.addClass('is-sticky');
						$navContainer.addClass('stick');
					} else {
						$navParent.removeClass('is-sticky');
						$navContainer.removeClass('stick');
					}
				}
			}

			function check_section_scroll(){

				if ( 0 == $scrollSections.length ){ return; }

				var fromTop = parseInt( $nav.offset().top + navHeight + 100 );

				// Get id of current scroll item
				var scrolledSections = $scrollSections.map( function( i, e ){
					if ( $(e).offset().top < fromTop ){
						return $(e);
					}
				});

				// Get the id of the current element
				var $currentSection = scrolledSections[scrolledSections.length - 1];
				var currentSectionId = ( $currentSection && $currentSection.length ) ? $currentSection.attr('id') : "" ;
				if ( lastSectionId !== currentSectionId ) {
					lastSectionId = currentSectionId;

					$links
					.parent().removeClass("active")
					.end().filter('[href="#' + currentSectionId + '"]').parent().addClass("active");
				}

			}

			$(window).on( "load resize scroll", check_sticky_scroll );
			$(window).on( "load resize scroll", check_section_scroll );

			// toggling open the menu
			$jumpToggle.on('click', function(e){
				var $toggle = $(this);
				var s = $toggle.attr("data-target"),
					$target = $(document).find(s);

				//var i = $target.hasClass("in");
				//$jumpToggle.toggleClass('collapsed').attr("aria-expanded", !i);
				//$target.toggleClass("in");

				$target.slideToggle(200, "easeOutQuad");
				var i = $target.hasClass("expanded");
				$jumpToggle.toggleClass('collapsed').attr("aria-expanded", !i)
				$target.toggleClass("expanded");
			});

			// scroll animation
			$links.on( 'click', function(e){
				var link = e.currentTarget;

				if(  scrollLinks.hasOwnProperty( link.hash )  ){

					e.preventDefault();

					$jumpToggle.addClass('collapsed');
					$navMenu.removeClass("in");
					$listItems.removeClass('active');
					$(link).parent('li').addClass('active');

					var $section = scrollLinks[link.hash];

					$('html, body').stop().animate({
						scrollTop: scrollOffsets[link.hash]
					}, 1000, function(){
						if ( $section.is(":focus") ) {
							return false;
						} else {
							$section.trigger("focus");
						}
					});

				}

			});

			$links.each( function(){
				var $link = $(this);
				// if the current path is like this link, make it active
				if( $link.attr('href').indexOf(currentPageUrl) !== -1 ){
					$link.parent('li').addClass('active');
				}
			});

		});

	};

	$('.mdln-micro-menu-navbar').mdlnMicroMenu();

}(jQuery, window, document));


(function ($, window, document) {

	'use strict';

	$( "li.fusion-megamenu-menu > a").on('click', function(e){
		e.preventDefault();
	});

	$( "li.fusion-megamenu-menu > .fusion-bar-highlight").on( 'click', function(e){
		var $this    = $( this ),
			$parent  = $this.parent(),
			$mainNav = $(".fusion-main-menu");
		e.preventDefault();
		e.stopPropagation();
	});

	$( "li.fusion-megamenu-menu > .fusion-bar-highlight").on( 'focus', function(e){
		var $this    = $( this ),
			$parent  = $this.parent(),
			$mainNav = $(".fusion-main-menu");
		$parent.siblings().removeClass( 'mdln-active-link' );
		if( $parent.hasClass('mdln-active-link') ){
			$mainNav.removeClass('active-nav');
			$parent.removeClass('mdln-active-link');
			$('body').removeClass('menu-active');
		} else {
			$parent.addClass( 'mdln-active-link' );
			$mainNav.addClass('active-nav');
			$('body').addClass('menu-active');
		}
		setTimeout(function(){
			$mainNav.find(':focus').trigger('blur');
		});
	});


	/**
	 *  Safari does not recognize focus event trigger for links, so
	 *  we have to use click. Triggering the menu show on "click"
	 *  for Chrome, FF, and IE causes a delay.  So we onlt fire
	 *  this on click for Safari.
	 *
	 *  @since 2.0.0
	 */
	$( ".ua-safari li.fusion-megamenu-menu > .fusion-bar-highlight").on( 'click', function(e){
		var $this    = $( this ),
			$parent  = $this.parent(),
			$mainNav = $(".fusion-main-menu");
		$parent.siblings().removeClass( 'mdln-active-link' );
		if( $parent.hasClass('mdln-active-link') ){
			$mainNav.removeClass('active-nav');
			$parent.removeClass('mdln-active-link');
			$('body').removeClass('menu-active');
		} else {
			$parent.addClass( 'mdln-active-link' );
			$mainNav.addClass('active-nav');
			$('body').addClass('menu-active');
		}
		setTimeout(function(){
			$mainNav.find(':focus').trigger('blur');
		});
	});

	$('html').on('click', 'body.menu-active', function(e) {
		var $mainNav = $(".fusion-main-menu");
		$mainNav.removeClass('active-nav');
		$mainNav.find('.mdln-active-link').removeClass('mdln-active-link');
		$('body').removeClass('menu-active');
	});

}(jQuery, window, document));


(function ($, window, document) {

	/* Michael */

	$(function(){
		$(document).on('hide.bs.modal','.fusion-modal', function () {
			$(".fusion-modal iframe").each(function() {
				var src= $(this).attr('src');
				$(this).attr('src',src);
			});
		});
	});


	$(function(){
		var s = $("#sticky-nav");
			if( s.length ) {
			var pos = s.position();
			$(window).on("scroll",function() {
				var windowpos = $(window).scrollTop();
				if (windowpos >= pos.top) {
					s.addClass("stick");
				} else {
					s.removeClass("stick");
				}
			});
		}
	});


	$(function(){

		$('.contact-mobile').on("mouseenter", function(){
			$(this).addClass('contact-mobile-2');
		}).on("mouseleave", function(){
			$(this).removeClass('contact-mobile-2');
		});

	});

	$(document).on("scroll", function() {
		var y = jQuery(this).scrollTop();
		if (y > 700) {
			$('.t3-button').fadeIn();
		} else {
			$('.t3-button').fadeOut();
		}
	});

})( jQuery, window, document );


(function ($, window, document) {

	/* Davis Trademarks page */

	var Accordion = {
		init: function() {
			// Common jQuery Elements
			this.jQueryaccordion = $('.accordion1');
			this.jQueryjsActivateAccordion = $('.js-accordion_trigger');
			this.jQueryaccordionItem = $('.accordion-item');
			this.jQueryaccordionContent = $('.accordion-bd');
			this.jQueryaccordionLength = this.jQueryaccordionItem.length;
			this.jQueryremoteControlAccordion = $('.js-remoteControlAccordion');
			this.jQueryaccordionTitle = $('.js-accordion-title');

			// Initiate Functions
			this.bindEvents();
			this.generateRemoteList();
			this.remoteControl();
		},

		bindEvents: function() {
			var self = this;

			this.jQueryjsActivateAccordion.on('click', function() {
				var jQuerythis = $(this);
				var i = jQuerythis.index();

				// When you click the expand all button, expand ALL accordions.
				if (jQuerythis.find("#expand-all").length) {
					// If the class is preset, expand everything.
					if ($('#expand-all').hasClass('acc_expand-all')) {
						$('.accordion-bd').each(function() {
							self.showAccordion($(this));
						});
					} else {
						// Otherwise, collapse everything.
						$('.accordion-bd').each(function() {
							self.resetAccordion($(this));
						});
					}
					$('#expand-all').toggleClass('acc_expand-all');
				} else {
					// Toggle the class.
					self.activateAccordion(jQuerythis);
				}
			});
		},

		resetAccordion: function(element) {
			element
			.slideUp(300)
			.removeClass('accordion-bd_isDisplayed');

			var jQueryexpandIcon = element;

			this.toggleAccordionIcon(jQueryexpandIcon);
		},

		showAccordion: function(element) {
			element
			.slideDown(300)
			.addClass('accordion-bd_isDisplayed');

			var jQueryexpandIcon = element;
			this.toggleAccordionIcon(jQueryexpandIcon);
		},

		// Function to toggle the given expand icon.
		toggleAccordionIcon: function(element) {
			if (element.hasClass('accordion-bd_isDisplayed')) {
				element
				.parent()
				.find('.expand-icon')
				.addClass("expanded");
			} else {
				element
				.parent()
				.find('.expand-icon')
				.removeClass("expanded");
			}
		},

		activateAccordion: function(currentElement) {
			var triggerIndex = currentElement.parent().index();

			var jQueryslideContent = this.jQueryaccordionContent.eq(triggerIndex);
			var jQueryotherActive = jQueryslideContent.parent('.accordion-item').siblings().find('.accordion-bd');

			// console.log(triggerIndex);

			// Removed code to close other active accordions. Better user experience.
			if (jQueryslideContent.hasClass('accordion-bd_isDisplayed')) {
				this.resetAccordion(jQueryslideContent);
			} else {
				this.showAccordion(jQueryslideContent);
			}
		},

		// Create remote control for Accordion
		generateRemoteList: function() {
			this.jQueryremoteControlAccordion.append('<ul class="remoteControlAccordion-list hList"></ul>');

			this.jQueryaccordionItem.each(function() {
				var remoteControlList = jQuery('.remoteControlAccordion-list');
				remoteControlList.append('<li class="js-accordion-dynamicTrigger"><button class="btn btn_main"><span class="accordion-btn"></span></button></li>');
			});

			var jQueryaccordionBtn = jQuery('.accordion-btn');

			for ( var i = 0; i < this.accordionLength; i++) {
				var accordionTitle = this.jQueryaccordionTitle.eq(i).html();
				var accordionBtn = jQueryaccordionBtn.eq(i);

				accordionBtn.html(accordionTitle);
			}
		},

		remoteControl: function() {
			var self = this;
			var jQueryaccordionBtn = jQuery('.js-accordion-dynamicTrigger');

			jQueryaccordionBtn.on('click', function() {
				var jQuerythis = jQuery(this);
				var btnIndex = jQuerythis.index();
				var displayContent = self.jQueryaccordionContent.eq(btnIndex);
				var jQueryotherActive = displayContent.parent('.accordion-item').siblings().find('.accordion-bd');

				if (jQueryotherActive.hasClass('accordion-bd_isDisplayed')) {
					self.resetAccordion(jQueryotherActive);
					self.showAccordion(displayContent);
				} else {
					if (self.jQueryaccordionContent.hasClass('accordion-bd_isDisplayed')) {
						self.resetAccordion(displayContent);
					} else {
						self.showAccordion(displayContent);
					}
				}
			});
		}
	};

	// DOM Ready Function
	$(function() {
		Accordion.init();
	});

})( jQuery, window, document );


(function ($, window, document) {

	/* Davis ERASE CAUTI page */

	$(function(){
		$('.letters').on("click", function() {
			jQuery('.targetDiv').hide();
			jQuery('#div' + $(this).attr('target')).show();
		});
	});

	// EVALUATE
	$(function(){
		$('#e-one').on("click", function() {
			var one = ('#main-cover');
			var other = ('#left-ballon , #middle-book, #blue-book, #left-book, #right-gloves, #cover, #time, #tray, #left-blue, #left-middle, #left-bottom');
			$(one).css('opacity', '1');
			$(other).css('opacity', '.3');
		});
	});

	// READ
	$(function(){
		$('#r-one').on("click", function() {
			var one = ('#main-cover');
			var other = ('#left-ballon , #middle-book, #blue-book, #left-book, #right-gloves, #cover, #time, #tray, #left-blue, #left-middle, #left-bottom');

			$(one).css('opacity', '1');
			$(other).css('opacity', '.3');
		});
	});

	// ASEPTIC
	$(function(){
		$('#a-one').on("click", function() {
			var one = ('#right-gloves, #cover, #tray, #left-book, #middle-book, #blue-book');
			var other = ('#main-cover , #left-ballon, #time, #left-blue, #left-middle, #left-bottom');

			$(one).css('opacity', '1');
			$(other).css('opacity', '.3');
		});
	});

	// SECURE
	$(function(){
		$('#s-one').on("click", function() {
			var one = ('#time, #left-blue, #left-middle, #left-bottom');
			var other = ('#main-cover, #tray, #left-ballon, #middle-book, #cover, #right-gloves, #blue-book, #left-book');

			$(one).css('opacity', '1');
			$(other).css('opacity', '.3');
		});
	});


	// EVALUATE
	$(function(){
		$('#e-two').on("click", function() {
			var one = ('#left-ballon');
			var other = ('#middle-book, #main-cover, #blue-book, #left-book, #right-gloves, #cover, #time, #tray, #left-blue, #left-middle, #left-bottom');

			$(one).css('opacity', '1');
			$(other).css('opacity', '.3');
		});
	});

	$(function(){
		var parent = $("#shuffle");
		var divs = parent.children();
		while (divs.length) {
			parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
		}
	});

})( jQuery, window, document );


(function ($, window, document) {

	/**
	 * Remove the comments link on the recent posts list on the homepage
	 * see ticket 3743
	 */
	$(function(){
		$('.recent-posts-content').each( function (){
			var $this = $(this);
			$('.meta span', $this ).last().remove();
			//$('.meta-separator', $this ).last().remove();
		});
	});

	/**
	 * Remove the comments link on the recent posts list on the homepage
	 * see ticket 3743
	 */
	$(function(){

		$('.feat-post-img-col').each( function (){
			var $this = $(this);
			var h = $this.height();
			var $link = $this.find('.feat-post-link');
			$link.height(h);
		});
	});

})( jQuery, window, document );


(function ($, window, document) {

	/**
	* Adding function to read and return a cookie value for marketing section.
	*
	* @author  Brian Greenacre<bgreenacre@medline.com>
	*/
	function grabMarketSection() {
		var commerceBehavior = Cookies.get('commerceBehavior');

		if ( ! commerceBehavior )
			return 'other';

		commerceBehavior = commerceBehavior.replace(/\\/g, '');
		commerceBehavior = JSON.parse(commerceBehavior);

		return commerceBehavior.m;
	}

	$(function(){

		if( $('.catalyst-wrap').length != 0 && typeof ms !== 'undefined' ){

			$('.catalyst-wrap').on( 'click', 'a',  function( e ){
				setCatalystData( e );
			});

		}

		function setCatalystData( e ){

			//e.preventDefault();

			var $link = $(e.currentTarget);

			if( ! $link.hasClass('no-track') ) {

				var $section  = $link.closest('.catalyst-wrap');
				var $links    = $section.find('a').not('.no-track');
				var linkCount = $links.length;
				var linkIndex = parseInt( $links.index($link) ) + 1;
				var market = grabMarketSection();

				// link url
				var linkUrlRaw = $link.attr('href');
				var	linkUrl = linkUrlRaw.substring(linkUrlRaw.replace(/^https?\:\/\//i).indexOf('/')-1);

				// title (not used)
				//var data = $.parseParams( linkUrl );
				//var title  = ( data && data.Ntt ) ?
					//data.Ntt.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ).replace(/\s+/g, '-')
					//: linkUrl.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ).replace(/\s+/g, '-').replace(/\//g, ':' );

				// page name
				var pageName = ms.getPageName();
					pageName = pageName.trim();

				if ( pageName.length < 1 ) {
					pageName = ms.getDefaultPageName();
					pageName = pageName.trim();
				}

				pageName = pageName.replace('content: ', '');
				pageName = pageName.replace(/\s\s+/g, '-');
				pageName = pageName.replace(/\:\-/g, ': ');
				pageName = pageName.replace(/\:$/, '');
				pageName = pageName.trim();

				if ( pageName.length < 1 ) {
					pageName = 'Page name not detected';
				}

				// section heading
				var sectionHeading = $( 'h2', $section ).eq(0).text();
					sectionHeading = sectionHeading.trim();

				if ( sectionHeading.length < 1 ) {
					sectionHeading = 'n/a';
				}

				// link title
				var linkTitle = $link.text();

				if( $('img', $link).length != 0 ){
					var imageUrl = $('img', $link).attr('src');
						linkTitle = imageUrl.substring(imageUrl.lastIndexOf('/') + 1 );
						linkTitle = 'Img: ' + linkTitle;
				}
				linkTitle = linkTitle.trim();

				if ( linkTitle.length < 1 ) {
					linkTitle = 'n/a';
				}

				// position
				var linkPosition = linkIndex;

				// total positions
				var totalLinkPositions = linkCount;

				// collected data
				// var promotedContentData = pageName + '/' + sectionHeading + '/' + linkTitle + '/' + linkPosition + '/' + totalLinkPositions + '/Url: ' + linkUrlRaw;
				var promotedContentData = pageName + '/' + sectionHeading + '/' + linkTitle + '/' + linkPosition + '/' + totalLinkPositions;

				// set it up
				ms.setClickPromotedContentEvent( 'Featured Product Click', promotedContentData, market );

				/*
				var value = promotedContentData.replace( /[,;|$]/g, '' ); // delimiters & misc disallowed chars
					value = ms.getLowAscii( value );	// to uppercase

				console.log( 'linkUrlRaw: ' + linkUrlRaw );
				console.log( 'title: ' + title );
				console.log( 'pageName: ' + pageName );
				console.log( 'sectionHeading: ' + sectionHeading );
				console.log( 'linkTitle: ' + linkTitle );
				console.log( 'linkPosition: ' + linkPosition );
				console.log( 'totalLinkPositions: ' + totalLinkPositions );
				console.log( 'promotedContentData: ' + promotedContentData );
				console.log( value );
				//*/
			}

		}

	});

})( jQuery, window, document );


(function ($, window, document) {

	/* hide banners on punchout */
	$(function(){
		if( window.location.href.indexOf("punchout.medline.com") > -1 ) {
			// Hide the element
			jQuery('.fusion-alert').hide();
		}
	});

})( jQuery, window, document );


(function ($, window, document) {

	/**
	 *  GA Tracking of Featured Content
	 */
	/*$(function(){

		$.fn.mdlnFeatContentTrack = function(){

			return this.each( function () {

				var $link = $( this ),
					mediaUrl = $link.data('media-url'),
					pageName = $link.data('page-title'),
					eventCat = $link.data('ga-category'),
					eventAct = 'Learn more';

				// clicking an image
				if( $link.hasClass( 'feat-post-img-link' ) ){
					if( 'pdf' == eventCat ){
						eventAct = "Read more";
					}
					if( 'video' == eventCat ){
						eventAct = "Play";
					}
				};

				// clicking a text link
				if( $link.hasClass( 'feat-post-more-link' ) ){
					if( 'pdf' == eventCat ){
						eventAct = "Read more";
					}
					if( 'video' == eventCat ){
						eventAct = "Watch now";
					}
				}

				$link.on('click', function( e ){

					console.log( mediaUrl );
					console.log( pageName );
					console.log( eventCat );
					console.log( eventAct );
					console.log( pageName + ': ' + mediaUrl );

					ga( 'send', {
					  hitType       : 'event',
					  eventCategory : eventCat,
					  eventAction   : eventAct,
					  eventLabel    : pageName + ': ' + mediaUrl
					});
				});
			});

		};
		// $('[data-ga-track="1"]').mdlnFeatContentTrack();
		$('.feat-post-wrap').each( function(i,e){
			$('.feat-post-img-link', $(e)).each( function(i,e){
				$(e).addClass('trackme-img').mdlnFeatContentTrack();
			});
			$('.feat-post-more-link', $(e)).each( function(i,e){
				$(e).addClass('trackme-more').mdlnFeatContentTrack();
			});
		})

	});*/

})( jQuery, window, document );


(function ($, window, document) {

	/**
	 *  Dropdown menus
	 */
	$(function(){

		var $allDropdowns = $();

		// if instantlyCloseOthers is true, then it will instantly
		// shut other nav items when a new one is hovered over
		$.fn.dropdownHover = function( options ) {
			// don't do anything if touch is supported (plugin causes some issues on mobile)
			if( 'ontouchstart' in document ) return this; // don't want to affect chaining

			// the element we really care about is the dropdown-toggle's parent
			$allDropdowns = $allDropdowns.add( this.parent() );

			return this.each( function () {
				var $this = $( this ),
					$parent = $this.parent(),
					defaults = {
						delay: 100,
						hoverDelay: 0,
						instantlyCloseOthers: true
					},
					data = {
						delay: $( this ).data( 'delay' ),
						hoverDelay: $( this ).data( 'hover-delay' ),
						instantlyCloseOthers: $( this ).data( 'close-others' )
					},
					showEvent   = 'show.dropdown',
					hideEvent   = 'hide.dropdown',
					settings = $.extend( true, {}, defaults, options, data ),
					timeout, timeoutHover;

				$parent.hover( function( event ) {
					openDropdown( event );
				}, function() {
					// clear timer for hover event
					window.clearTimeout( timeoutHover );
					timeout = window.setTimeout( function () {
						$this.attr( 'aria-expanded', 'false' );
						$parent.removeClass( 'open' );
						$this.trigger( hideEvent );
					}, settings.delay );
				});

				// this helps prevent a double event from firing.
				$this.hover( function ( event ) {
					if( ! $parent.hasClass( 'open' ) && ! $parent.is( event.target ) ) {
						// stop this event, stop executing any code in this callback but continue to propagate
						return true;
					}

					openDropdown(event);
				});

				function openDropdown(event) {

					// clear dropdown timeout here so it doesnt close before it should
					window.clearTimeout(timeout);

					// restart hover timer
					window.clearTimeout(timeoutHover);

					// delay for hover event.
					timeoutHover = window.setTimeout(function () {
						$allDropdowns.find(':focus').trigger('blur');

						if(settings.instantlyCloseOthers === true)
							$allDropdowns.removeClass('open');

						// clear timer for hover event
						window.clearTimeout(timeoutHover);
						$this.attr('aria-expanded', 'true');
						$parent.addClass('open');
						$this.trigger(showEvent);
					}, settings.hoverDelay);
				}
			});
		};

		$.fn.dropdownShow = function( options ) {

			return this.each( function () {
				var $this = $( this ),
					$parent = $this.parent();

				$this.append(' <span class="caret-wrap"><i class="fa fa-caret-down" aria-hidden="true"></i></span>').addClass('dropdown-parent');


				$this.on( 'click', function(e){
					e.preventDefault();
					//$parent.toggleClass('open');
				});


			});
		};
		$('.header-ui-menu .menu-item-has-children > a').dropdownHover();
		$('.header-ui-menu .menu-item-has-children > a').dropdownShow();

		/* Recall notification click event listener */
		$('body').on('click', '.atg-account-links .notification-wrapper', function(e) {
			e.stopPropagation();
			var parent_element = e.currentTarget;
			if(parent_element.classList.contains('notification-wrapper')) {
				$('.atg-account-links #notification-ui-dropdown #notification-ui-container').slideToggle('fast');
			}
		});
		$('body').on("click" ,'.atg-account-links #notification-ui-dropdown #notification-ui-container', function(e) {
			e.stopPropagation();
		});
		$(document).on("click", function() {
			$('.atg-account-links #notification-ui-dropdown #notification-ui-container').slideUp();
		});
	});

})( jQuery, window, document );


(function ($, window, document) {

	/**
	* Adding function to toggle hidden div content on click.
	*
	* @author Joe Rockey <jrockey@medline.com>
	*/
	$(function(){
		$('#showall').on("click", function(){
			$('.targetDiv').show();
		});
		$('.showSingle').on("click", function(){
			$('.targetDiv').hide();
			$('#div' + $(this).attr('target')).show();
		});
	});

})( jQuery, window, document );


(function ($, window, document) {

	"use strict";

	/**
	 *  COVID-19 Response Center hub page micro menu changes
	 */
	var micro_menu = document.getElementsByClassName("micro-menu");

	document.addEventListener("scroll", function () {
		for (var x = 0; x < micro_menu.length; x++) {
			var covid_menu = document.getElementsByClassName("menu-header");

			if (micro_menu[x].classList.contains("is-sticky")) {
				for (var y = 0; y < covid_menu.length; y++) {
					covid_menu[y].classList.add("mm-scroll-display");
				}
			} else {
				for (var z = 0; z < covid_menu.length; z++) {
					covid_menu[z].classList.remove("mm-scroll-display");
				}
			}
		}
	});

})( jQuery, window, document );


(function ($, window, document) {

	"use strict";

	/**
	 *  OTH Suction Regulator Configurator - Part Number display
	 */
	var fields = document.getElementsByClassName("part-number-select");

	for (var a = 0; a < fields.length; a++) {
		fields[0].addEventListener("change", function (e) {
			var user_values = e.target.value;
			var gauge = document.getElementById("gauge");
			gauge.innerText = user_values.toString();
		});
		fields[1].addEventListener("change", function (e) {
			var user_values = e.target.value;
			var regulator = document.getElementById("regulator");
			regulator.innerText = user_values.toString();
		});
		fields[2].addEventListener("change", function (e) {
			var user_values = e.target.value;
			var wall = document.getElementById("wall");
			wall.innerText = user_values.toString();
		});
		fields[3].addEventListener("change", function (e) {
			var user_values = e.target.value;
			var patient = document.getElementById("patient");
			patient.innerText = user_values.toString();
		});
		fields[4].addEventListener("change", function (e) {
			var user_values = e.target.value;
			var mri_compatible = document.getElementById("mri_compatible");

			if (user_values === "No MRI") {
				mri_compatible.innerText = "";
			} else {
				mri_compatible.innerText = user_values.toString();
			}
		});
	}

})( jQuery, window, document );


(function ($, window, document) {

	"use strict";

	/**
	 *  Covid - Support Community - date formatting for RSS feed
	 */
	function convertDate(date) {
		for (var x = 0; x < date.length; x++) {
			var current_date = new Date();
			var post_date_text = date[x].innerText;
			var post_date = new Date(post_date_text);
			var timeDiff = Math.abs(current_date - post_date);
			var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			date[x].innerText = daysDiff + " days ago";
		}
	}

	var rss_feed_post_dates = document.getElementsByClassName("days");
	var fb_feed_dates = document.getElementsByClassName("fusion-single-line-meta");

	convertDate(rss_feed_post_dates);

})( jQuery, window, document );


(function ($, window, document) {

	"use strict";

	/**
	 *  Temporary script to move WP tags to top of content to act as an eyebrow
	 */
	var blog_feed_tags = document.getElementsByClassName("fusion-single-line-meta");

	for (var p = 0; p < blog_feed_tags.length; p++) {
		var text_container = blog_feed_tags[p].children;

		if (text_container[4]) {
			var text = text_container[4].innerText;
			var stripped_text = text.substring(6);
			var tags = document.createElement("div");
			tags.innerText = stripped_text;
			var parentDiv = blog_feed_tags[p].parentElement;
			var childDiv = blog_feed_tags[p].previousSibling;
			parentDiv.insertBefore(tags, childDiv);
		}
	}

})( jQuery, window, document );


(function ($, window, document) {

	"use strict";

	/**
	*  Script to take eyebrow from `fusion_blog_shortcode_after_loop` hook and
	*  insert it into the sibling post-content element.
	*/
	var feed_eyebrows = document.getElementsByClassName("fb_blog_eyebrow");

	for (var i = 0; i < feed_eyebrows.length; i++) {
		var text = feed_eyebrows[i].innerText;

		var text_container = document.createElement("div");

		text_container.innerText = text;
		text_container.classList.add("fb_blog_eyebrow_main");

		var parent_container = feed_eyebrows[i].parentElement;

		if ( parent_container.classList.contains("category-featured-article-management-resources") || parent_container.classList.contains("category-featured-article") ) {
			//This moves the eyebrow for the two large blog feeds on Readiness Resource page to the top of their respective containers
			var parent_element = parent_container.childNodes[5];
			if( typeof parent_element !== 'undefined' ){
				var child_container = parent_element.childNodes[0];
				parent_element.insertBefore(text_container, child_container);
			}
		} else if ( parent_container.classList.contains("category-home-top") ) {
			//This moves the eyebrow for the main featured article on COVID19 to the top of the article container and replaces the ACF field with text Featured
			var _parent_element = parent_container.childNodes[5];
			var _child_container = _parent_element.childNodes[0];
			text_container.innerText = "featured";

			_parent_element.insertBefore(text_container, _child_container);
		}
	}

	var logo = document.getElementsByClassName("affiliate_logo");

	for (var ab = 0; ab < logo.length; ab++) {
		var _parent_element2 = logo[ab].parentElement;
		var child_element = _parent_element2.childNodes[1];

		_parent_element2.insertBefore(logo[ab], child_element);
	}

})( jQuery, window, document );


(function ($, window, document) {

	"use strict";

	/**
	 *  JavaScript to remove empty CSS scripts automatically generated by Fusion Builder's Title component
	 */
	var stylesheets = document.getElementsByTagName("style");
	var stylesheets_no_href = [];

	for (var z = 0; z < stylesheets.length; z++) {
		if (stylesheets[z].innerHTML === "") {
			stylesheets_no_href.push(stylesheets[z]);
		}
	}

	for (var y = 0; y < stylesheets_no_href.length; y++) {
		if (stylesheets_no_href[y].sheet.rules.length === 0) {
			stylesheets_no_href[y].remove();
		}
	}

})( jQuery, window, document );


(function ($, window, document) {

	'use strict';

	// DROPDOWN CLASS DEFINITION
	// =========================

	var backdrop = '.dropdown-backdrop'
	var toggle   = '[data-toggle="menu-dropdown"]'
	var MdlnDropdown = function (element) {
		$(element).on('click.mdln.dropdown', this.toggle)
	}

	function getParent($this) {
		var selector = $this.attr('data-target')

		if (!selector) {
			selector = $this.attr('href')
			selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
		}

		var $parent = selector !== '#' ? $(document).find(selector) : null

		return $parent && $parent.length ? $parent : $this.parent()
	}

	function clearMenus(e) {
		if (e && e.which === 3) return
		$(backdrop).remove()
		$(toggle).each(function () {
			var $this         = $(this)
			var $parent       = getParent($this)
			var relatedTarget = { relatedTarget: this }

			//if (!$parent.hasClass('opened')) return

			var isMobile = ( 'ontouchstart' in document.documentElement ) ? true : false ;

			if( !! isMobile && !$parent.hasClass('mobile-opened') ){
				return
			}

			if( !isMobile && !$parent.hasClass('opened') ){
				return
			}

			if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

			$parent.trigger(e = $.Event('hide.mdln.dropdown', relatedTarget))

			if (e.isDefaultPrevented()) return

			$this.attr('aria-expanded', 'false')

			//$parent.removeClass('opened').trigger($.Event('hidden.mdln.dropdown', relatedTarget))

			if( !! isMobile ){
				$parent.removeClass('mobile-opened');
				$parent.find('.dropdown-menu').slideToggle(200, "easeOutQuad");
			} else {
				$parent.removeClass('opened');
			}

			$parent.trigger($.Event('hidden.mdln.dropdown', relatedTarget))

		})
	}

	MdlnDropdown.prototype.toggle = function (e) {
		var $this = $(this)

		if ($this.is('.disabled, :disabled')) return

		var $parent  = getParent($this)
		var isActive = $parent.hasClass('opened')

		var isMobile = ( 'ontouchstart' in document.documentElement ) ? true : false ;

		if( !! isMobile ){
			isActive = $parent.hasClass('mobile-opened')
		}

		clearMenus()

		if (!isActive) {
			if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
				// if mobile we use a backdrop because click events don't delegate
				$(document.createElement('div'))
					.addClass('dropdown-backdrop')
					.insertAfter($(this))
					.on('click', clearMenus)
			}

			var relatedTarget = { relatedTarget: this }
			$parent.trigger(e = $.Event('show.mdln.dropdown', relatedTarget))

			if (e.isDefaultPrevented()) return

			$this
				.trigger('focus')
				.attr('aria-expanded', 'true')


			if( !! isMobile ){
				$parent.toggleClass('mobile-opened');
				$parent.find('.dropdown-menu').slideToggle(200, "easeOutQuad");
			} else {
				$parent.toggleClass('opened');
			}

			$parent.trigger($.Event('shown.mdln.dropdown', relatedTarget))
		}

		return false
	}

	MdlnDropdown.prototype.keydown = function (e) {
		if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

		var $this = $(this)

		e.preventDefault()
		e.stopPropagation()

		if ($this.is('.disabled, :disabled')) return

		var $parent  = getParent($this)
		var isActive = $parent.hasClass('opened')

		if (!isActive && e.which != 27 || isActive && e.which == 27) {
			if (e.which == 27) $parent.find(toggle).trigger('focus')
				return $this.trigger('click')
		}

		var desc = ' li:not(.disabled):visible a'
		var $items = $parent.find('.dropdown-menu' + desc)

		if (!$items.length) return

		var index = $items.index(e.target)

		if (e.which == 38 && index > 0)                 index--         // up
		if (e.which == 40 && index < $items.length - 1) index++         // down
		if (!~index)                                    index = 0

		$items.eq(index).trigger('focus')
	}


	// DROPDOWN PLUGIN DEFINITION
	// ==========================

	function Plugin(option) {
		return this.each(function () {
			var $this = $(this)
			var data  = $this.data('mdln.dropdown')

			if (!data) $this.data('mdln.dropdown', (data = new MdlnDropdown(this)))
			if (typeof option == 'string') data[option].call($this)
		})
	}

	var old = $.fn.dropdown

	$.fn.mdlnDropdown             = Plugin
	$.fn.mdlnDropdown.Constructor = MdlnDropdown


	// DROPDOWN NO CONFLICT
	// ====================

	$.fn.mdlnDropdown.noConflict = function () {
		$.fn.dropdown = old
		return this
	}


	// APPLY TO STANDARD DROPDOWN ELEMENTS
	// ===================================

	$(document)
		.on('click.mdln.dropdown.data-api', clearMenus)
		.on('click.mdln.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
		.on('click.mdln.dropdown.data-api', toggle, MdlnDropdown.prototype.toggle)
		.on('keydown.mdln.dropdown.data-api', toggle, MdlnDropdown.prototype.keydown)
		.on('keydown.mdln.dropdown.data-api', '.dropdown-menu', MdlnDropdown.prototype.keydown)

})( jQuery, window, document );

// (function ($, window, document) {
// 	  $( ".atg-account-link" ).on( "click", function() {
// 		$("#atg-login-modal").show();
// 	  });	  	
// });

// Accessibility Fixes
(function ($, window, document) {
	$(".fusion-tabs .nav-tabs li .tab-link").on("click", function() {
		setTimeout(function() {
			$(".fusion-tabs.clean .nav-tabs li .tab-link").attr("aria-selected", "false");
			$(".fusion-tabs.clean .nav-tabs li.active .tab-link").attr("aria-selected", "true");
		}, 100);
	});	
})( jQuery, window, document );

(function($, window, document) {
    $(document).on('click', '.atg-account-link', function(){ 	
	  var tabbable = $('#atg-login-modal').find('input, textarea, button, a').filter(':visible');
	  var firstTabbable = tabbable.first();
	  var lastTabbable = tabbable.last();
	  /*set focus on first input*/
	  setTimeout(function() {
		firstTabbable.trigger('focus');
	   }, 1000);	
	   
	  /*redirect last tab to first input*/
	  lastTabbable.on('keydown', function (e) {
		if ((e.which === 9 && !e.shiftKey)) {
			e.preventDefault();
			firstTabbable.trigger('focus');
		}
	 });
    });

	$('a[rel="iLightbox"], a[data-rel="iLightbox"]').on('click', function(){
		setTimeout(function() {
			$(".ilightbox-holder.metro-black").find("iframe").trigger('focus');
		}, 500);
	});
	
	//Auto Height Adjust
	var articleHeight = $('.mdln-auto-height .mdln-right-col section').height();
	var rightColHeight = (articleHeight) - 20;
	var leftColheight = $('.mdln-auto-height .mdln-left-col');
	leftColheight.height(rightColHeight);

	$( document ).ready(function() {
		// Mobile Nav dropdown toggle
		var currentWidth = $(window).width();
		if( currentWidth < 768) {
			$('.site-title').append('<button href="#" aria-label="Open submenu of Newsroom" aria-expanded="false" class="fusion-open-submenu"></button>');
			$('.fusion-menu .fusion-mobile-nav-item:not(.site-title)').hide();
			setTimeout(function() {
				$('.site-title .fusion-open-submenu').on('click', function(){
					$('.fusion-menu .fusion-mobile-nav-item:not(.site-title)').toggle();
				});
			}, 500);
		}
	});

})(jQuery, window, document);






