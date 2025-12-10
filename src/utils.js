export * from "@c0rejs/vue/utils";

const ICON_SIZE = "2em";

export async function alert ( message, { title, width = 350, height = 200, iconCls } = {} ) {
    title ??= l10n( "Warning" );
    iconCls ??= "fa-solid fa-triangle-exclamation";

    return new Promise( resolve => {
        const dialog = new Ext.Dialog( {
            title,
            "layout": "hbox",
            "maxWidth": "90%",
            width,
            height,
            "defaultFocus": "#ok",
            "items": [
                {
                    "xtype": "container",
                    "padding": "0 30 0 `0",
                    "html": `<i class="${ iconCls }" style="font-size:${ ICON_SIZE }"></i>`,
                    "hidden": !iconCls,
                },
                {
                    "xtype": "container",
                    "flex": 1,
                    "html": message,
                },
                {
                    "xtype": "toolbar",
                    "layout": { "pack": "end" },
                    "docked": "bottom",
                    "items": [
                        {
                            "id": "ok",
                            "text": "Ok",
                            "ui": "action",
                            "handler": () => dialog.close(),
                        },
                    ],
                },
            ],
        } );

        dialog.on( "destroy", resolve );

        dialog.show();
    } );
}

export async function confirm ( message, { title, width = 350, height = 200, iconCls, okText } = {} ) {
    title ??= l10n( "Confirmation" );

    iconCls ??= "fa-solid fa-circle-question";

    okText ||= "Ok";

    return new Promise( resolve => {
        var res = false;

        const dialog = new Ext.Dialog( {
            title,
            "layout": "hbox",
            "maxWidth": "90%",
            width,
            height,
            "defaultFocus": "#ok",
            "items": [
                {
                    "xtype": "container",
                    "padding": "0 30 0 `0",
                    "html": `<i class="${ iconCls }" style="font-size:${ ICON_SIZE }"></i>`,
                    "hidden": !iconCls,
                },
                {
                    "xtype": "container",
                    "flex": 1,
                    "html": message,
                },
                {
                    "xtype": "toolbar",
                    "layout": { "pack": "end" },
                    "docked": "bottom",
                    "items": [
                        {
                            "text": l10n( "Cancel" ),
                            "handler": () => dialog.close(),
                        },
                        {
                            "id": "ok",
                            "text": okText,
                            "ui": "action",
                            "handler": () => {
                                res = true;

                                dialog.close();
                            },
                        },
                    ],
                },
            ],
        } );

        dialog.on( "destroy", () => resolve( res ) );

        dialog.show();
    } );
}

export async function prompt ( message, { title, width = 450, height = 300 } = {} ) {
    return new Promise( resolve => {
        var res = "";

        const dialog = new Ext.Dialog( {
            title,
            "layout": "vbox",
            "maxWidth": "90%",
            width,
            height,
            "defaultFocus": "#ok",
            "items": [
                {
                    "xtype": "container",
                    "html": message,
                },
                {
                    "xtype": "textareafield",
                    "id": "input",
                    "flex": 1,
                    "wrap": "off",
                },

                {
                    "xtype": "toolbar",
                    "layout": { "pack": "end" },
                    "docked": "bottom",
                    "items": [
                        {
                            "text": l10n( "Cancel" ),
                            "handler": () => dialog.close(),
                        },
                        {
                            "id": "ok",
                            "text": "Ok",
                            "ui": "action",
                            "handler": () => {
                                res = dialog.down( "#input" ).getValue().trim();

                                dialog.close();
                            },
                        },
                    ],
                },
            ],
        } );

        dialog.on( "destroy", () => resolve( res ) );

        dialog.show();
    } );
}

export function toast ( msg, timeout ) {
    if ( Ext.isObject( msg ) ) msg = msg.statusText ?? msg + "";

    Ext.toast( msg, timeout || 3000 );
}
