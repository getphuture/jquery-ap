# jQuery Sail

その他pjaxライブラリー。  
円滑なページを切り替えるように！

# 目次



* [API](#api)
  * [Core](#core)
    * [area](#area)
    * [aria](#aria)
    * [head](#head)
  * Callbacks



# API

## Core

### area

Type Array of Strings / Default: [ '#sail' ]  
更新範囲の設定です。更新の順番を守るためノードのリストでまとめる。  
jQueryやDOMオブジェクットじゃない。

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area: [ '#main' ]  // オススメ
  /*
    area: [ '#main', '#side' ]  // ○ 順番：#main後は#side
    area: [ '#side', '#main', #footer ]  // ○ 順番：#side後は#main最後#footer
    area: $( '#main' ) // 大丈夫かも。。。
    area: $( '#main, #side' ) // 。。。順番はドキュメントの中
                              // のノードポジーション
    area: '#main' // ×（今では調整していません）
    area: document.getElementById( 'main' ) // ×
    area: document.getElementsByClassName( 'section' ) // ×
  */
});</code></pre>

* <a href="https://get.phutu.red/alpha/jquery/demos/sail/basic1/" target="_blank">デモ１：エリア一つ</a>
* <a href="https://get.phutu.red/alpha/jquery/demos/sail/basic2/" target="_blank">デモ２：エリア二つ</a>

### aria

Boolean / True  
アクセシビィティ為にページタイトルのを自動的にお知らせするように。

### Function_ callback

コールバックの設定です。いつでもajaxのサックセース後に。  
デフォルトは「Google Analytics」を更新する。

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // 無効にする
 /* デフォルトのコールバック
    callback: function() {
        if ( _w.ga ) {
            _w.ga( 'send', 'pageview', _w.location.pathname + _w.location.search );
        }
    }
 */
});</code></pre>

### _String_ link, _Function_ Filter

どのコンテンツを読みむ。  
はじめに _link_ のパラメーターでタッグを選択する。デフォルトは「a」です（全てのリンク）。
jQueryセレクターを使用する可能。
最後は _filter_ のパラメーターでアイテムを無効にすることができます。デフォルトアンカー、
別のドメインのリンクや新ウィンドウーに開くリンクはこのままで自然に動いているようになります。

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false
  , link:     'a[href^=\'http://www.foo\.com\'],a[href^=/],a[data-url]' // カスタム
  , filter:   false // 無効にする
});</code></pre>

### 文字列 head

~~~
head: 'title, keyword, description, og, twitter, canonical, prev, next, alternate'
~~~

HTMLヘッダーの中にあるタグの設定です。デフォルトは：

* タイトルタグ
* キーワードと説明のタグ
* OGタグ
* Twitterタグ
* Itempropタグ
* Canonical、Alternate、前へ、次へのリンクタグ

特定のセレクターを使用してください。例：

~~~javascript
head: "title, meta[http-equiv='foo']"  
~~~

「 [ 」や「 ] 」がないの場合はこのプラグインは自動的にセレクターを探すようになります：

```javascript
head: 'title, foo'
```

そしたら本当のセレクター：

- title
- meta[name^='foo']
- meta[property^='foo']
- meta[foo]
- link[rel='foo']
- link[foo]

<pre lang="javascript" class="lang-javascript"><code>$( window ).sail({
    area:     [ '#main' ]
  , callback: false // 無効にする
  , link:     'a[href^=\'http://www.foo\'],a[href^=/],a[data-url]' // カスタム
  , filter:   false // 無効にする
  , head:     'title' // タイトルだけ
});</code></pre>