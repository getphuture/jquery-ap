/*
 ___  ___  ____  _____
/  __\ _ \| |\_\| ___/
  |__ |_| |  \  |  _|
\___/\___/|_|\_\|____|

 */

(function( _w, $ ) {

    $.isMobile = (function( ua ) {
        return { // Inspired by http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/
            Android: function() {
                return ua.match( /Android/i );
            }
          , BlackBerry: function() {
                return ua.match( /BlackBerry/i );
            }
          , iOS: function() {
                return ua.match( /iPhone|iPad|iPod/i );
            }
          , Opera: function() {
                return ua.match( /Opera Mini/i );
            }
          , webOS: function() {
                return ua.match( /webOS/i );
            }
          , Windows: function() {
                return ua.match( /IEMobile|Windows Phone/i );
            }
          , any: function() {
                // Adding reference from https://developer.mozilla.org/ja/docs/Gecko_user_agent_string_reference
                return ( ua.match( /mobi/i ) || this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.webOS() || this.Windows() );
            }
        };
    }( _w.navigator && _w.navigator.userAgent ? _w.navigator.userAgent : '' ));

    $.isRetina = (function() { // From Retina JS
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
        if ( _w.devicePixelRatio > 1 ) {
            return true;
        }
        if ( _w.matchMedia && _w.matchMedia( mediaQuery ).matches ) {
            return true;
        }
        return false;
    })();

})( window, jQuery );
