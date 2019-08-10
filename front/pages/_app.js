import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import PropTypes from 'prop-types';

/**
 * Next에서 지정한 Layout을 위한 파일
 * - Component: Next에서 넣어주는 Props (자식 컴포넌트들)
 */
const Nodebird = ({ Component }) => {
  return (
    <>
      <Head>
        <title>NordBird</title>
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
    </>
  );
};

Nodebird.propTypes = {
  Component: PropTypes.elementType,
};

export default Nodebird;
