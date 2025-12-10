import "#ext";
import "#ewc";
import VueViewport from "@c0rejs/vue/app/viewport";

// must be impoerted after ExtJS
await import( "@fortawesome/fontawesome-free/css/all.min.css" );
await import( "./viewport/ext.override.masks.js" );

export default class VueExtViewport extends VueViewport {

    // public
    async init () {

        // set theme listeners
        this.app.theme.on( "darkModeChange", this.#applyTheme.bind( this ) );
        this.app.theme.on( "themeChange", this.#applyTheme.bind( this ) );

        // apply theme
        this.#applyTheme();

        await super.init();

        window[ Symbol.for( "app" ) ] = this.app;

        return new Promise( resolve => {
            Ext.application( {
                "name": "-",
                "quickTips": true,
                "launch": resolve,
            } );
        } );
    }

    mount ( selector ) {

        // mount to the Ext.Viewport
        super.mount( Ext.Viewport.el.dom );
    }

    // protected
    _createVauApp () {
        const vue = super._createVauApp();

        // components requires .toString() method,
        // because ext is trying to convert component to string when component is passed as scope to .on() call
        vue.config.globalProperties.toString = function () {
            return null;
        };

        return vue;
    }

    // private
    #applyTheme () {
        Ext.theme.Material.setColors( {
            ...this.app.theme.theme,
            "darkMode": this.app.theme.darkMode,
        } );
    }
}
