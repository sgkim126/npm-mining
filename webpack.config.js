module.exports = {
  entry: './src/main.ts',
  target: 'node',
  output: {
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'babel-loader?presets[]=es2015!ts-loader' }
    ]
  }
}
