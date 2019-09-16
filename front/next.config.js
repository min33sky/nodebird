const WithBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

/**
 * NEXT 환경 설정
 * - WithBundleAnlyzer : 현재 모듈들의 자원 사용량을 분석해 주는 모듈
 * - CompressionPlugin : gz 압축으로 용량을 줄여주는 모듈
 */
module.exports = WithBundleAnalyzer({
  // https://github.com/zeit/next-plugins/tree/master/packages/next-bundle-analyzer 의 기본 설정
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  // config : Next의 기본적 설정
  webpack(config) {
    console.log('config : ', config);
    console.log('rules : ', config.module.rules[0]);

    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      ...config.plugins,
      // * moment Tree Shaking
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    ];

    // 배포 모드일 때만 gz로 압축해준다.
    if (prod) {
      plugins.push(new CompressionPlugin());
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
      plugins,
    };
  },
});
