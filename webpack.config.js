const path = require('path');
const glob = require('glob');
const nodeExternals = require('webpack-node-externals');
const { WatchIgnorePlugin } = require('webpack');
const { watch } = require('fs');
const esbuild = require('esbuild');
const { EsbuildPlugin } = require('esbuild-loader');


// Helper function to generate entry object for webpack
function generateEntry(globPath) {
    const entries = {};
    glob.sync(globPath).forEach((file) => {
        const name = path.relative(path.resolve(__dirname, 'Web-UI'), file).replace(/\\/g, '/');
        entries[name] = file;
    });
    return entries;
}

module.exports = [
    {
        name: 'client',
        entry: generateEntry('./dist/Web-UI/client/**/*.js'), // Adjust glob pattern to include all file types you need
        mode: 'production',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name]',
        },
        target: 'web', // Important for browser environment
        externals: [nodeExternals()], // Important for Node.js environment
        plugins: [
            new WatchIgnorePlugin({
                paths: [/dist\//], // Ignore the ./dist folder
            }),
        ],
        devtool: false, // Disable source maps for client code
        module: {
            rules: [
                {
                    test: /\.js$/, // Adjust according to your file types
                    exclude: /node_modules/,
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            implementation: esbuild,
                            target: 'es2016'
                        }
                    },
                },
                {
                    test: /\.html$/,
                    use: ['html-loader'],
                },
                // Add other rules for different file types (CSS, images, etc.) as needed
            ],
        },
        optimization: {
            minimizer: [
                new EsbuildPlugin({
                    target: 'es2015'  // Syntax to transpile to (see options below for possible values)
                })
            ]
        },
    },
    {
        name: 'server',
        entry: generateEntry('./dist/Web-UI/server/**/*.js'), // Adjust glob pattern to include all file types you need
        mode: 'production',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name]',
            libraryTarget: 'commonjs2', // Important for Node.js modules
        },
        target: 'node', // Important for Node.js environment
        externals: [nodeExternals()], // Important for Node.js environment
        plugins: [
            new WatchIgnorePlugin({
                paths: [/dist\//], // Ignore the ./dist folder
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/, // Adjust according to your file types
                    exclude: /node_modules/,
                    use: {
                        loader: 'esbuild-loader',
                        options: {
                            implementation: esbuild,
                            target: 'es2016'
                        }
                    },
                },
                // Add other rules for different file types as needed
            ],
        },
        optimization: {
            minimizer: [
                new EsbuildPlugin({
                    target: 'es2015'  // Syntax to transpile to (see options below for possible values)
                })
            ]
        },
    },
];