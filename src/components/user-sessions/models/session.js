export default Ext.define( null, {
    "extend": "Ext.data.Model",

    // "proxy": {
    //     "api": {
    //         "create": "administration/users/create",
    //         "read": "administration/users/get-users-list",
    //         "update": "administration/users/update",
    //         "destroy": "administration/users/delete",
    //     },
    // },

    "fields": [
        "id",

        // fields
        "public",
        { "name": "created", "type": "date" },
        { "name": "last_activity", "type": "date" },
        { "name": "current_session", "type": "bool" },
        "remote_address",
        "geoip_name",
        "user_agent",
        "browser_family",
        "browser_version",
        "os_family",
        "os_version",
        "device_vendor",
        "device_model",

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
            "name": "device_text",
            calculate ( data ) {
                return [ data.device_vendor, data.device_model ].filter( tag => tag ).join( " " ) || "&mdash;";
            },
        },

        {
            "name": "os_text",
            calculate ( data ) {
                var os;

                if ( data.os_family ) {
                    os = data.os_family;

                    if ( data.os_version ) os += " " + data.os_version;
                }

                return os || "&mdash;";
            },
        },

        {
            "name": "browser_text",
            calculate ( data ) {
                return data.browser_family || "&mdash;";
            },
        },

        { "name": "geoip_name_text", "calculate": data => data.geoip_name || "&mdash;" },
    ],
} );
