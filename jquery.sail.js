(function( _w, $ ) {

    function Sail( conf, myApp ) {

        conf  = conf  || {};
        myApp = myApp || {};

        myApp.update = function( data, status, request ) {
            var $head = $( '<head />' ).html( data.replace( /([^]+<head[^>]*>|<\/head>[^]+)/g, '' ) );
            history.pushState( '', $head.find( 'title' ).text(), request.requestedURL );
            if ( conf.callback && typeof conf.callback == 'function' ) {
                conf.callback();
            }
            var $frame = $( conf.frame );
            $frame.trigger( 'pjaxUpdateContentBefore' );
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
            $body = $( '<div />' ).html( data.replace( /([^]+<body[^>]*>|<\/body>[^]+)/g, '' ) );
            $frame.trigger( 'pjaxUpdateContentBefore' );
            $.each( conf.area, function( n, val ) {
                var area   = $.trim( val )
                  , $areas = $( area );
                if ( $areas.length ) {
                    $( $areas[ $areas.length - 1 ] ).html( $body.find( area.split( ',' )[ 0 ] ).html() );
                }
            });
            $frame.trigger( 'pjaxUpdateContentAfter' );
        };

        myApp.fetch = function( event ) {
            var el = this;
            if ( ! el.href ) {
                el.href = _w.location.pathname;
            }
            var isValid = ! conf.filter || ( conf.filter && conf.filter.call( el, event ) );
            if ( isValid ) {
                event.preventDefault();
                event.stopPropagation();
                $( el ).trigger( 'click.pjax' );
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
            }
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
                area: [ '.article' ]
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
                        if ( pureURL( this.href ) === pureURL( _w.location.href ) ) {
                            // Anchor or something like this
                            isValid = false;
                        }
                        if ( ! /(\.html|\.shtml|\.php|\.asp|\/)$/.test( pureURL( this.href ) ) ) {
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
                            // An other language / version
                            isValid = false;
                        }
                        return isValid;
                    };
                }()
              , link: 'a'
              , head: [
                    'title'
                  , 'meta[name^=\'keyword\']'
                  , 'meta[name^=\'description\']'
                  , 'meta[property^=\'og\']'
                  , 'meta[name^=\'twitter\']'
                  , 'link[rel=\'canonical\']'
                  , 'link[rel=\'prev\']'
                  , 'link[rel=\'next\']'
                ].join( ', ' )
              , frame: this || _w
            }, options || {}) );
        });
    };

})( window, jQuery );
