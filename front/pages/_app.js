import React from 'react';
import Head from 'next/head';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';

/**
 * Next에서 제공하는 Layout 파일
 * - Component: Next에서 넣어주는 Props (pages 폴더의 페이지 컴포넌트))
 * - store: withRedux에서 넣어주는 Props
 */
const Nodebird = ({ Component, store }) => (
  <Provider store={store}>
    <Head>
      <title>NodeBird</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.21.2/antd.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Jua|PT+Sans+Narrow&display=swap"
        rel="stylesheet"
      />
    </Head>
    <AppLayout>
      <Component />
    </AppLayout>
  </Provider>
);

Nodebird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware]; // ex) Logger, Redux-saga, etc
  /**
   * Server에는 window 객체가 없기때문에
   * Next에서 제공하는 options.isServer 메서드로
   * 서버인지 아닌지 확인한다
   */
  const enhancer =    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
        applyMiddleware(...middlewares),
        !options.isServer
            && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
          ? window.__REDUX_DEVTOOLS_EXTENSION__()
          : (f) => f,
      );
  const store = createStore(reducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);
  return store; // withRedux 함수가 리턴하는 함수의 파라미터로 받는 컴포넌트의 props로 전달된다.
};

/**
 * 레이아웃을 사용하는 컴포넌트들에게
 * Store의 State에 접근을 가능하게 해준다.
 */
export default withRedux(configureStore)(Nodebird);
