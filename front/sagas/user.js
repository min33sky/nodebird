import {
 all, fork, put, takeLatest, delay 
} from 'redux-saga/effects';
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
} from '../reducers/user';

// ******************** Server Request API********************* //
function loginApi() {
  // 서버에 요청을 보내는 부분
  return axios.post('/login');
}

function signUpApi() {}

// ********************* Worker Saga *************************** //
function* login() {
  try {
    // yield call(loginApi);
    yield delay(2000); // 로그인 테스트용
    yield put({
      // put은 dispatch 동일
      type: LOG_IN_SUCCESS,
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
    yield delay(1000);
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

function* signUp() {
  try {
    yield delay(2000);
    // 일부러 에러 내기
    throw new Error('E.R.R.O.R');
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: SIGN_UP_FAILURE,
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

export default function* userSaga() {
  /**
   * - all : 여러개의 이펙트를 동시에 실행한다.
   * - fork()는 비동기 call()은 동기로 동작
   * - 순서의 의미가 없을 땐 비동기인 fork() 사용
   */
  yield all([fork(watchLogin), fork(watchSignUp), fork(watchLogout)]);
}
