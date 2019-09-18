import React, { useState, useCallback, useEffect } from 'react';
import { Form, Checkbox, Button, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import { signUpAction } from '../reducers/user';

/**
 * TODO : 회원가입 할 때 실시간으로 아이디와 닉네임 중복 확인
 */

const SignupError = styled.div`
  color: red;
`;

const SignupForm = styled(Form)`
  padding: 3rem;
  border: 1px solid black;
`;

const SignupButton = styled(Button)`
  margin-top: 1.2rem;
`;

const SignupInput = styled(Input)``;

/**
 * Custom Hook
 * @param {*} initValue defaultValue
 */
export const useInput = (initValue = null) => {
  // useState는 함수, 조건문 반목문에서 사용하지 말아야 하지만
  // Custom Hook에서는 허용된다.
  const [value, setter] = useState(initValue);
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

/**
 * GET /signup
 * 회원 가입 페이지
 */
const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');

  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me) {
      alert('메인 페이지로 이동합니다.');
      Router.push('/');
    }
  }, [me && me.id]);

  // ***** Event Handler ***** //
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      // 회원가입 조건 체크
      if (password !== passwordCheck) {
        setPasswordError(true);
        return;
      }
      if (!term) {
        setTermError(true);
        return;
      }
      // 회원 가입 액션 디스패치
      dispatch(
        signUpAction({
          userId: id,
          nickname: nick,
          password,
        }),
      );
    },
    [id, password, passwordCheck, term],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password],
  );

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  // 로그인 했다면 회원가입 화면 보여주지 않는다.
  if (me) {
    return null;
  }

  return (
    <>
      <SignupForm onSubmit={onSubmit}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <SignupInput id="user-id" value={id} onChange={onChangeId} required />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <SignupInput
            id="user-nick"
            value={nick}
            onChange={onChangeNick}
            required
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <SignupInput
            id="user-password"
            type="password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호확인</label>
          <br />
          <SignupInput
            id="user-password-check"
            type="password"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          {passwordError && <SignupError>패스워드 불일치</SignupError>}
        </div>
        <div>
          <Checkbox id="user-term" value={term} onChange={onChangeTerm}>
            동의하시겠습니까?
          </Checkbox>
          {termError && <SignupError>약관 에러</SignupError>}
        </div>
        <div>
          <SignupButton type="primary" htmlType="submit" loading={isSigningUp}>
            가입하기
          </SignupButton>
        </div>
      </SignupForm>
    </>
  );
};

export default Signup;
