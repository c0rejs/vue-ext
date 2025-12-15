<template>
    <CardsPanel ref="cards" :store="store" @refresh="refresh">
        <template #docked>
            <ext-toolbar docked="top">
                <ext-container :hidden="hideTitle" :html="l10n(`API access tokens`)"/>
                <ext-searchfield :placeholder="l10n(`Search tokens by name`)" width="200" @change="search"/>
                <ext-spacer/>
                <ext-button iconCls="fa-solid fa-plus" :text="l10n(`Create token`)" @tap="showCreateTokenDialog"/>
                <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`)" @tap="refresh"/>
            </ext-toolbar>
        </template>

        <template #dataPanel>
            <ext-grid multicolumnSort="true" @ready="gridReady">
                <ext-column cell='{"encodeHtml":false}' dataIndex="public_text" sorter='{"property":"public"}' :text="l10n(`Token`)" width="150"/>

                <ext-column dataIndex="name" flex="1" :text="l10n(`Token name`)"/>

                <ext-column cell='{"encodeHtml":false}' dataIndex="last_activity_text" sorter='{"property":"last_activity"}' :text="l10n(`Last activity`)" width="150"/>

                <ext-column dataIndex="created" formatter='date("dateStyle:short,timeStyle:short")' :text="l10n(`Creation date`)" width="150"/>

                <ext-column sorter='{"property":"enabled"}' summaryDataIndex="-" :text="l10n(`Access enabled`)" width="160" @ready="enabledColReady"/>

                <ext-column width="80" @ready="actionColReady"/>
            </ext-grid>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import CreateDialog from "./create/dialog";
import TokenModel from "./models/token";

export default {
    "components": { CardsPanel },

    "props": {
        "hideTitle": {
            "type": Boolean,
            "default": false,
        },
    },

    created () {
        this.store = Ext.create( "Ext.data.Store", {
            "model": TokenModel,
            "autoLoad": false,
            "pageSize": 100,
        } );
    },

    "methods": {
        gridReady ( e ) {
            var grid = e.detail.cmp;

            grid.setPlugins( [ "autopaging", "gridviewoptions" ] );

            // grid.setColumnMenu( null );

            grid.setItemConfig( { "viewModel": true } );

            grid.setStore( this.store );
        },

        enabledColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "center" },
                    "items": [
                        {
                            "xtype": "togglefield",
                            "bind": { "value": "{record.enabled}" },
                            "listeners": { "change": this.setEnabled.bind( this ) },
                        },
                    ],
                },
            } );
        },

        actionColReady ( e ) {
            var cmp = e.detail.cmp;

            cmp.setCell( {
                "xtype": "widgetcell",
                "widget": {
                    "xtype": "container",
                    "layout": { "type": "hbox", "pack": "end", "align": "center" },
                    "items": [

                        // {
                        //     "xtype": "button",
                        //     "iconCls": "fa-solid fa-unlock-alt",
                        //     "tooltip": l10n( "Edit token roles" ),
                        //     "handler": this.showTokenRolesDialog.bind( this ),
                        // },
                        {
                            "xtype": "button",
                            "iconCls": "fa-regular fa-trash-can",
                            "ui": "decline",
                            "handler": this.delete.bind( this ),
                        },
                    ],
                },
            } );
        },

        search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "name",
                    "operator": "like",
                    "value": val,
                } );
            }
            else {
                this.store.removeFilter( "name" );
            }
        },

        refresh () {
            this.$refs.cards.mask();

            this.store.loadPage( 1 );
        },

        async setEnabled ( button, enabled ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord(),
                curVal = record.get( "enabled" );

            if ( enabled === curVal ) return;

            button.disable();

            const res = await this.$api.call( "account/tokens/set-enabled", record.id, enabled );

            if ( !res.ok ) {
                record.set( "enabled", !enabled );
                button.setValue( !enabled );

                this.$toast( res );
            }
            else {
                record.commit();

                this.$toast( enabled
                    ? l10n( "Access enabled" )
                    : l10n( "Access disabled" ) );
            }

            button.enable();
        },

        async delete ( button ) {
            const gridrow = button.up( "gridrow" ),
                record = gridrow.getRecord();

            if ( !( await this.$utils.confirm( l10n( "Are you sure you want to delete this token?" ) ) ) ) return;

            var res = await this.$api.call( "account/tokens/delete", record.getId() );

            if ( res.ok ) {
                this.$toast( l10n( "Token deleted" ) );

                this.store.remove( record );
            }
            else {
                this.$toast( res );
            }
        },

        async showCreateTokenDialog () {
            const cmp = await this.$mount( CreateDialog, {
                "props": {
                    "onCreated": () => this.refresh(),
                },
            } );

            cmp.ext.show();
        },

        // async showTokenRolesDialog ( button ) {
        //     const gridrow = button.up( "gridrow" ),
        //         record = gridrow.getRecord();

        //     const cmp = await this.$mount( RolesDialog );

        //     cmp.setRecord( record );

        //     cmp.ext.show();
        // },
    },
};
</script>
