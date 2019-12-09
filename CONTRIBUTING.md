## Layer

Tipo abstrato de dados que representa uma imagem exibida no mapa. Contém os seguintes valores:

**image**: um objeto do tipo [ee.Image](https://developers.google.com/earth-engine/api_docs#eeimage).

**title**: o nome da camada, a ser exibido no painel.

**params**: parâmetros de visualização de imagem ([info](https://developers.google.com/earth-engine/api_docs#eedatagetmapid)]. Padrão: {}

**overlay**: [ee.OverlayMapType](https://github.com/google/earthengine-api/tree/master/demos/map-layer) associado com *image*, o qual pode ser inserido em *Map*.

**histogram**: histograma da imagem obtido através [deste algoritmo](https://developers.google.com/earth-engine/api_docs#eereducerhistogram).

**opacity**: opacidade ∈ \[0, 1\] da imagem no mapa.

**visible**: boolean que define se a imagem é visível ou não.

**parentIndex**: índice da *Image* a qual esta camada pertence.

**role**: papel que a camada desempenha em relação à Image. Valores possíveis: "base", "ndwi", "ndvi", "other" (constants.js).

\[**threshold**\]: ponto de limiarização. Abaixo este nível, a imagem será preta; acima, será branca.

\[**thresholdedImage**\]: *image* após o processo de limiariazação com o ponto definido.

\[**thresholdedOverlay**\]: [ee.OverlayMapType](https://github.com/google/earthengine-api/tree/master/demos/map-layer) associado com *thresholdedImage*.