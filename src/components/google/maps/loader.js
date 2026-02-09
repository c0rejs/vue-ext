var MAPS_LOADED;
var PROMISES = [];
const CALLBACK = "_softvisioGoogleMapsInit";

export default async function loadMaps ( key, { language, libraries } = {} ) {

    // maps loaded
    if ( MAPS_LOADED === 2 ) {
        return;
    }

    // load maps
    else if ( !MAPS_LOADED ) {
        MAPS_LOADED = 1;

        window[ CALLBACK ] = () => {
            MAPS_LOADED = 2;

            delete window[ CALLBACK ];

            for ( const resolve of PROMISES ) {
                try {
                    resolve();
                }
                catch {}
            }

            PROMISES = null;
        };

        var url = `https://maps.googleapis.com/maps/api/js?callback=${ CALLBACK }&key=${ key }&v=weekly`;

        if ( language ) url += "&language=" + language;

        if ( libraries ) url += "&libraries=" + libraries.join( "," );

        const googleMapScript = document.createElement( "SCRIPT" );
        googleMapScript.setAttribute( "src", url );
        googleMapScript.setAttribute( "async", "" );
        googleMapScript.setAttribute( "defer", "" );
        document.body.append( googleMapScript );
    }

    const promise = new Promise( resolve => PROMISES.push( resolve ) );

    await promise;
}
