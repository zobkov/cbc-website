Важно встраивать в каждую страницу счетчики Яндекс Метрики и Google Аналитики.

ВАЖНО! Указанные скрипты могут менять в зависимости от настроек счетчиков. Тут должны быть указаны акутальные для рефернса

## Google
Встраивается сразу же после открывающего тега ``<head>``

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5BHBQFSWF3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5BHBQFSWF3');
</script>
```

## Yandex
Встраивается перед закрывающим тегом ``</head>``. В теории можно в любое место head или в самое начало body. 

```html
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106290644', 'ym');

    ym(106290644, 'init', {ssr:false, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/106290644" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
```

