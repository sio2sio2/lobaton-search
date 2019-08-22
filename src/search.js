import Search from "leaflet-search";
import Fuse from "fuse.js";

/**
 * Obtiene los candidatos mediante una búsqueda difusa.
 */
export function getItems(adjofer, pattern) {
   const pathData = adjofer.Centro.prototype.options.mutable;

   return new Fuse(
      adjofer.cluster.getLayers(),
      {
         keys: [pathData + ".id.nom",
                pathData + ".nom",
                pathData + ".id.loc",
                pathData + ".id.mun"],
         minMatchCharLength: 3,
         shouldSort: true,
         threshold: 0.6
      }
   ).search(pattern);
}


// Issue #51
export function searchBar(adjofer, position) {
   position = position || "topright";
   // CodidoProvincial: Nombre del instituto
   const label = (d) => `${String(d.id.cp).substring(0,2)}: ${d.id.nom}`;

   const control = new Search({
      position: position,
      textPlaceholder: "Busque por nombre",
      textErr: "No encontrado",
      initial: false,
      // Así nos aseguramos que se ve la marca seleccionada.
      zoom: adjofer.cluster.options.disableClusteringAtZoom,
      marker: false,
      minLength: 3,
      sourceData: (text, callback) => {
         callback(adjofer.cluster.getLayers().map(m => {
            const data = m.getData();
            return {
               title: label(data),
               loc: m.getLatLng()
            }
         }));

         return { abort: function() {}}
      },
      filterData: (text, records)  => {
         const ret = {},
         pathData = adjofer.Centro.prototype.options.mutable,
         coincidentes = getItems(adjofer, text);

         for(const idx in coincidentes) {
            const data = coincidentes[idx].getData(),
                  title = label(data),
                  centro = records[title];

            if(!centro) continue;

            ret[title] = centro;
            // Encchufamos la marca del centro para tenerla
            // disponible en el evento search:locationfound.
            centro.layer = coincidentes[idx];
         }

         return ret;
      }
   });

   control.on("search:locationfound", e => {
      adjofer.seleccionado = e.layer;
      control.collapse();
   });

   return control;
}
// Fin issue #51

export default {
   bar: searchBar,
   getItems: getItems
}
