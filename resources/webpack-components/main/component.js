import WebpackComponent from "@c0rejs/vue/webpack-components/main";

export default class extends WebpackComponent {

    // properties
    get webpackResolveAlias () {
        return {
            ...super.webpackResolveAlias,
            "#vue": "@c0rejs/vue-ext",

            "#ext$": "@c0rejs/ext/ext-" + this.buildOptions.extVersion,
            "#ext": "@c0rejs/ext/resources/ext-" + this.buildOptions.extVersion,
            "#ewc$": "@c0rejs/ext/ewc-" + this.buildOptions.ewcVersion,
            "#ewc": "@c0rejs/ext/resources/ewc-" + this.buildOptions.ewcVersion,
            "#ext-charts$": "@c0rejs/ext/ext-charts-" + this.buildOptions.extVersion,
        };
    }

    // public
    validateEnv ( env ) {
        return super.validateEnv( env ) || this._validateEnv( env, import.meta.url );
    }

    // protected
    _buildWebpackConfig () {
        const config = super._buildWebpackConfig();

        // config.module.rules[1].exclude.push( /[\\/]resources[\\/]ext-[\d.]+[\\/]/, /[\\/]resources[\\/]ewc-[\d.]+[\\/]/ );

        // config.optimization.splitChunks.cacheGroups["ext-charts"] = {
        //     "name": "ext-charts",
        //     test ( module ) {
        //         if ( !module.resource ) return;

        //         const resource = module.resource.replaceAll( "\\", "/" );

        //         if ( resource.includes( "@c0rejs/ext/src/ext-charts-" ) ) return true;

        //         if ( resource.includes( "@c0rejs/ext/resources/ext-" + this.buildOptions.extVersion + "/charts.js" ) ) return true;
        //     },
        //     "priority": -9,
        //     "chunks": "all",
        // };

        // config.optimization.splitChunks.cacheGroups["ext"] = {
        //     "name": "ext",
        //     "test": /@softvisio[\\/]ext[\\/]/,
        //     "priority": -9,
        //     "chunks": "initial",
        // };

        config.optimization.splitChunks.cacheGroups[ "froala-editor" ] = {
            "name": "froala-editor",
            "test": /froala-editor[/\\]/,
            "priority": -9,
            "chunks": "all",
        };

        config.optimization.splitChunks.cacheGroups[ "amcharts5" ] = {
            "name": "amcharts5",
            "test": /@amcharts[/\\]amcharts5[/\\]/,
            "priority": -9,
            "chunks": "all",
        };

        config.optimization.splitChunks.cacheGroups[ "pdf" ] = {
            "name": "pdf",
            "test": /pdfjs-dist[/\\]/,
            "priority": -9,
            "chunks": "all",
        };

        config.optimization.splitChunks.cacheGroups[ "fontawesome" ] = {
            "name": "fa",
            "test": /@fortawesome[/\\]/,
            "priority": -9,
            "chunks": "all",
        };

        return config;
    }
}
