<template>
    <ext-panel fullscreen="true" layout='{"deferRender":false,"type":"card"}' scrollable="true" @ready="_ready"/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@c0rejs/vue/viewport";
import AuthorizationDialog from "#src/components/authorization.dialog";
import ResetPasswordDialog from "#src/components/reset-password.dialog";

export default {
    "extends": Viewport,

    created () {
        this.privateView = null;
        this.publicView = null;
    },

    "methods": {
        async _ready ( e ) {
            const cmp = e?.detail?.cmp;

            if ( !cmp ) return;

            this.ext = cmp;

            this.$app.mask();

            await this.$app.initSession();

            this.route();
        },

        mask () {
            Ext.Viewport.mask();
        },

        unmask () {
            Ext.Viewport.unmask();
        },

        // router
        async route () {
            this.$app.mask();

            if ( this.$router.path === "/telegram-webapp" ) {
                await this.routeTelegramWebApp();
            }
            else if ( this.$router.path === "/reset-password" ) {
                await this.routeResetPasword();
            }
            else if ( this.$router.path === "/confirm-email" ) {
                await this.routeConfirmEmail();
            }
            else if ( this.$router.path === "/change-email" ) {
                await this.routeChangeEmail();
            }
            else {
                await this._route();
            }

            this.$app.unmask();
        },

        async _route () {
            if ( this.$app.user ) {
                return this.routePrivate();
            }
            else {
                return this.routePublic();
            }
        },

        async routeResetPasword () {
            const cmp = await this.$mount( ResetPasswordDialog );

            cmp.ext.show();
        },

        async routeConfirmEmail () {

            // parse toke
            var token = this.$router.searchParams.get( "token" );

            if ( !token ) {
                this.$toast( l10n( "Email confirmation token is invalid" ) );
            }
            else {
                const res = await this.$api.call( "session/confirm-email-by-token", token );

                if ( res.ok ) {
                    this.$toast( l10n( "Email confirmed successfully" ) );
                }
                else {
                    this.$toast( res );
                }
            }

            this.$router.reload( "/", { "replace": true } );
        },

        async routeChangeEmail () {

            // parse toke
            var token = this.$router.searchParams.get( "token" );

            if ( token ) {
                const cmp = await this.$mount( AuthorizationDialog, {
                    "props": {
                        "emailHint": false,
                        "authorize": async options => {
                            const res = await this.$api.call( "account/set-email-by-token", token, options );

                            if ( res.ok ) {
                                this.$router.reload( "/", { "replace": true } );

                                this.$toast( l10n( "Email address changed" ) );
                            }

                            return res;
                        },
                    },
                } );

                this.$app.unmask();

                await cmp.show();
            }

            this.$router.reload( "/", { "replace": true } );
        },

        async routePublic () {
            if ( !this.publicView ) return;

            if ( this.currentView !== "public" ) {
                this.currentView = "public";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.publicView );
            }
        },

        async routePrivate () {
            if ( !this.privateView ) return;

            if ( this.currentView !== "private" ) {
                this.currentView = "private";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.privateView );
            }
        },

        async routeTelegramWebApp () {
            if ( !this.$app.telegram ) {
                this.$utils.alert( l10n( "Telegram web application initialized incorrectly" ) );

                return;
            }

            // load telegram components
            await import( "@/telegram-components" );

            const components = ( await import( "#src/components/telegram/components" ) ).default;

            const botComponent = components.get( this.$app.telegram.bot.type );

            if ( !botComponent ) return this.$app.telegram.close();

            await botComponent.runWebApp( this );
        },
    },
};
</script>
