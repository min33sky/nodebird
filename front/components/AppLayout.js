import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Row, Col } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const dummy = {
  nickname: '리오넬메시',
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: false,
};

const AppLayout = ({ children }) => {
  return (
    <div>
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
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </Menu.Item>
      </Menu>
      {/* gutter: col간 간격 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {dummy.isLoggedIn ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="http://github.com/min33sky">
            <a target="_blank">min33sky_GitHub</a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
