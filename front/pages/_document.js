import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Document, { Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/**
 * NEXT에서 제공하는 HTML을 담당하는 파일
 * - Main : _app.js
 * - NextScript : Next 서버 구동에 필요한 스크립트
 * ! 아직 Hooks를 지원하지 않는다.
 */
class MyDocument extends Document {
  static getInitialProps(context) {
    /**
     * Header와 Style 관련 SSR 설정
     * * _document는 _app의 상위 컴포넌트이고 여기서 _app을 랜더링 해야한다.
     * - App은 _app.js를 의미한다.
     * - page는 여기선 특별히 사용하지 않지만 필수 설정이다
     * ! 스타일 컴포넌트는 해당 컴포넌트가 렌더링 될 때 사용되므로 사용전엔 헤더파일에 안보인다
     */
    const sheet = new ServerStyleSheet();
    const page = context.renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, helmet: Helmet.renderStatic(), styleTags };
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    // 객체를 컴포넌트로 변환해서 props로 전달한다.
    const htmlAttrs = htmlAttributes.toComponent();
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          {this.props.styleTags}
          {Object.values(helmet).map((el) => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <Main />
          {process.env.NODE_ENV === 'production' && (
            <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
          )}
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.propTypes = {
  helmet: PropTypes.object.isRequired,
  styleTags: PropTypes.object.isRequired,
};

export default MyDocument;
