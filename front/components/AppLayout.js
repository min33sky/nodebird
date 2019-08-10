import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Menu, Input, Button, Row, Col, Card, Avatar } from 'antd';

const dummy = {
  nickname: '리오넬메시',
  Post: [],
  Followings: [],
  Followers: [],
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
      <Row>
        <Col xs={24} md={6}>
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {dummy.Post.length}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {dummy.Followings.length}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {dummy.Followers.length}
              </div>,
            ]}
          >
            <Card.Meta
              avatar={<Avatar>{dummy.nickname[0]}</Avatar>}
              title={dummy.nickname}
              description="This is the description"
            />
          </Card>
          <Link href="/signup">
            <a>
              <Button style={{ fontFamily: 'Jua' }}>회원 가입</Button>
            </a>
          </Link>
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          준비중
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
