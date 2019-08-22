@lobaton/search
===============
Genera en Lobaton_ una barra para la búsqueda de centros y localidades.

Instalación
-----------
Usando NodeJS_:

.. code-block:: console

   $ npm install git+https://github.com/sio2sio2/lobaton-search

Dentro de un desarrollo puede importarse del siguiente modo:

.. code-block:: js

   // Otras dependencias (leaflet, etc) ...
   import "@lobaton/core";

   import "@lobaton/seach/dist/search.bundle.css";
   import "@lobaton/search/src/search.js";

Si se usa un **navegdor**, hay dos alternativas:

- Si se usa el sabor *bundle*, se puede prescindir de la carga de dos de sus
  dependencias (`leaflet-search`_ y `fuse.js`)\ [#]_:

  .. code-block:: html


     <link rel="stylesheet"
           href="https://sio2sio2.github.io/lobaton-search/dist/search.bundle.css">
     <script src="https://sio2sio2.github.io/lobaton-search/dist/search.bundle.js"></script>

- Si se usa el sabor *normal*, es necesario incluirlas:

  .. code-block:: html

     <!-- Plugin: Leaflet Control Search -->
     <link rel="stylesheet"
           href="https://unpkg.com/leaflet-search@2.9.8/dist/leaflet-search.min.css">
     <script src="https://unpkg.com/leaflet-search@2.9.8/dist/leaflet-search.src.js"></script>
     <!-- Fuse.js: Fuzzy-search -->
     <script src="https://unpkg.com/fuse.js"></script>

     <script src="https://sio2sio2.github.io/lobaton-search/dist/search.js"></script>

Uso
---
El *plugin* añade al objeto ``Lo`` de **Lobatón**, el atributo ``Lo.search`` con
dos utilidades:

**Lo.search.bar(obj, pos)**
   Genera un cajetín de búsqueda generado con `leaflet-search`_:

   .. code-block:: js

      g = Lo.lobaton({
         // opciones de creación del objeto.
      });

      g.map.addControl(Lo.search.bar(g, "topright"));

**Lo.search.getItems(obj, pattern)**
   Devuelve un *array* con las marcas de los centros y localidades que cumplen
   con el patrón suministrado:

   .. code-block:: js

      Lo.search.getItems(g, "mirav");
   
En ambos casos, la búsqueda sólo se realiza entre los centros y localidades
visibles en el mapa o agrupados dentro de un clúster.

.. rubric:: Notas al pie

.. [#]  Las otras dos evidentes (`Leaflet`_ y `@lobaton/core`_), no están
   incluidas.

.. _NodeJS: http://nodejs.org
.. _Lobaton: https://github.com/sio2sio2/lobaton-core
.. _@lobaton/core: https://github.com/sio2sio2/lobaton-core
.. _leaflet-search: https://github.com/stefanocudini/leaflet-search
.. _fuse.js: https://fusejs.io/
