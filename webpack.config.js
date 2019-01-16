// webpack.config.js

module.exports = {
    entry: [
        './src/index.js',
        './src/index.scss'
    ],
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                    loader: "script-loader"
                    }
                },
                {
                    test: /\.(s*)css$/,
                    use: ['style-loader','css-loader', 'sass-loader']
                }
        ]
    }
  };