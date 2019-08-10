import React, { useState, useCallback } from 'react';
import { Form, Checkbox, Button } from 'antd';

/**
 * 회원 가입 페이지
 */
const SignUp = () => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  // ***** Custom Hook ***** //
  const useInput = (initValue = null) => {
    // useState는 함수, 조건문 반목문에서 사용하지 말아야 하지만
    // Custom Hook에서는 허용된다.
    const [value, setter] = useState(initValue);
    const handler = useCallback(e => {
      setter(e.target.value);
    }, []);
    return [value, handler];
  };

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');

  // ***** Event Handler ***** //
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (password !== passwordCheck) {
        setPasswordError(true);
      }
      if (!term) {
        setTermError(true);
      }
    },
    [password, passwordCheck, term],
  );

  const onChangePasswordCheck = useCallback(
    e => {
      setPasswordError(e.target.value !== password);
      setPasswordCheck(e.target.value);
    },
    [password],
  );

  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

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
          <Button type="primary" htmlType="submit">
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default SignUp;
