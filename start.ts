SystemJS.config({
    defaultJSExtensions: true,
    map: {
        'jquery': 'node_modules\\jquery\\dist\\jquery.js'
    }

});
SystemJS.import('main');