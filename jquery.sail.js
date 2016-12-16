/* @license MIT LICENSE https://github.com/grenouille220/jquery-sail/blob/master/LICENSE */
(function( _w, $ ) {

    function Sail( conf, myApp ) {

        conf  = conf  || {};
        myApp = myApp || {};
        var pIndex = 0;

    	conf.head = (function( heads ) {
        	var arr = [];
            for ( var curr, i = 0, prms = heads.split( ',' ), lim = prms.length; i < lim; i++ ) {
            	curr = prms[ i ].replace( /^\s+|\s+$/g, '' );
            	if ( curr === 'title' || /\[/.test( curr ) ) {
                	arr.push( curr );
                }
            	else {
                	arr.push( "meta[name^='" + curr + "']" );
                	arr.push( "meta[property^='" + curr + "']" );
                	arr.push( "meta[" + curr + "]" );
	                arr.push( "link[rel='" + curr + "']" );
                	arr.push( "link[" + curr + "]" );
                }
            }
        	return arr.join( ',' );
        })( conf.head || '' );
    
        myApp.notify = function( str ) {
            // https://github.com/techvision/waiable/issues/22
            // http://stackoverflow.com/questions/28282264/optimise-turbolinks-for-screen-readers
            if ( $ && $.a11yfy ) {
                $.a11yfy.assertiveAnnounce( str );
            }
            else {
                var $assertiveAnnouncer = $( '.jquery-a11yfy-assertiveannouncer' );
                if ( ! $assertiveAnnouncer || ! $assertiveAnnouncer.length ) {
                    var css = document.createElement( 'style' )
                      , def = '.offscreen { border: 0; clip: rect(0 0 0 0); clip: rect(0, 0, 0, 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; width: 1px; position: absolute; }';
                    // http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
                    css.setAttribute( 'type', 'text/css' );
                    $( 'head' ).append( css );
                    if ( css.styleSheet ) { // IE
                        css.styleSheet.cssText = def;
                    }
                    else {
                        css.appendChild( document.createTextNode( def ) );
                    }
                    for ( var n = 0; n < 2; n++ ) {
                        $( 'body' ).append( $( '<div>' ).attr({
                            'id':            'jquery-a11yfy-assertiveannouncer' + n
                          , 'class':         'jquery-a11yfy-assertiveannouncer'
                          , 'role':          'log'
                          , 'aria-live':     'assertive'
                          , 'aria-relevant': 'additions'
                        }).addClass( 'offscreen' ) );
                    }
                    $assertiveAnnouncer = $( '.jquery-a11yfy-assertiveannouncer' );
                }
                $( $assertiveAnnouncer[ pIndex ] ).empty();
                pIndex += 1;
                pIndex = pIndex % 2;
                $( $assertiveAnnouncer[ pIndex ] ).append( $( '<p>' ).text( document.title ) );
            }
        };

		myApp.setLazyloadView = function( $el ) {
			_w.Waypoint.destroyAll();
 	         // https://codepen.io/shshaw/post/responsive-placeholder-image
             var loader;
        	$el.find( 'img' ).each(function() {
            	var $img   = $( this )
                  , width  = $img.attr( 'width' ) || 20
                  , height = $img.attr( 'height' ) || 15;
            	if ( ! $img.attr( 'data-fullsize' ) ) {
                	$img.attr( 'data-fullsize', $img.attr( 'src' ) );
                }
            	var loader, attrs  = [ 'thumb', 'thumbnail', 'preload' ];
                for ( var i = 0, lim = attrs.length; i < lim; i++ ) {
                	loader = $img.attr( 'data-' + attrs[ i ] ) || false;
                	if ( loader && loader.length ) {
                    	$img.removeAttr( 'data-' + attrs[ i ] );
                    	break;
                    }
                }
            	if ( ! loader ) {
                	loader = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' id%3D'jquerysail' width%3D'" + width + "' height%3D'" + height + "' viewBox%3D'0 0 " + width + " " + height + "'%2F%3E";
                }
            	$img.attr( 'src', loader ).wrap( '<span class="jquery-sail-placeholder jquery-placeholder-image"></span>' );
            });
        	$el.find( 'iframe' ).each(function() {
            	var $iframe = $( this )
                  , width = $iframe.attr( 'width' ) || 20
                  , height = $iframe.attr( 'height' ) || 15
                  , src = $iframe.attr( 'src' );
                $iframe.wrap( '<span class="jquery-sail-placeholder jquery-placeholder-iframe"></span>' );
            	loader = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' id%3D'jquerysail' width%3D'" + width + "' height%3D'" + height + "' viewBox%3D'0 0 " + width + " " + height + "'%2F%3E";
            	if ( /youtube/.test( src ) ) {
                	// http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
                	var regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    				var match = src.match(regExp);
   					if ( match && match.length && match[1] ) {
                        loader = '//img.youtube.com/vi/' + match[ 1 ] + '/0.jpg';
                    }
                }
            	$iframe.parent().append( '<img src="' + loader + '" width="' + width + '" height="' + height + '" alt="" data-fullsize="' + $iframe.parent().html().replace(/"/g, '&quot;')  +'" />' );
            	$iframe.remove();
            });
        	return $el;
        };
    
	    myApp.setLazyloadEvents = function( $el ) {
        	$el.find( '.jquery-placeholder-iframe img' ).each(function() {
            	$( this ).parent().data( 'fullsize', $( this ).attr( 'data-fullsize' ) );
            	$( this ).removeAttr( 'data-fullsize' );
            }).waypoint({
            	handler: function() {
					var delay    = 200
                      , waypoint = this
                      , el       = waypoint.element;
                	setTimeout(function() {
                    	var $el = $( el );
                    	$el.replaceWith( $el.parent().data( 'fullsize' ) );
                        _w.Waypoint.refreshAll();
                    }, delay );
                	waypoint.destroy();
            	}
              , offset: '90%'
            });
        	$el.find( '.jquery-placeholder-image img' ).each(function() {
            	$( this ).data( 'fullsize', $( this ).attr( 'data-fullsize' ) );
            	$( this ).removeAttr( 'data-fullsize' );
            }).waypoint({
            	handler: function() {
					var delay    = 0
                      , waypoint = this
                      , el       = waypoint.element;
                	setTimeout(function() {
                    	var $el = $( el )
                          , img = new Image();
                        img.onload = function() {
	                    	$el.attr( 'src', this.src ).addClass( 'loaded' );
                        };
                    	img.src = $el.data( 'fullsize' );
                        _w.Waypoint.refreshAll();
                    }, delay );
                	waypoint.destroy();
            	}
              , offset: '90%'
            });
        	return $el;
        };

        myApp.update = function( data, status, request ) {
            var $head = $( '<head />' ).html( data.replace( /([^]+<head[^>]*>|<\/head>[^]+)/g, '' ) );
            history.pushState( '', $head.find( 'title' ).text(), request.requestedURL );
            var $frame = $( conf.frame );
            if ( conf.head && conf.head.length ) {
                $frame.trigger( 'pjaxUpdateHeadBefore' );
                $( 'head' ).find( conf.head ).remove();
                $head.find( conf.head ).appendTo( 'head' );
                $frame.trigger( 'pjaxUpdateHeadAfter' );
            }
            var bodyAttributes = data.match( /<body(.*?)>/ )
              , $body = $( 'body' ).removeAttr( 'id' ).removeAttr( 'class' );
            if ( bodyAttributes && bodyAttributes.length && bodyAttributes[1] ) {
                var $tmp  = $( '<div ' + bodyAttributes[ 1 ] + '></div>' );
                $.each([ 'id', 'class' ], function( i, attr ){
                    var val = $tmp.attr( attr ) || '';
                    if ( val && val.length ) {
                        $body.attr( attr, val );
                    }
                });
            }
            var $newContent = $( '<div />' ).html( data.replace( /([^]+<body[^>]*>|<\/body>[^]+)/g, '' ) );
            $.each( conf.area, function( n, val ) {
                var area   = $.trim( val )
                  , $areas = $( area )
                  , $currContent;
                if ( $areas.length ) {
                    if ( ! conf.softReplace ) {
                        if ( conf.pjaxUpdateContentBefore && typeof conf.pjaxUpdateContentBefore === 'function' ) {
	                        $( $areas[ $areas.length - 1 ] ).html( conf.pjaxUpdateContentBefore( $newContent.find( area.split( ',' )[ 0 ] ), conf.lazyload && _w.Waypoint ? myApp.setLazyloadView : function( $html ) { return $html.html(); }) );                        	
                        }
                    	else {
	                        $( $areas[ $areas.length - 1 ] ).html( $newContent.find( area.split( ',' )[ 0 ] ).html() );
                        }
                    }
                    else {
                        $currContent = $( $areas[ $areas.length - 1 ] );
                        $currContent.parent().addClass( 'ui-state-pjax-before' );
                        $currContent.addClass( 'isOldBarba' ).css({
                            position: 'absolute'
                          , top: ( -1 * $( window ).scrollTop() + $currContent.offset().top ) + 'px'
                        }).after( $newContent.find( area.split( ',' )[ 0 ] ).addClass( 'isNewBarba' ) );
                        $currContent.parent().addClass( 'ui-state-pjax-after' );
                    }
                }
            });
            $( window ).scrollTop( 0 );
            $.each( conf.area, function( n, val ) {
                var area   = $.trim( val )
                  , $areas = $( area );
                if ( $areas.length ) {
                    if ( ! conf.softReplace ) {
                        if ( conf.pjaxUpdateContentAfter && typeof conf.pjaxUpdateContentAfter === 'function' ) {
	                        conf.pjaxUpdateContentAfter( $( $areas[ $areas.length - 1 ] ), conf.lazyload && _w.Waypoint ? myApp.setLazyloadEvents : function( $html ) { return $html; });                        	
                        }
                    }
                    else {
                    }
                }
            });
            if ( conf.callback && typeof conf.callback === 'function' ) {
                conf.callback();
            }
            if ( /title/.test( conf.head || '' ) && conf.aria ) {
                myApp.notify( document.title );
            }
        };

        myApp.fetch = function( event ) {
            var el = this;
            if ( ! el.href ) {
                el.href = _w.location.pathname;
            }
            var isValid = ! conf.filter || ( conf.filter && conf.filter.call( el, event ) );
            if ( ! isValid ) {
            	return;
            }
			var opts = {
    			url:       el.href
    		  , container: $(el).attr('data-pjax')
              , target:    el
              , push:      true
              , replace:   false
              , scrollTo:  0
              , type:      "GET"
              , dataType:  "html"
            };
			var pjaxClickEvent = $.Event( 'pjax:click' )
              , sailClickEvent = $.Event( 'sail:click' );
        	$( el ).trigger( pjaxClickEvent, [ opts ] ).trigger( sailClickEvent, [ opts ] );
			if ( pjaxClickEvent.isDefaultPrevented() || sailClickEvent.isDefaultPrevented() ) {
            	return;
            }
			event.preventDefault();
        	$( el ).trigger( 'pjax:clicked', [ opts ] ).trigger( 'sail:clicked', [ opts ] ).trigger( 'linkClicked', [ document.documentElement ] );
            var $frame = $( conf.frame );
            var ajaxSetup = conf.ajax;
            ajaxSetup.url = this.href;
            ajaxSetup.processData = false;
            ajaxSetup.beforeSend = function(jqxhr, settings) {
                jqxhr.requestedURL = ajaxSetup.url;
                $frame.trigger( 'pjaxAjaxBeforeSend' );
            };
            ajaxSetup.complete = function() {
                $frame.trigger( 'pjaxAjaxComplete' );
            };
            ajaxSetup.success = myApp.update;
            $.ajax( ajaxSetup );
        };

        myApp.ajaxify = function() {
            if ( $.fn.live ) {
                $( conf.link ).live( 'click', myApp.fetch );
            }
            else if ( $.fn.on ) {
                $( document ).on( 'click', conf.link, myApp.fetch );
            }
            else {
                // ...
            }
        };

        myApp.ajaxify();
        $( window ).bind( 'popstate', myApp.fetch );

    }

    $.fn.sail = function( options ) {
        if ( ! this.length ) {
            return this;
        }
        return this.each(function() {
            new Sail( $.extend({
                area: [ '#sail' ]
              , aria: true
              , ajax: {
                    timeout: 5000
                }
              , callback: function() {
                    if ( _w.ga ) {
                        _w.ga( 'send', 'pageview', _w.location.pathname + _w.location.search );
                    }
                }
              , filter: function() {
                    var pureURL = function( url ) {
                        return url.split( '#' )[ 0 ].split( '?' )[ 0 ];
                    };
                    return function( event ) {
                        var isValid = true;
                        if ( ! this || ! this.href ) {
                            // No element or not link
                            isValid = false;
                        }
                        var currURL  = pureURL( this.href );
                        if ( currURL === pureURL( _w.location.href ) ) {
                            // Anchor or something like this
                            isValid = false;
                        }
                        if ( ! /(\/|\.html|\.shtml|\.asp|\.php)$/.test( pureURL( currURL ) ) ) {
                            // Image, video or anything else
                            isValid = false;
                        }
                        if ( this.target && ! /self/.test( this.target ) ) {
                            // New window link so skip...
                            isValid = false;
                        }
                        if ( event.which > 1 || event.metaKey || event.ctrlKey
                        || event.shiftKey || event.altKey ) {
                            // New window link (defunkt/jquery-pjax)
                            isValid = false;
                        }
                        if ( this.hreflang && document.documentElement && document.documentElement.lang && this.hreflang !== document.documentElement.lang ) {
                            isValid = false;
                        }
                        return isValid;
                    };
                }()
              , link: 'a'
              , head: 'title, keyword, description, og, twitter, itemprop, canonical, prev, next, alternate'
              , frame: this || _w
              , softReplace: 0
              , lazyload: 1
              , pjaxUpdateContentBefore: function( $el, lazyloader ) {
                    return lazyloader( $el ).html();
                }
              , pjaxUpdateContentAfter: function( $el, lazyloader ) {
              		return lazyloader( $el );
                } // Void
            }, options || {}) );
        });
    };

})( window, jQuery );