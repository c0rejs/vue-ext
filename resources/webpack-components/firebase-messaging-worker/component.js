import WebpackComponent from "@corejslib/vue/webpack-components/firebase-messaging-worker";

export default class extends WebpackComponent {

    // properties
    get webpackResolveAlias () {
        return {
            ...super.webpackResolveAlias,
            "#vue": "@corejslib/vue-ext",
        };
    }

    // public
    validateEnv ( env ) {
        return super.validateEnv( env ) || this._validateEnv( env, import.meta.url );
    }
}
