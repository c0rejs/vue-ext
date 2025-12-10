import VueNotifications from "@c0rejs/vue/app/notifications";

export default class VueExtNotifications extends VueNotifications {
    #inboxStore;
    #doneStore;

    // public
    getInboxStore ( NotificationModel ) {
        if ( !this.#inboxStore ) {
            this.#inboxStore = Ext.create( "Ext.data.Store", {
                "model": NotificationModel,
                "autoLoad": this.internalNotificationsEnabled,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": false,
                    },
                ],
            } );

            this.#inboxStore.on( "load", this.#onLoad.bind( this, "inbox" ) );
        }

        return this.#inboxStore;
    }

    getDoneStore ( NotificationModel ) {
        if ( !this.#doneStore ) {
            this.#doneStore = Ext.create( "Ext.data.Store", {
                "model": NotificationModel,
                "autoLoad": this.internalNotificationsEnabled,
                "pageSize": 25,
                "filters": [
                    {
                        "property": "done",
                        "operator": "=",
                        "value": true,
                    },
                ],
            } );

            this.#doneStore.on( "load", this.#onLoad.bind( this, "done" ) );
        }

        return this.#doneStore;
    }

    refresh ( { inbox, done } = {} ) {
        if ( this.#inboxStore && ( inbox == null || inbox ) ) this.#inboxStore.loadPage( 1 );

        if ( this.#doneStore && ( done == null || done ) ) this.#doneStore.loadPage( 1 );
    }

    refreshRelativeTime () {
        this.#inboxStore?.each( record => record.set( "relative_time", this._getRelativeDate( record.get( "created" ) ) ) );

        this.#doneStore?.each( record => record.set( "relative_time", this._getRelativeDate( record.get( "created" ) ) ) );
    }

    // private
    #onLoad ( type ) {
        if ( type === "inbox" ) {
            this._reactive.totalInbox = this.#inboxStore.getSummaryRecord().get( "total" );

            this.#inboxStore.each( record => record.set( "relative_time", this._getRelativeDate( record.get( "created" ) ) ) );
        }
        else if ( type === "done" ) {
            this._reactive.totalDone = this.#doneStore.getSummaryRecord().get( "total" );

            this.#doneStore.each( record => record.set( "relative_time", this._getRelativeDate( record.get( "created" ) ) ) );
        }
    }
}
