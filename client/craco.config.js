const { getLoader, loaderByName } = require('@craco/craco');

const transformLoader = loader => ({
    test: loader.test,
    include: loader.include,
    rules: [
        {
            loader: loader.loader,
            options: {
                presets: [loader.options.presets[0], 'linaria/babel'],
            },
        },
        {
            loader: 'linaria/loader',
            options: {
                cacheDirectory: 'src/.linaria_cache',
                sourceMap: process.env.NODE_ENV !== 'production',
                babelOptions: {
                    presets: loader.options.presets,
                },
            },
        },
    ],
});

module.exports = {
    webpack: {
        configure: webpackConfig => {
            const lm = getLoader(webpackConfig, loaderByName('babel-loader'));
            const loader = lm.match.loader;
            webpackConfig.module.rules[2].oneOf[1] = transformLoader(loader);
            return webpackConfig;
        },
    },
};
