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
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  // Lifecycle Function
  useEffect(() => {
    // 포스트 작성 후 폼 초기화
    setText('');
  }, [addedPost === true]);

  /**
   * 게시물 작성 핸들러
   */
  const onSubmitPost = useCallback(
    (e) => {
      e.preventDefault();
      if (!text || !text.trim()) {
        return alert('내용을 입력하세요');
      }
      return dispatch(
        addPostRequest({
          content: text.trim(),
        }),
      );
    },
    [text],
  );

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
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
        value={text}
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
