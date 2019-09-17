const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

/**
 * NEXT 환경 설정
 * - WithBundleAnlyzer : 현재 모듈들의 자원 사용량을 분석해 주는 모듈
 * - CompressionPlugin : gz 압축으로 용량을 줄여주는 모듈
 */
module.exports = withBundleAnalyzer({
  distDir: '.next',
  webpack(config) {
    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    ];
    if (prod) {
      plugins.push(new CompressionPlugin()); // main.js.gz
    }
    /**
     * ! 빌드 후 용량을 줄이려면 해당 모듈의 tree shaking을 검색해보자.
     * hidden-source-map: 소스코드 숨기면서 에러 시 소스맵 제공
     * eval: 빠르게 웹팩 적용
     */
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            loader: 'webpack-ant-icon-loader',
            enforce: 'pre',
            include: [require.resolve('@ant-design/icons/lib/dist')],
          },
        ],
      },
      plugins,
    };
  },
});
