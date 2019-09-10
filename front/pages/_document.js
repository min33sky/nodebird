import React from 'react';
import Helmet from 'react-helmet';
import Document, { Main, NextScript } from 'next/document';

/**
 * NEXT에서 제공하는 HTML을 담당하는 파일
 * - Main : _App.js
 * - NextScript : Next 서버 구동에 필요한 스크립트
 */
class MyDocument extends Document {
  // NEXT Lifecycle
  static getInitialProps(context) {
    // * Document가 App의 상위이고 App을 여기서 실행해 줘야된다.
    // App : _app.js
    // page: 필요한 데이터가 있으면 this.props.page에서 꺼내 쓰자.
    const page = context.renderPage((App) => (props) => <App {...props} />);
    // React-Helmet SSR
    return { ...page, helmet: Helmet.renderStatic() };
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    // 객체를 컴포넌트로 변환해서 props로 전달한다.
    const htmlAttrs = htmlAttributes.toComponent();
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>{Object.values(helmet).map((el) => el.toComponent())}</head>
        <body {...bodyAttrs}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
