import locale from "@corejslib/vue/locale";

export default locale;

await locale.add( language => import( /* webpackChunkName: "locales/[request]" */ `#resources/locales/${ language }.po` ) );
