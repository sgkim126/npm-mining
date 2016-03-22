module.exports = {
  output: {
    path: './build'
  },
  target: 'node',
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'babel-loader?presets[]=es2015!ts-loader' }
    ]
  }
}
