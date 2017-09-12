module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-url': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%']
    },
    'cssnano': { autoprefixer: false }
  }
};