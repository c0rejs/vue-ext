export default Ext.define( null, {
    "extend": "Ext.data.Model",

    "proxy": {
        "api": {
            "create": "account/tokens/create",
            "read": "account/tokens/get-tokens-list",
            "update": "account/tokens/update",
            "destroy": "account/tokens/delete",
        },
    },

    "fields": [
        "id",

        // fields
        "name",
        "public",
        { "name": "created", "type": "date" },
        { "name": "last_activity", "type": "date" },
        { "name": "enabled", "type": "bool" },

        // calculated
        {
            "name": "last_activity_text",
            calculate ( data ) {
                if ( !data.last_activity ) {
                    return "&mdash;";
                }
                else {
                    return Ext.util.Format.date( data.last_activity, "dateStyle:short,timeStyle:short" );
                }
            },
        },
        {
            "name": "public_text",
            calculate ( data ) {
                if ( !data.public ) {
                    return "&mdash;";
                }
                else {
                    return `${ data.public }...`;
                }
            },
        },
    ],
} );
