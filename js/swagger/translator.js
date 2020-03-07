'use strict';

/**
 * Translator for documentation pages.
 *
 * To enable translation you should include one of language-files in your index.html
 * after <script src='lang/translator.js' type='text/javascript'></script>.
 * For example - <script src='lang/ru.js' type='text/javascript'></script>
 *
 * If you wish to translate some new texts you should do two things:
 * 1. Add a new phrase pair ("New Phrase": "New Translation") into your language file (for example lang/ru.js). It will be great if you add it in other language files too.
 * 2. Mark that text it templates this way <anyHtmlTag data-sw-translate>New Phrase</anyHtmlTag> or <anyHtmlTag data-sw-translate value='New Phrase'/>.
 * The main thing here is attribute data-sw-translate. Only inner html, title-attribute and value-attribute are going to translate.
 *
 */
export let SwaggerTranslator = {

  _words:[],
  _sel:'',
  _text:'',

  translate: function(sel) {
    var $this = this;
    sel = sel || '[data-sw-translate]';

    $this._sel = sel;
    $this._text = $($this._sel).html();

    // console.log($(sel));

    $(sel).each(function() {

      // console.log($this);

      // $(this).html($this._tryTranslate($(this).html()));

      Object.keys($this._words).forEach(function (value, index) {

        // console.log(value);
        let etext = $this._text;
        $this._text = etext.replace(new RegExp(value, 'gm'), 'Протоколы');
        // console.log(etext);
      });


      // let locale_HTML = document.body.innerHTML;
      // document.body.innerHTML = locale_HTML;


// console.log($this._text);

// $(this).html($this._text);

      // $(this).val($this._tryTranslate($(this).val()));
      // $(this).attr('title', $this._tryTranslate($(this).attr('title')));
    });
  },

  _tryTranslate: function(word) {
    // console.log($.trim(word));

    let obj = this._words;

    let newstr;
    Object.keys(obj).forEach(function (value, index) {

      // console.log(value);
      // console.log(obj[value]);
      // console.log(new RegExp('Status', 'gm'));

      // newstr = word.replace('/Schemes/gm', obj[value]);
      $(sel).html(word.replace('/Schemes/gm', 'Протоколы'));

    });


    console.log(newstr);

    // for (var key in obj){
      // console.log(key);
      // let replace = word.replace(new RegExp(key, 'gi'), this._words[key]);
      // return replace;
    // }


    // return this._words[$.trim(word)] !== undefined ? this._words[$.trim(word)] : word;
  },

  learn: function(wordsMap) {
    this._words = wordsMap;
  }
};


