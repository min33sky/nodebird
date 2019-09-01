import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
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
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_COMMENTS_REQUEST,
  LOAD_COMMENTS_FAILURE,
  LOAD_COMMENTS_SUCCESS,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  LIKE_POST_FAILURE,
  LIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
} from '../reducers/post';

function addPostApi(formData) {
  // 로그인 전용이므로 쿠키도 같이 보내준다.
  return axios.post('/post', formData, {
    withCredentials: true,
  });
}

function loadMainPostsApi() {
  return axios.get('/posts', {
    // 로그인 안해도 볼 수 있으므로 쿠키를 안보내도 된다.
    // withCredentials: true,
  });
}

function loadHashtagPostsApi(tag) {
  return axios.get(`/hashtag/${tag}`);
}

function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`);
}

function loadCommentsApi(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function addCommentApi(comment) {
  return axios.post(
    `/post/${comment.postId}/comment`,
    {
      content: comment.content,
    },
    {
      withCredentials: true,
    },
  );
}

function uploadImagesApi(formData) {
  // ! 게시물이 등록되기 전에 이미지가 먼저 올라가므로 게시물 번호를 알 수 없다.
  return axios.post(`/post/images`, formData, {
    withCredentials: true,
  });
}

function likePostApi(postId) {
  return axios.post(
    `/post/${postId}/like`,
    {},
    {
      withCredentials: true,
    },
  );
}

function unlikePostApi(postId) {
  return axios.delete(`/post/${postId}/like`, { withCredentials: true });
}

// ************************************ Worker ****************************************/

function* addPost(action) {
  try {
    const result = yield call(addPostApi, action.data);
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
    const result = yield call(addCommentApi, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error,
    });
  }
}

function* loadMainPosts() {
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

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsApi, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error,
    });
  }
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsApi, action.id);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        comments: result.data,
        postId: action.id,
      },
    });
  } catch (error) {
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error,
    });
  }
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesApi, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data, // 업로드된 이미지의 주소들
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error,
    });
  }
}

function* likePost(action) {
  try {
    const result = yield call(likePostApi, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LIKE_POST_FAILURE,
      error,
    });
  }
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostApi, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error,
    });
  }
}

// ********************************** Watcher *********************************** //

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchLoadPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadPosts),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
  ]);
}
