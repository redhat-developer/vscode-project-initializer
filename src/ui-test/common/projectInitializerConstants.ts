/**
 * @author Ondrej Dockal <odockal@redhat.com>
 */
export namespace ProjectInitializer {

    export const PROJECT_INITIALIZER_FULL_NAME = 'Project Initializer by Red Hat';
    export const PROJECT_INITIALIZER_NAME = 'Project Initializer';
    export const CAMEL_FUSE_RUNTIME_IDS = ['camel', 'fuse'];
    export const BUILDER_CATALOG_URL = 'https://forge.api.openshift.io/api/';

    export class PaletteOptionsGeneral {
        static camel = "a Camel/Fuse";
        static go = "a Go";
        static vertx = "an Eclipse Vert.x";
        static thorntail = "a Thorntail";
        static spring = "a Spring Boot";
        static nodejs = "a NodeJS";
    }

    const EXT_STRING_SUFFIX = " project using " + PROJECT_INITIALIZER_NAME;
    const EXT_STRING_PREFIX = "Project: Generate ";

    export const PI_GENERAL = {
        general: EXT_STRING_PREFIX + "a" + EXT_STRING_SUFFIX,
        camel:EXT_STRING_PREFIX + PaletteOptionsGeneral.camel + EXT_STRING_SUFFIX,
        go: EXT_STRING_PREFIX + PaletteOptionsGeneral.go + EXT_STRING_SUFFIX,
        nodejs: EXT_STRING_PREFIX + PaletteOptionsGeneral.nodejs + EXT_STRING_SUFFIX,
        spring: EXT_STRING_PREFIX + PaletteOptionsGeneral.spring + EXT_STRING_SUFFIX,
        thorntail: EXT_STRING_PREFIX + PaletteOptionsGeneral.thorntail + EXT_STRING_SUFFIX,
        vertx: EXT_STRING_PREFIX + PaletteOptionsGeneral.vertx + EXT_STRING_SUFFIX
    };

    export const FIRST_LEVEL_OPTIONS = [
        PI_GENERAL.general, 
        PI_GENERAL.camel,
        PI_GENERAL.go,
        PI_GENERAL.nodejs,
        PI_GENERAL.spring,
        PI_GENERAL.thorntail,
        PI_GENERAL.vertx
    ];
}