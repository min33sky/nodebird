import { all, fork, put, takeLatest, call, throttle } from 'redux-saga/effects';
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
  RETWEET_REQUEST,
  RETWEET_FAILURE,
  RETWEET_SUCCESS,
  REMOVE_POST_REQUEST,
  REMOVE_POST_FAILURE,
  REMOVE_POST_SUCCESS,
  LOAD_POST_REQUEST,
  LOAD_POST_FAILURE,
  LOAD_POST_SUCCESS,
} from '../reducers/post';
import {
  FOLLOW_USER_REQUEST,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_FAILURE,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_SUCCESS,
  ADD_POST_TO_ME,
  REMOVE_POST_OF_ME,
} from '../reducers/user';

function addPostApi(formData) {
  // 로그인 전용이므로 쿠키도 같이 보내준다.
  return axios.post('/post', formData, {
    withCredentials: true,
  });
}

function loadMainPostsApi(lastId = 0, limit = 10) {
  return axios.get(`/posts?lastId=${lastId}&limit=${limit}`, {
    // 로그인 안해도 볼 수 있으므로 쿠키를 안보내도 된다.
    // withCredentials: true,
  });
}

function loadHashtagPostsApi(tag, lastId = 0, limit = 10) {
  return axios.get(
    `/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=${limit}`,
  );
}

function loadUserPostsAPI(id) {
  return axios.get(`/user/${id || 0}/posts`);
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

function addRetweetApi(postId) {
  return axios.post(`/post/${postId}/retweet`, {}, { withCredentials: true });
}

function followApi(userId) {
  return axios.post(`/user/${userId}/follow`, {}, { withCredentials: true });
}

function unfollowApi(userId) {
  return axios.delete(`/user/${userId}/follow`, { withCredentials: true });
}

function removePostApi(postId) {
  return axios.delete(`/post/${postId}`, {
    withCredentials: true,
  });
}

function loadPostApi(postId) {
  return axios.get(`/post/${postId}`);
}

// ************************************ Worker ****************************************/

function* addPost(action) {
  try {
    const result = yield call(addPostApi, action.data);
    // post 리듀서에 데이터 수정
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    // user 리듀서에 데이터 수정 (UserProfile의 게시물 숫자 업데이트)
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
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

function* loadMainPosts(action) {
  try {
    const result = yield call(loadMainPostsApi, action.lastId);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
      lastId: action.lastId,
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
    const result = yield call(loadHashtagPostsApi, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
      lastId: action.lastId,
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

function* addRetweet(action) {
  try {
    const result = yield call(addRetweetApi, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: RETWEET_FAILURE,
      error,
    });
    alert(error.response && error.response.data);
  }
}

function* follow(action) {
  try {
    const result = yield call(followApi, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error,
    });
  }
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowApi, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error,
    });
  }
}

function* removePost(action) {
  try {
    const result = yield call(removePostApi, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    // User 리듀서 데이터도 수정해준다. (나의 게시물 숫자 업데이트)
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_POST_FAILURE,
      error,
    });
  }
}

function* loadPost(action) {
  try {
    console.log('################################## : ', action.data);
    const result = yield call(loadPostApi, action.data); // id
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_POST_FAILURE,
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
  // * takeLatest는 마지막 요청을 응답하긴 하지만 짧은 시간 다수의 요청을 막을 순 없다.
  // * throttle은 일정 시간후에 요청이 가능하게 한다.
  // ! throttle은 사가 액션만 막는다. 리덕스 자체 액션은 별도로 클라이언트에서 막아야한다.
  yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

function* watchLoadHashtagPosts() {
  yield throttle(2000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
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

function* watchAddRetweet() {
  yield takeLatest(RETWEET_REQUEST, addRetweet);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_USER_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_USER_REQUEST, unfollow);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
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
    fork(watchAddRetweet),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchRemovePost),
    fork(watchLoadPost),
  ]);
}
