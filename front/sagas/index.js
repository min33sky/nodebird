import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';

// 한번 불러온 모듈은 캐싱이 된다. 그래서 다른 곳에서도 적용이 된다.
axios.defaults.baseURL = 'http://localhost:8080/api';

/**
 * Saga는 next를 알아서 (이펙트에 따라) 해주는 제너레이터
 */
export default function* rootSaga() {
  yield all([call(user), call(post)]);
}
