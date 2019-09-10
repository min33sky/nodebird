import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';

const MyError = ({ statusCode }) => {
  return (
    <div>
      <h1>에러 발생 {statusCode}</h1>
      <Error statusCode={statusCode} />
    </div>
  );
};

MyError.propTypes = {
  statusCode: PropTypes.number,
};

MyError.defaultProps = {
  statusCode: 200,
};

MyError.getInitialProps = async (context) => {
  const statusCode = context.res
    ? context.res.statusCode
    : context.err
    ? context.err.statusCode
    : null;

  return {
    statusCode,
  };
};

export default MyError;
