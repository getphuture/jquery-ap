# jQuery Sail

Offrez à vos visiteurs une expérience ajax fluide !

# Table des matières 

* [API](#api)
  * [Core](#core)
    * [area](#area)
    * [aria](#aria)
    * [head](#head)
  * Callbacks

# API

## Core

### area

Type: Array / Défaut: [ '#sail' ]
Liste des noeuds à mettre à jour. Pour préserver l'ordre de mise à jour, donnez en argument un tableau 
contenant le nom des noeuds. Pas un object jQuery ou une référence à un noeud DOM.

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area: [ '#main' ]  // ok recommendé
  /*
    area: [ '#main', '#side' ]  // #main et ensuite #side
    area: [ '#side', '#main' ]  // #side et ensuite #main
    area: $( '#main' ) // Devrait marcher...
    area: $( '#main, #side' ) // Mais la séquence dépendra de 
                              // la position des noeuds dans le document
    area: '#main' // Pas pour le moment
    area: document.getElementById( 'main' ) // Non
    area: document.getElementsByClassName( 'section' ) // Non
  */
});</code></pre>

* <a href="/alpha/jquery/demos/sail/basic1/" target="_blank">Démo 1 avec une zone mise à jour</a>
* <a href="/alpha/jquery/demos/sail/basic2/" target="_blank">Démo 2 avec deux zones mises à jour</a>

### aria

Type: Booléen / Défaut: true
Ajoute une notification aria et avertit en direct l'utilisateur en cas d'un changement de page.

### Fonction_ callback

Fonction exécutée juste après le succès de la requête ajax.  
Ne seras pas exécuté en cas d'erreur. 
Par défaut met à jour Google Analytics pageview si disponible.

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // Désactiver
 /* // Par défaut ressemble à ceci:
    callback: function() {
        if ( window.ga ) {
            window.ga( 'send', 'pageview', _w.location.pathname + _w.location.search );
        }
    }
  */
});</code></pre>

### _String_ link, _Function_ Filter

Détermine quel contenu doit être chargé.  
Vous pouvez décider quels éléments doivent être vérifiés avec le paramètre _link_. 
Par défault 'a' (tous les liens de la page). Vous pouvez utilisez les sélecteurs 
jQuery.  
Ensuite vous pouvez include ou exclude des éléments avec le paramètre _filter_.
Par défaut il s'agit d'une simple function pour exclude les ancres, les liens de 
domaine différents et les liens s'ouvrant dans une nouvelle fenêtre. Il s'agit 
simplement d'une function contentant une série de conditions retournant un booléen.


<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false
  , link:     'a[href^="http://www.foo\.com"]' // Personnaliser
  , filter:   false // Désactiver
});</code></pre>

### head @type Chaîne de caractères 

~~~javascript
head: 'title, keyword, description, og, twitter, canonical, prev, next, alternate'
~~~

Noeuds dans l'en-tête html qui doivent être mises à jour.  
Sélecteurs spécifiques jQuery. Par défaut

* titre
* les balises description et mots-clés
* les balises Open Graph
* les balises Twitter
* les balises itemprop
* les balises de liens canonical, suivant, précédent et alternatifs

A part la balise de titre il est préférable d'utiliser un sélecteur spécifique comme par exmple:

~~~javascript
head: "titre, meta[http-equiv='toto']"
~~~

Si le sélecteur ne contient pas de crochets ( "[" or "]" ) par exemple

~~~javascript
head: 'title, toto'
~~~

Le plugin recherchera automatiquement les modèles suivants:

- titre
- meta[name^='toto']
- meta[property^='toto']
- meta[toto]
- link[rel='toto']
- link[toto]

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // Désactiver
  , link:     'a[href^="http://www.foo\.com"]' // Personnaliser
  , filter:   false // Désactiver
  , head:     'title' // Titre seulement
});</code></pre>

### Object ajax

Permet de définir des options jQuery ajax comme _timeout_ ou _cache_.