import ElementParser from "#ewc/common/ElementParser";
import ExtContainer from "#ewc/Ext/Container";

export default class EwcAmchrarts5 extends ExtContainer {
    constructor () {
        const properties = [],
            events = [];

        super( properties.concat( EwcAmchrarts5.PROPERTIES() ), events.concat( EwcAmchrarts5.EVENTS() ) );

        this.xtype = "amcharts5";
    }

    // static
    static PROPERTIES () {
        return [

            //
            ...super.PROPERTIES(),
            "createChart",
            "setChartData",
            "backupChartData",
            "restoreChartData",
            "store",
            "animated",
            "responsive",
            "micro",
        ];
    }

    static getProperties ( properties ) {
        properties = properties.concat( EwcAmchrarts5.PROPERTIES() );

        return ExtContainer.getProperties( properties );
    }

    static get observedAttributes () {
        var attrs = super.observedAttributes;

        EwcAmchrarts5.PROPERTIES().forEach( ( property, index, array ) => {
            attrs.push( property );
        } );

        EwcAmchrarts5.EVENTS().forEach( ( eventparameter, index, array ) => {
            attrs.push( "on" + eventparameter.name );
        } );

        return attrs;
    }
}

try {
    if ( globalThis.customElements.get( "ext-amcharts5" ) === undefined ) {
        globalThis.customElements.define( "ext-amcharts5", ElementParser.withParsedCallback( EwcAmchrarts5 ) );
    }
}
catch {
    if ( globalThis.customElements.get( "ext-amcharts5" ) === undefined ) {
        globalThis.customElements.define( "ext-amcharts5", EwcAmchrarts5 );
    }
}
