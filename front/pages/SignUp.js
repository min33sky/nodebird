import React, { useState, useCallback, useEffect } from 'react';
import { Form, Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { signUpAction } from '../reducers/user';

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
    /**
     * 의존 배열의 값은 객체 대신 일반 값을 사용한다.
     * (객체나 배열은 비교하기 까다롭기 때문에)
     * 객체 안의 값을 사용할땐 먼저 객체가 undefined인지 체크하자
     */
    // TODO: 회원 가입 후 로그인 액션을 디스패치해서 로그인 & 페이지 이동
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

  // 로그인 했다면 화면 보여주지 않는다.
  if (me) {
    return null;
  }

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 20 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <input id="user-id" value={id} onChange={onChangeId} required />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <input id="user-nick" value={nick} onChange={onChangeNick} required />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <input
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
          <input
            id="user-password-check"
            type="password"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          {passwordError && <div style={{ color: 'red' }}>패스워드 불일치</div>}
        </div>
        <div>
          <Checkbox id="user-term" value={term} onChange={onChangeTerm}>
            동의하시겠습니까?
          </Checkbox>
          {termError && <div style={{ color: 'red' }}>약관 에러</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
