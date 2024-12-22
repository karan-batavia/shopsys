const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('web/build/')
    .setPublicPath((process.env.CDN_DOMAIN ? process.env.CDN_DOMAIN : '') + '/build')
    .setManifestKeyPrefix('web')
    .cleanupOutputBeforeBuild()
    .addEntry('admin', './assets/js/admin/admin.js')
    .addEntry('admin-styles', './assets/styles/admin/main.sass')
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .enableSassLoader()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableBuildNotifications()
    .configureWatchOptions(function (watchOptions) {
        watchOptions.ignored = '**/*.json';
    })
;

const config = Encore.getWebpackConfig();

config.resolve.alias = {
    'framework': '@shopsys/framework/js'
};

module.exports = config;
