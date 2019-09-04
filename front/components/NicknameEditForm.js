import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { CHANGE_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
  const [nickname, setNickname] = useState('');
  const { me, isEditingNickname } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (me) {
      setNickname(me.nickname);
    }
  }, [me && me.id]);

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  const onSubmitNickname = useCallback(
    (e) => {
      e.preventDefault();
      if (!nickname || !nickname.trim()) {
        return alert('정상적인 닉네임이 아닙니다.');
      }

      if (nickname.trim() === me.nickname.trim()) {
        return alert('동일한 닉네임입니다');
      }

      dispatch({
        type: CHANGE_NICKNAME_REQUEST,
        data: nickname.trim(),
      });
    },
    [nickname],
  );

  return (
    <Form
      style={{
        marginBottom: '20px',
        border: '1px solid #d9d9d9',
        padding: '20px',
      }}
      onSubmit={onSubmitNickname}
    >
      <Input
        addonBefore="닉네임"
        onChange={onChangeNickname}
        value={nickname}
      />
      <Button type="primary" htmlType="submit" loading={isEditingNickname}>
        수정
      </Button>
    </Form>
  );
};

export default NicknameEditForm;
