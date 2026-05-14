/**
 * Main MDLN GA4 events
 *
 * @since 1.0.0
 * @since 1.6.0 Added support for Trinity Audio Player and OneTrust cookie preferences.
 * @since 1.6.1 Added support for YouTube iFrame API script and OneTrust cookie preferences.
 * @since 1.6.2 Added support for `OneTrustGroupsUpdated` event.
 * @since 1.6.3 Added support for displaying the cookies blocked message.
 */

/* global dataLayer, MktoForms2, mdlnGA */

/* jshint esversion: 6 */


(function(w,d){

	/**
	 * Conditional Loading: Trinity Audio Player
	 *
	 * Will embed the Trinity Audio Player only if the user has opted in to
	 * Functional cookies (OneTrust cookie group: C0003) or
	 * Performance cookies (OneTrust cookie group: C0002).
	 *
	 * @since 1.4.0
	 */

	/**
	 * @brief Retrieve a cookie based on its name
	 *
	 * @since 1.4.0
	 *
	 * @param [string] $name Name of cookie
	 *
	 * @return mixed string|null String on success. Null if cookie doesn't exist.
	 */
	function getCookie( name ) {
		function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
		var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape( name ) + '=([^;]*)'));
		return match ? match[1] : null;
	}


	/**
	 * @brief Parse cookie set by OneTrust
	 *
	 * OneTrust sets a cookie named `OptanonConsent` like so:
	 * ```
	 * consentId=63b282c7-b4b1-4bbb-aff3-a7a29388a7bf
	 * &datestamp=Tue+Nov+12+2024+14:50:15+GMT-0500+(Eastern+Standard+Time)
	 * &version=202407.2.0
	 * &interactionCount=2
	 * &isAnonUser=1
	 * &isGpcEnabled=0
	 * &browserGpcFlag=0
	 * &isIABGlobal=false
	 * &hosts=
	 * &landingPath=NotLandingPage
	 * &groups=C0004:1,C0001:1,C0003:1,C0002:1
	 * &intType=1
	 * &geolocation=US;IL
	 * &AwaitingReconsent=false
	 * ```
	 * @since 1.4.0
	 *
	 * @param [string] $value Value of the cookie
	 *
	 * @return object Empty object or parsed value of cookie.
	 */
	function parseOptanonCookie( value ) {

		if ( '' === value.trim() ){
			return {};
		}

		let pairs = value.split("&");
		let splitPairs = pairs.map( arr => arr.split("=") );
		let valueObj = {};

		try{
			valueObj = splitPairs.reduce( function (obj, arr) {
				obj[decodeURIComponent( arr[0].trim() )] = decodeURIComponent( arr[1].trim() );
				return obj;
			}, {} );

		} catch(e) {}

		return valueObj;

	}


	/**
	 * @brief Parse `grousp` field in OneTrust cookie
	 *
	 * OneTrust sets a cookie named `OptanonConsent` like so:
	 * ```
	 * consentId=63b282c7-b4b1-4bbb-aff3-a7a29388a7bf
	 * &datestamp=Tue+Nov+12+2024+14:50:15+GMT-0500+(Eastern+Standard+Time)
	 * &version=202407.2.0
	 * &interactionCount=2
	 * &isAnonUser=1
	 * &isGpcEnabled=0
	 * &browserGpcFlag=0
	 * &isIABGlobal=false
	 * &hosts=
	 * &landingPath=NotLandingPage
	 * &groups=C0004:1,C0001:1,C0003:1,C0002:1
	 * &intType=1
	 * &geolocation=US;IL
	 * &AwaitingReconsent=false
	 * ```
	 *
	 * We need to retrieve the value of the `groups` field:
	 * ```
	 * &groups=C0004:1,C0001:1,C0003:1,C0002:1
	 * ```
	 *
	 * @since 1.4.0
	 *
	 * @param [string] $value Value of the cookie
	 *
	 * @return object Empty object or parsed value of cookie.
	 */
	function parseOptanonGroups( value ) {

		if ( '' === value.trim() ){
			return {};
		}

		let pairs = value.split(",");
		let splitPairs = pairs.map( arr => arr.split(":") );
		let valueObj = {};

		try{
			valueObj = splitPairs.reduce( function (obj, arr) {

				obj[decodeURIComponent( arr[0].trim() )] = decodeURIComponent( arr[1].trim() );

				return obj;
			}, {} );

		} catch(e) {}

		return valueObj;
	}


	// check for OneTrust Cookie
	window.mdlnCookiePrefs = {
		'groups' : {
			'C0002' : '1',
			'C0003' : '1',
			'C0004' : '1',
		}
	};

	let optInCookie = getCookie( 'OptanonConsent' );
	let OptanonCookieObj = {};
	let OptanonGroups = '';
	let OptanonGroupsObj = {};

	if( null != optInCookie ){

		OptanonCookieObj = parseOptanonCookie( optInCookie );

		if( OptanonCookieObj.hasOwnProperty('groups') ){
			OptanonGroups = OptanonCookieObj.groups;
		}

		if( '' !== OptanonGroups ) {
			OptanonGroupsObj = parseOptanonGroups( OptanonGroups );
		}

	}


	if( OptanonGroupsObj.hasOwnProperty('C0002') ) {
	   window.mdlnCookiePrefs.groups.C0002 = OptanonGroupsObj.C0002;
	}

	if( OptanonGroupsObj.hasOwnProperty('C0003') ) {
	   window.mdlnCookiePrefs.groups.C0003 = OptanonGroupsObj.C0003;
	}

	if( OptanonGroupsObj.hasOwnProperty('C0004') ) {
	   window.mdlnCookiePrefs.groups.C0004 = OptanonGroupsObj.C0004;
	}


	// check for trinity placeholder
	const playerDiv = document.getElementById('trinityplayer');

	/**
	 * If the player placeholder exists, determine if the player script should load
	 *
	 * @since 1.4.0
	 */
	if ( null != playerDiv ) {

		let showPlayer = true;

		const cookieNotice = document.createElement('div');
		cookieNotice.innerHTML = '<p class="cookies-blocked-notice" style="text-align: center; color: #000; padding: 10px; border: 1px solid #27375c;"><i>This audio player is not available because you have opted out of Functional and/or Performance Cookies. <br> Change your <a id="mdln-cb-msg-ot-prefs" style="cursor:pointer; text-decoration: underline;" class="ot-sdk-show-settings">cookie preferences</a> and refresh the page to enable content.</i></p>';

		if( '0' === window.mdlnCookiePrefs.groups.C0002 ){
			showPlayer = false;
		}

		if( '0' === window.mdlnCookiePrefs.groups.C0003 ){
			showPlayer = false;
		}

		if( true === showPlayer ) {

			const t = playerDiv;
			const trinityScript = document.createElement('script');

			trinityScript.setAttribute('fetchpriority', 'high');
			trinityScript.src = 'https://trinitymedia.ai/player/trinity/2900009258/?pageURL=' + encodeURIComponent(window.location.href);
			t.appendChild(trinityScript);

		} else {
			playerDiv.replaceWith( cookieNotice );
		}

		document.addEventListener("click", event => {
			if ( event.target.id == 'mdln-cb-msg-ot-prefs' ) {
				event.preventDefault();
				OneTrust.ToggleInfoDisplay();
			}
		});

		window.addEventListener("OneTrustGroupsUpdated", event => {
			if( event.detail.includes("C0002") && event.detail.includes("C0003") ){
				showPlayer = true;
			} else {
				playerDiv.replaceWith( cookieNotice );
			}
		});

	}


})(window,document);


(function(w,d){

	/**
	 * mdlnGA Library
	 *
	 * @since 1.1.0
	 */

	w.mdlnGA = w.mdlnGA || {};

	w.mdlnGA.findParentModuleEl = function( el, cls ){
		while ( (el = el.parentElement) && !el.classList.contains(cls) );
		return el;
	};

	w.mdlnGA.hasClass = function( needle, haystack ){

		// if the haystack is a DOMTokenList
		if( typeof haystack === 'object' && 'DOMTokenList' ===  Object.prototype.toString.call(haystack).slice(8, -1) ){
			return haystack.contains(needle);
		}

		// if the haystack is a string
		if( typeof haystack === 'string' ){
			haystack = haystack.split(/\s+/);
		}

		let l = haystack.length,
			i = 0;

		for (; i < l; i++) {
			if ( haystack.indexOf(needle) >= 0 ) {
				return true;
			}
		}

		return false;
	};

	w.mdlnGA.modules = {

		hero : {
			type : 'hero',
			sizes : {
				'sz-sm' : 'Small',
				'sz-md' : 'Medium',
				'sz-lg' : 'Large',
			},
			styles : {
				'hero-a' : 'Hero A',
				'hero-b' : 'Hero B',
				'hero-c' : 'Hero C',
				'hero-h' : 'Home Hero',
				'hero-sh' : 'Home Subhero',
				'hero-fa' : 'Featured Hero A',
				'hero-fb' : 'Featured Hero B',
			},
			images : {
				'img-r' : 'Img-R',
				'img-l' : 'Img-L',
				'img-c' : 'Img-C',
				'img-0' : 'Img-0',
			},
			themes : {
				'bg-w' : 'White',
				'bg-b' : 'Blue',
				'bg-mb' : 'Medium Blue',
				'bg-db' : 'Dark Blue',
				'bg-p' : 'Pink',
				'bg-g' : 'Gray',
				'bg-gn' : 'Green',
			}
		},

		cta : {
			type : 'call-to-action',
			sizes : {
				'sz-col1' : '1-Column',
				'sz-col2' : '2-Column',
			},
			styles : {
				'cta-1'     : 'Fullwidth',
				'cta-1:1'   : '50/50',
				'cta-40:60' : '40/60',
				'cta-60:40' : '60/40',
				'col-1'     : 'Fullwidth',
				'col-1:1'   : '50/50',
				'col-40:60' : '40/60',
				'col-60:40' : '60/40',
			},
			images : {
				'img-r' : 'Img-R',
				'img-l' : 'Img-L',
				'img-c' : 'Img-C',
				'img-0' : 'Img-0',
			},
			themes : {
				'bg-w' : 'White',
				'bg-b' : 'Blue',
				'bg-mb' : 'Medium Blue',
				'bg-db' : 'Dark Blue',
				'bg-p' : 'Pink',
				'bg-g' : 'Gray',
				'bg-gn' : 'Green',
			}
		},

		card_col : {
			type : 'card-column',
			sizes : {
				'sz-col2' : '2-Column',
				'sz-col3' : '3-Column',
				'sz-col4' : '4-Column',
				'sz-col5' : '5-Column',
				'sz-col6' : '6-Column',

			},
			styles : {
				'col-1'     : 'Fullwidth',
				'col-1:1'   : 'Even-columns',
				'col-75:25' : '75/25',
				'col-50:25:25' : '50/25/25',
			},
			images : {
				'img-r' : 'Img-R',
				'img-l' : 'Img-L',
				'img-c' : 'Img-C',
				'img-0' : 'Img-0',
			},
			themes : {
				'bg-w' : 'White',
				'bg-b' : 'Blue',
				'bg-mb' : 'Medium Blue',
				'bg-db' : 'Dark Blue',
				'bg-p' : 'Pink',
				'bg-g' : 'Gray',
				'bg-gn' : 'Green',
			}
		},

	};

})(window,document);


(function(w,d,mg){

	/**
	 * Image Maps
	 *
	 * @since 1.2.0
	 */

    function pollForImageMap (delay) {

        if (isNaN(delay)) {
            throw new Error("Expected delay (" + delay + ") to be a number.");
        }

		const links = document.querySelectorAll( '.imp-object-spot' );

        if( links.length ){

			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let text = el.textContent;
					let title = el.getAttribute('data-title');
					let label = el.getAttribute('data-shape-title');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Plus Points',
								'link_text': text,
								'link_url': window.location.href,
							},
						});
					}

				}, true );
			}

        } else {

            // keep polling, but progressively increase the delay
            setTimeout( pollForImageMap.bind(null, 2 * delay), delay );

        }

    }

	document.addEventListener('DOMContentLoaded', function() {
		pollForImageMap( 125 );
	});


})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Marketo Forms
	 *
	 * @since 1.1.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const forms = document.querySelectorAll( "form[id^='mktoForm_']" );

		if( forms.length && window.MktoForms2 ){

			window.MktoForms2.whenReady(function handleReady (form) {

				let f = form.getFormElem();
				let formName = f.attr('name');
				let formId = f.attr('id');

				// if there's no `name` attribute, try the `id`
				if( ! formName && formId ){
					formName = formId;
				}

				// if the form name is still empty, set a default
				if( ! formName ){
					formName = '-';
				}

				form.onSuccess(function handleSuccess (values, followUpUrl) {

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'form_submitted',
							'form_name': formName
						});
					}

				});

			});

		}

	});


})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Module: Long Form Text
	 *
	 * @since 1.2.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const modules = [ '.mdln-module-long-form', '.mdln-module-numbered-header', '.mdln-module-text-block' ];

		for ( let i = 0; i < modules.length; i++ ) {

			let mod = modules[i];
			let links = document.querySelectorAll( mod + ' a');

			if( links.length ){
				for ( let i = 0; i < links.length; i++ ) {
					let item = links[i];
					item.addEventListener('click', function(e) {
						let el = e.currentTarget;
						let href = el.getAttribute('href');
						let text = el.textContent;
						let title = el.getAttribute('title');
						let label = el.getAttribute('aria-label');

						// if the text is empty, but the title is not, use the title
						if( ( '' === text || null === text ) && '' !== title && null !== title ){
							text = title;
						}

						// aria label takes precedence over everything
						if( '' !== label && null !== label ){
							text = label;
						}

						if( window.dataLayer ){
							window.dataLayer.push({
								'event': 'navigation_click',
								'click': {
									'click_location': 'Body: Long Form Text',
									'link_text': text,
									'link_url': href,
								},
							});
						}

					}, true );
				}
			}

		}

	});


})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Module: Card Columns
	 *
	 * @since 1.1.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-card-col a');
		const targetModClass = 'mdln-module-card-col';
		const targetMod = 'card_col';

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					// module element info
					let parentModuleEl = mg.findParentModuleEl( el, targetModClass );
					let moduleData = mg.modules[targetMod];
					let moduleVersion = [];

					if( ( typeof parentModuleEl !== "undefined" ) && ( parentModuleEl !== null ) ){
						let moduleClasses = parentModuleEl.classList;

						// module size:
						let moduleSizes = moduleData.sizes;
						for ( let key in moduleSizes ) {

							if ( moduleSizes.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleSizes[key] );
							}
						}

						// module style:
						let moduleStyles = moduleData.styles;
						for ( let key in moduleStyles) {
							if ( moduleStyles.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleStyles[key] );
							}
						}

						// module image:
						let moduleImages = moduleData.images;
						for ( let key in moduleImages) {
							if ( moduleImages.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleImages[key] );
							}
						}

						// module theme:
						let moduleThemes = moduleData.themes;
						for ( let key in moduleThemes) {
							if ( moduleThemes.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleThemes[key] );
							}
						}

					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Column',
								'link_text': text,
								'link_url': href,
								'module_version': moduleVersion.join(' '),
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Module: Calls-to-Action
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-cta a');
		const targetModClass = 'mdln-module-cta';
		const targetMod = 'cta';

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					// module element info
					let parentModuleEl = mg.findParentModuleEl( el, targetModClass );
					let moduleData = mg.modules[targetMod];
					let moduleVersion = [];

					if( ( typeof parentModuleEl !== "undefined" ) && ( parentModuleEl !== null ) ){
						let moduleClasses = parentModuleEl.classList;

						// module size:
						let moduleSizes = moduleData.sizes;
						for ( let key in moduleSizes) {

							if ( moduleSizes.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleSizes[key] );
							}
						}

						// module style:
						let moduleStyles = moduleData.styles;
						for ( let key in moduleStyles) {
							if ( moduleStyles.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleStyles[key] );
							}
						}

						// module image:
						let moduleImages = moduleData.images;
						for ( let key in moduleImages) {
							if ( moduleImages.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleImages[key] );
							}
						}

						// module theme:
						let moduleThemes = moduleData.themes;
						for ( let key in moduleThemes) {
							if ( moduleThemes.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleThemes[key] );
							}
						}

					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Call to Action',
								'link_text': text,
								'link_url': href,
								'module_version': moduleVersion.join(' '),
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Hero Banner modules
	 *
	 * @since 1.1.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-hero a');
		const targetModClass = 'mdln-module-hero';
		const targetMod = 'hero';

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					// module element info
					let parentModuleEl = mg.findParentModuleEl( el, targetModClass );
					let moduleData = mg.modules[targetMod];
					let moduleVersion = [];

					if( ( typeof parentModuleEl !== "undefined" ) && ( parentModuleEl !== null ) ){
						let moduleClasses = parentModuleEl.classList;

						// module size:
						let moduleSizes = moduleData.sizes;
						for ( let key in moduleSizes) {

							if ( moduleSizes.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleSizes[key] );
							}
						}

						// module style:
						let moduleStyles = moduleData.styles;
						for ( let key in moduleStyles) {
							if ( moduleStyles.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleStyles[key] );
							}
						}

						// module image:
						let moduleImages = moduleData.images;
						for ( let key in moduleImages) {
							if ( moduleImages.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleImages[key] );
							}
						}

						// module theme:
						let moduleThemes = moduleData.themes;
						for ( let key in moduleThemes) {
							if ( moduleThemes.hasOwnProperty( key ) && mg.hasClass( key, moduleClasses ) ) {
								moduleVersion.push( moduleThemes[key] );
							}
						}

					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Hero Banner',
								'link_text': text,
								'link_url': href,
								'module_version': moduleVersion.join(' '),
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Violator Ads - Inline modules
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-ad-inline a');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Violator Ad: In Line',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Violator Ads - Fullwidth modules
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-ad-full a');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Violator Ad: Full Width',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Related Content modules
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-related-content a');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Related Content',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Social Share Icons
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('div.a2a_kit a');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Social Share',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Arrow Banner modules
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.mdln-module-arrow-banner a.fusion-column-anchor');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Body: Arrow',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Post Breadcrumbs modules
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('.post-breadcrumbs a');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Header: Breadcrumb',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: Micro Menus
	 *
	 * @since 1.0.0
	 */
	document.addEventListener('DOMContentLoaded', function() {

		const links = document.querySelectorAll('nav.mdln-micro-menu-navbar a');

		if( links.length ){
			for ( let i = 0; i < links.length; i++ ) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					let el = e.currentTarget;
					let href = el.getAttribute('href');
					let text = el.textContent;
					let title = el.getAttribute('title');
					let label = el.getAttribute('aria-label');

					// if the text is empty, but the title is not, use the title
					if( ( '' === text || null === text ) && '' !== title && null !== title ){
						text = title;
					}

					// aria label takes precedence over everything
					if( '' !== label && null !== label ){
						text = label;
					}

					if( window.dataLayer ){
						window.dataLayer.push({
							'event': 'navigation_click',
							'click': {
								'click_location': 'Header: Sub Nav',
								'link_text': text,
								'link_url': href,
							},
						});
					}

				}, true );
			}
		}

	});

})(window,document,mdlnGA);


(function(w,d,mg){

	/**
	 * Event tracking: video_present
	 *
	 * We check for the presence of YouTube|Vimeo videos,
	 * and if found, add the `video_present` event to the
	 * `dataLayer` object.
	 *
	 * @since 1.3.0
	 */


	/**
	 * Check if Vimeo videos are present
	 *
	 * First we check for Vimeo iframes.  Then we check for Vimeo
	 * lightbox links if no iframes are found.
	 *
	 * @since 1.3.0
	 */

	let vmPresent = false;

	// check for iframes with "player.vimeo.com" in the `src` attribute
	let vmFrames = document.querySelectorAll('iframe[src*="player.vimeo.com"]');

	if( vmFrames.length ){
		vmPresent = true;
	} else {
		// check for links with "vimeo.com" in the `href` attribute AND a `rel` attribute of "iLightbox"
		let vmLinks = document.querySelectorAll('a[href*="vimeo.com"][rel="iLightbox"]');

		if( vmLinks.length ){
			vmPresent = true;
		}
	}

	window.vimeoPresent = vmPresent;


	/**
	 * Check if YouTube videos are present
	 *
	 * First we check for YouTube iframes.  We then check for YouTube
	 * lightbox links if no iframes are found.
	 *
	 * @since 1.3.0
	 */
	let ytPresent = false;

	// check for iframes with "youtube.com" in the `src` attribute
	let ytFrames = document.querySelectorAll('iframe[src*="youtube.com"]');

	if( ytFrames.length ){
		ytPresent = true;
	} else {
		// check for links with "youtube.com" in the `href` attribute AND a `rel` attribute of "iLightbox"
		let ytLinks = document.querySelectorAll('a[href*="youtube.com"][rel="iLightbox"]');

		if( ytLinks.length ){
			ytPresent = true;
		}
	}

	window.youtubePresent = ytPresent;


	/**
	 * Push to the dataLayer
	 *
	 * @since 1.1.0
	 */
	if( ( !! vmPresent || !! ytPresent ) && window.dataLayer ){
		window.dataLayer.push({
			'event': 'video_present',
			'youtube_present': ytPresent,
			'vimeo_present': vmPresent,
		});
	}


})(window,document,mdlnGA);


(function(w,d){

	/**
	 * Event tracking: YouTube Videos
	 *
	 * If YouTube videos are present we need to load the YouTube iframe script.
	 *
	 * @since 1.3.0
	 * @since 1.6.1 Added check for `window.mdlnCookiePrefs.groups.C0004`
	 */

	if( '1' === window.mdlnCookiePrefs.groups.C0004 && window.youtubePresent && !! window.youtubePresent ) {

		(function(m,d,l,n,y,t){
			t=d.getElementsByTagName(l)[0];
			y=d.createElement(l);
			y.id='mdln-youtube-iframe-api';
			y.src=n;
			y.defer=true;
			t.parentNode.insertBefore(y,t);
		})( window, document, 'script', 'https://www.youtube.com/iframe_api' );

	}

})(window,document);


(function(w,d){

	/**
	 * Event tracking: Vimeo Videos
	 *
	 * If Vimeo videos are present we need to load the Vimeo GA4 script.
	 *
	 * @since 1.3.0
	 */

	if( window.vimeoPresent && !! window.vimeoPresent ) {

		(function(m,d,l,n,v,o){
			o=d.getElementsByTagName(l)[0];
			v=d.createElement(l);
			v.id='mdln-vimeo-ga4';
			v.src=n;
			v.defer=true;
			o.parentNode.insertBefore(v,o);
		})(	window, document, 'script', 'https://extend.vimeocdn.com/ga4/10552609.js' );

		let links = document.querySelectorAll('a[href*="vimeo.com"][rel="iLightbox"]');

		if (links.length) {
			for (let i = 0; i < links.length; i++) {
				let item = links[i];
				item.addEventListener('click', function(e) {
					if( window.__vimeoRefresh ){
						setTimeout(function(){
							window.__vimeoRefresh();
							}, 500);
					}
				}, true);
			}
		}

	}

})(window,document);