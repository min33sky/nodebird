import React, { useCallback } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Menu, Input, Row, Col } from 'antd';
import Router from 'next/router';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const Overlay = styled.div`
  font-family: 'Jua';
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);

  // 검색창
  const onSearch = useCallback((value) => {
    Router.push(
      // 내부적으로 접근하는 주소
      {
        pathname: '/hashtag',
        query: {
          tag: value,
        },
      },
      // 눈으로 보이는 주소
      `hashtag/${value}`,
    );
  }, []);

  return (
    <Overlay>
      <Menu mode="horizontal" style={{ fontFamily: 'PT Sans Narrow' }}>
        <Menu.Item key="home">
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search
            enterButton
            style={{ verticalAlign: 'middle' }}
            onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>
      {/* gutter: col간 간격 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="http://github.com/min33sky">
            <a target="_blank">GitHub</a>
          </Link>
        </Col>
      </Row>
    </Overlay>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
