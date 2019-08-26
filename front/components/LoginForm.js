import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'antd';
import Link from 'next/link';
import { useInput } from '../pages/signup';
import { loginAction } from '../reducers/user';

const LoginForm = () => {
  // ***************** Custom Hook 사용 *************************//
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(loginAction({ userId: id, password }));
    },
    [id, password],
  );

  return (
    <Form onSubmit={onSubmitForm} style={{ padding: 10 }}>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="login_field">아이디</label>
        <br />
        <input id="login_field" value={id} onChange={onChangeId} required />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="password">패스워드</label>
        <br />
        <input
          id="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원 가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
