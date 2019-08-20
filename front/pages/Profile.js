import React from 'react';
import {
 Button, List, Card, Icon 
} from 'antd';
import NicknameEditForm from '../components/NicknameEditForm';

/**
 * GET /profile
 * 프로필 페이지
 */
const Profile = () => (
  <div>
    <NicknameEditForm />
    <List
      style={{ marginBottom: '20px' }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>팔로우 목록</div>}
      loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
      dataSource={['메시', '그리즈만', '네이마르']}
      renderItem={(item) => (
        <List.Item style={{ marginTop: '20px' }}>
          <Card actions={[<Icon key="stop" type="stop" />]}>
            <Card.Meta description={item} />
          </Card>
        </List.Item>
      )}
    />
    <List
      style={{ marginBottom: '20px' }}
      grid={{ gutter: 4, xs: 2, md: 3 }}
      size="small"
      header={<div>팔로워 목록</div>}
      loadMore={<Button style={{ width: '100%' }}>더 보기</Button>}
      dataSource={['메시', '그리즈만', '네이마르']}
      renderItem={(item) => (
        <List.Item style={{ marginTop: '20px' }}>
          <Card actions={[<Icon key="stop" type="stop" />]}>
            <Card.Meta description={item} />
          </Card>
        </List.Item>
      )}
    />
  </div>
);

export default Profile;
