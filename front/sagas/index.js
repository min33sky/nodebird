import { all, call } from 'redux-saga/effects';
import user from './user';
import post from './post';

/**
 * Saga는 next를 알아서 (이펙트에 따라) 해주는 제너레이터
 */
export default function* rootSaga() {
  yield all([call(user), call(post)]);
}
