const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require('path');


module.exports = {
	...defaultConfig,
	entry: {
		'blocks': './src/blocks.js', 
		//'editor': './src/editor.scss', 
		//'frontend': './src/frontend.scss'
	},
	output: {
		path: path.join(__dirname, '/build/'),
		filename: '[name].js'
	}
}