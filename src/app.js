import VueApp from "@c0rejs/vue/app";
import AuthorizationDialog from "#src/components/authorization.dialog";

export default class VueExtApp extends VueApp {

    // public
    async reload () {
        this.mask();

        return super.reload();
    }

    async signOut () {

        // mask viewport immidiately, this is required, when api is not connected
        this.mask();

        return super.signOut();
    }

    // protected
    async _onConnectionError ( res ) {
        if ( res ) this.utils.toast( res );

        this.unmask();

        await this.utils.alert( l10n( "Unable to connect to the API server. Check, that you have internet connection." ), {
            "title": l10n( "Connection error" ),
        } );

        this.mask();
    }

    async _onSignout ( res ) {
        if ( res ) this.utils.toast( res );

        this.unmask();

        await this.utils.alert( l10n( "Your session was terminated on the API server." ), {
            "title": l10n( "Session closed" ),
        } );

        this.mask();
    }

    async _onAuthorization () {
        const cmp = await this.viewport.vue.$mount( AuthorizationDialog );

        return cmp.show();
    }

    async _onAccessDenied () {
        const res = await this.utils.confirm( l10n( "Your access permissions were changed on API server. Please, reload application to apply updates." ), {
            "title": l10n( "Access denied" ),
            "iconCls": "fa-solid fa-triangle-exclamation",
            "okText": l10n( "Reload" ),
        } );

        if ( res ) {
            this.mask();

            await this.reload();
        }
    }
}
