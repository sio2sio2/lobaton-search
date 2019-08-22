const webpack = require("webpack"),
      merge = require("webpack-merge"),
      path = require("path"),
      pack = require("./package.json"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      name = pack.name.split("/").pop();


// Configuración para Babel
function confBabel(env) {
   return {
      module: {
         rules: [
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: "babel-loader",
                  options: {
                     presets: [["@babel/env", {
                        debug: env.debug,
                        corejs: 3,
                        useBuiltIns: "usage"
                     }]]
                  }
               }
            }
         ]
      }
  }
}


// Configuración adicional para el sabor bundle,
// o sea, el que contiene todas las dependencias.
function confBundle() {
   return {
      entry: {
         [name]: ["leaflet-search/dist/leaflet-search.min.css",
                  "./src/search.js"]
      }
   }
}


// Configuración sin dependencias
function confNoDeps() {
   return {
      externals: {
         "fuse.js": {
            root: "Fuse",
            amd: "fuse.js",
            commonjs: "fuse.js",
            commonjs2: "fuse.js"
         },
         "leaflet-search": {
            root: ["L", "Control", "Search"],
            amd: "leaflet-search",
            commonjs: "leaflet-search",
            commonjs2: "leaflet-search"
         }
      }
   }
} 


// Configuración para desarrollo
// (los mapeos de código fuente en fichero aparte)
function confDev(filename) {
   return {
      devtool: false,
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: `${filename}.js.map`
         })
      ]
   }
}


module.exports = env => {
   let filename;

   env.mode = "production";

   switch(env.output) {
      case "min":
         filename = "[name]";
         break;
      case "src":
         filename = "[name]-src";
         break
      default:
         filename = `[name].${env.output}`;
   }

   const common = {
      mode: env.mode,
      entry: {
         [name]: "./src/search.js"
      },
      output: {
         filename: `${filename}.js`,
         libraryTarget: "umd",
         umdNamedDefine: true,
         libraryExport: "default",
         library: ["Lo", "search"]
      },
      externals: {
         "leaflet": {
            root: "L",
            amd: "leaflet",
            commonjs: "leaflet",
            commonjs2: "leaflet"
         },
         "@lobaton/core": {
            root: "Lo",
            amd: "@lobaton/core",
            commonjs: "@lobaton/core",
            commonjs2: "@lobaton/core"
         }
      },
      module: {
         rules: [
            {
               test: /\.css$/i,
               use: [ MiniCssExtractPlugin.loader,
                      "css-loader"]
            },
            {
               test: /\.(jpe?g|png|gif|svg)$/i,
               use: [ "url-loader?limit=4096&name=images/[name].[ext]" ]
            }
         ]
      },
      plugins: [
         new MiniCssExtractPlugin({
            filename: `${filename}.css`,
            chunkFilename: "[id].css"
         })
      ]
   }

   return merge.smart(
      common,
      confBabel(env),
      env.output === "src"?{optimization: {minimize: false}}:null,
      env.output === "bundle"?confBundle():confNoDeps()
   )
}
