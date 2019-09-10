import React from 'react';
import Helmet from 'react-helmet';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import axios from 'axios';
import { Container } from 'next/app';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from '../reducers/user';

/**
 * Next에서 제공하는 Layout 파일
 * - Component: Next에서 넣어주는 Props (pages 폴더의 페이지 컴포넌트))
 * - store: withRedux에서 넣어주는 Props
 */
const Nodebird = ({ Component, store, pageProps }) => (
  <Container>
    <Provider store={store}>
      <Helmet
        title="NodeBird"
        htmlAttributes={{ lang: 'ko' }}
        meta={[
          {
            charset: 'UTF-8',
          },
          {
            name: 'viewport',
            content:
              'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          },
          {
            'http-equiv': 'X-UA-Compatible',
            content: 'IE=edge',
          },
          {
            name: 'description',
            content: 'Min33sky의 NodeBird SNS',
          },
          {
            name: 'og:title',
            content: 'NodeBird',
          },
          {
            name: 'og:description',
            content: 'Min33sky의 NodeBird SNS',
          },
          {
            property: 'og:type',
            content: 'website',
          },
        ]}
        link={[
          {
            rel: 'shortcut icon',
            href: '/favicon.ico',
          },
          {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
          },
          {
            rel: 'stylesheet',
            href:
              'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
          },
          {
            rel: 'stylesheet',
            href:
              'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
          },
        ]}
      />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  </Container>
);

Nodebird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

/**
 * * Lifecycle Function
 * - componentDidMount보다도 먼저 호출된다.
 * - (클라이언트)서버와 클라이언트(브라우저) 모두에서 사용되므로 서버사이드렌더링에 사용
 * ? context: next에서 제공하는 인자
 * ! getInitialProps는 pages에서만 사용 가능
 */
Nodebird.getInitialProps = async (context) => {
  console.log(context);
  const { ctx, Component } = context; // Component: 현재 페이지 컴포넌트
  let pageProps = {};

  const state = ctx.store.getState();

  // 서버사이드 랜더링은 브라우저가 없고 프론트 서버에서 직접 백엔드로
  // 요청하기 때문에 쿠키를 직접 넣어줘야한다.
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
  console.log('cookie :', cookie);

  // 서버이고 쿠키가 존재할 때만 쿠키 넣어준다.
  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  // 새로고침시 로그인 유지
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }

  if (Component.getInitialProps) {
    // APP의 하위 컴포넌트의 getInitialProps를 호출한다.
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps }; // 컴포넌트가 마운트 되기 전에 제공하는 props
};

// ********************************* Redux Setting *********************************** //

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
    // 커스텀 로깅 미들웨어
    (store) => (next) => (action) => {
      console.log(action);
      next(action);
    },
  ]; // ex) Logger, Redux-saga, etc
  /**
   * Server에는 window 객체가 없기때문에
   * Next에서 제공하는 options.isServer 메서드로
   * 서버인지 아닌지 확인한다
   */
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f,
        );
  const store = createStore(reducer, initialState, enhancer);

  // * store.sagaTask : withReduxSaga 설정
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store; // withRedux 함수가 리턴하는 함수의 파라미터로 받는 컴포넌트의 props로 전달된다.
};

/**
 * 레이아웃을 사용하는 컴포넌트들에게
 * Store의 State에 접근을 가능하게 해준다.
 */
export default withRedux(configureStore)(withReduxSaga(Nodebird));
