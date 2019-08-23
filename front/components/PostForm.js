import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { addPostRequest } from '../reducers/post';

/**
 * 게시물 등록 컴포넌트
 */
const PostForm = () => {
  const { imagePaths, isAddingPost, addedPost } = useSelector(
    (state) => state.post,
  );
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  // Lifecycle Function
  useEffect(() => {
    // 포스트 작성 후 폼 초기화
    setValue('');
  }, [addedPost === true]);

  const onSubmitPost = useCallback((e) => {
    e.preventDefault();
    dispatch(addPostRequest);
  }, []);

  const onChangeText = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return (
    <Form
      encType="multipart/form-data"
      style={{ marginTop: 20 }}
      onSubmit={onSubmitPost}
    >
      <Input.TextArea
        maxLength={140}
        placeholder="오늘 어떤 일이 있었나요?"
        value={value}
        onChange={onChangeText}
      />
      <div>
        <input type="file" multiple hidden />
        <Button>이미지 업로드</Button>
        <Button
          type="primary"
          loading={isAddingPost}
          htmlType="submit"
          style={{ float: 'right' }}
        >
          Tweet
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img
              src={`http://localhost:3065/${v}`}
              style={{ width: '200px' }}
              alt={v}
            />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
