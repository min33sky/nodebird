import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  LOG_OUT_REQUEST,
  LOG_OUT_FAILURE,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_SUCCESS,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
} from '../reducers/user';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8080/api',
// });

// ******************** Server Request API********************* //
function loginApi(loginData) {
  return axios.post('/user/login', loginData, {
    withCredentials: true, // 서버와 쿠키를 주고 받을 수 있다. (서버에도 설정을 해야함)
  });
}

function signUpApi(signUpData) {
  return axios.post('/user', signUpData);
}

function logoutApi() {
  // 로그아웃은 데이터 필요없이 쿠기만 보내주면 된다.
  return axios.post(
    '/user/logout',
    {},
    {
      withCredentials: true,
    },
  );
}

function loadUserApi(id) {
  // id가 있으면 특정 사용자 정보. 없으면 로그인 한 사용자 정보
  console.log('아이디 :', id);
  return axios.get(id ? `/user/${id}` : '/user', {
    withCredentials: true,
  });
}

// ********************* Worker Saga *************************** //
function* login(action) {
  try {
    const result = yield call(loginApi, action.data);
    // put은 dispatch 동일
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data, // axios의 결과는 data 속성에 있다.
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      error,
    });
  }
}

function* logout() {
  try {
    yield call(logoutApi);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      error,
    });
  }
}

function* signUp(action) {
  try {
    yield call(signUpApi, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: SIGN_UP_FAILURE,
      error,
    });
  }
}

/**
 * 사용자 정보 불러오기
 * - action.data가 존재하면 다른 사용자 정보를 불러온다.
 */
function* loadUser(action) {
  try {
    const result = yield call(loadUserApi, action.data);
    console.log('유저 정보 : ', result);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data, // 로그인한 유저의 정보인지 판별
    });
  } catch (error) {
    yield put({
      type: LOAD_USER_FAILURE,
      error,
    });
  }
}

// ****************** watcher Saga ************************** //
function* watchLogin() {
  /**
   * 반복문을 쓰는 이유 ex)for문, while(true), takeEvery, takeLatest
   * - 한 사람이 로그인한 후 다른 아이디로 로그인할 수도 있으므로
   * - 반복문을 사용안하면 watchLogin() 함수가 종료되므로 로그인 불가
   * - takeLatest는 여러번 요청이 오면 가장 마지막 요청만 실행한다.
   * - 이전 요청이 끝나지 않은게 있다면 이전 요청을 취소한다.
   * !! 사가와 리덕스는 별개이기 때문에 사가에선 동작안해도 리덕스는 동작한다.
   * !! ex) ReduxDevTools에는 Action이 나타난다.
   * take() : 해당 액션이 디스패치되면 알아서 next()하는 이펙트
   */
  yield takeLatest(LOG_IN_REQUEST, login);
}

function* watchLogout() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  /**
   * - all : 여러개의 이펙트를 동시에 실행한다.
   * - fork()는 비동기 call()은 동기로 동작
   * - 순서의 의미가 없을 땐 비동기인 fork() 사용
   */
  yield all([
    fork(watchLogin),
    fork(watchSignUp),
    fork(watchLogout),
    fork(watchLoadUser),
  ]);
}
