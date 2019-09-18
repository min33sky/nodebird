import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useInput } from '../pages/signup_old';
import { loginAction } from '../reducers/user';

const LoginError = styled.div`
  color: red;
`;

const LoginForm = () => {
  // ***************** Custom Hook 사용 *************************//
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  const dispatch = useDispatch();
  const { isLoading, loginErrorReason } = useSelector((state) => state.user);

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
        <label htmlFor="login_field">
          아이디
          <br />
          <Input id="login_field" value={id} onChange={onChangeId} required />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="password">
          패스워드
          <br />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </label>
      </div>
      <div>
        <LoginError>{loginErrorReason}</LoginError>
      </div>
      <div>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          style={{ width: '50%' }}
        >
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button style={{ width: '50%' }}>회원 가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
