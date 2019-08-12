import React from 'react';
import { Form, Input, Button } from 'antd';

const dummy = {
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [
    {
      User: {
        id: 1,
        nickname: '메시',
      },
      content: '첫 번째 게시글',
      img: 'https://t1.daumcdn.net/cfile/tistory/99B7034C5B5F0E8703',
    },
  ],
};

const PostForm = () => {
  return (
    <Form encType="multipart/form-data" style={{ marginTop: 20 }}>
      <Input.TextArea
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" multiple hidden />
        <Button>이미지 업로드</Button>
        <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
          짹짹
        </Button>
      </div>
      <div>
        {dummy.imagePaths.map(v => {
          return (
            <div key={v} style={{ display: 'inline-block' }}>
              <img
                src={'http://localhost:3065/' + v}
                style={{ width: '200px' }}
                alt={v}
              />
              <div>
                <Button>제거</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default PostForm;
