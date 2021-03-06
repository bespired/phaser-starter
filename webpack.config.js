var path              = require('path');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// Phaser webpack config
var phaserModule      = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser            = path.join(phaserModule, 'build/custom/phaser-split.js');
var pixi              = path.join(phaserModule, 'build/custom/pixi.js');
var p2                = path.join(phaserModule, 'build/custom/p2.js');

var definePlugin = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
	context: path.join(__dirname, ''),
	entry: {
		app: [
			'babel-polyfill',
			path.resolve(__dirname, 'src/main.js')
		],
		vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
	},
	devtool: 'cheap-source-map',
	output: {
		pathinfo: true,
		path: path.resolve(__dirname, 'public'),
		publicPath: '.',
		filename: 'js/bundle.js'
	},
	watch: true,
	plugins: [
		definePlugin,
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor.bundle.js'
		}),
		new CopyWebpackPlugin([
			{ from: 'assets/', to: 'assets/' }
		]),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/phaser.html',
			chunks: ['vendor', 'app'],
			chunksSortMode: 'manual',
			minify: {
				removeAttributeQuotes: false,
				collapseWhitespace: false,
				html5: false,
				minifyCSS: false,
				minifyJS: false,
				minifyURLs: false,
				removeComments: false,
				removeEmptyAttributes: false
			},
			hash: false
		}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8080,
			server: {
				baseDir: ['./public']
			}
		})
	],
	module: {
		rules: [
			{ test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
			{ test: /pixi\.js/, use: ['expose-loader?PIXI'] },
			{ test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
			{ test: /p2\.js/, use: ['expose-loader?p2'] }
		]
	},
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	},
	resolve: {
		alias: {
			'phaser': phaser,
			'pixi': pixi,
			'p2': p2
		}
	}
}
