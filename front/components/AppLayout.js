import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
 Menu, Input, Row, Col 
} from 'antd';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <div style={{ fontFamily: 'Jua' }}>
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
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
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
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
