import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
} from '../reducers/post';

const SERVER_URL = 'http://localhost:8080';

/**
 * 게시물 등록 컴포넌트
 */
const PostForm = () => {
  const { imagePaths, isAddingPost, addedPost } = useSelector(
    (state) => state.post,
  );
  const [text, setText] = useState('');
  const imageInput = useRef(null);
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

      // FormData를 사용하지 않고 Ajax로 보내도 상관없다.
      // FormData를 사용하면 key & value를 직접 넣어줘야된다.
      // ex) formData: { image: [이미지주소1, 이미지주소2, ..], content: 내용 }
      const formData = new FormData();
      imagePaths.forEach((i) => {
        formData.append('image', i);
      });
      formData.append('content', text);

      return dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    },
    [text, imagePaths],
  );

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  /**
   * 이미지 업로드
   */
  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    /**
     * multipart/form-data의 데이터를 보내기 위해서
     * FormData 객체를 이용한다.
     */
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => imageFormData.append('image', f));
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  /**
   * 이미지 삭제
   */
  const onRemoveImage = (index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index,
    });
  };

  return (
    <Form
      encType="multipart/form-data"
      style={{ margin: '10px 0 20px' }}
      onSubmit={onSubmitPost}
    >
      <Input.TextArea
        maxLength={140}
        placeholder="오늘 어떤 일이 있었나요?"
        value={text}
        onChange={onChangeText}
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
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
        {imagePaths.map((v, idx) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img
              src={`${SERVER_URL}/${v}`}
              style={{ width: '200px' }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(idx)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
