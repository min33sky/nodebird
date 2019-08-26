import {
 all, fork, delay, put, takeLatest, call 
} from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_SUCCESS,
  ADD_POST_REQUEST,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_MAIN_POSTS_SUCCESS,
} from '../reducers/post';

function addPostApi(data) {
  // 로그인 전용이므로 쿠키도 같이 보내준다.
  return axios.post('/post', data, {
    withCredentials: true,
  });
}

function loadMainPostsApi() {
  return axios.get('/posts', {
    // 로그인 안해도 볼 수 있으므로 쿠키를 안보내도 된다.
    // withCredentials: true,
  });
}

function addCommentApi() {}

function* addPost(action) {
  try {
    const result = yield call(addPostApi, action.data);
    console.log(result.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: ADD_POST_FAILURE,
      error,
    });
  }
}

function* addComment(action) {
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
      },
    });
  } catch (error) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error,
    });
  }
}

function* loadMainPosts(action) {
  try {
    const result = yield call(loadMainPostsApi);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchLoadPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchLoadPosts), fork(watchAddComment)]);
}
