import produce from 'immer';

export const initialState = {
  imagePaths: [], // 미리보기 이미지 경로
  mainPosts: [], // 불러온 포스트들
  addPostErrorReason: '', // 포스트 업로드 실패 사유
  addCommentErrorReason: '', // 댓글 업로드 실패 사유
  isAddingPost: false, // 포스트 업로드 중
  isAddingComment: false, // 댓글 업로드 중
  addedPost: false, // 포스트 추가 완료
  addedComment: false, // 댓글 추가 완료
  hasMorePost: false, // 포스트 더 보기 (무한 스크롤링)
  singlePost: null, // 개별 포스트 데이터
};

// 메인 포스트 관련
export const LOAD_MAIN_POSTS_REQUEST = 'LOAD_MAIN_POSTS_REQUEST';
export const LOAD_MAIN_POSTS_SUCCESS = 'LOAD_MAIN_POSTS_SUCCESS';
export const LOAD_MAIN_POSTS_FAILURE = 'LOAD_MAIN_POSTS_FAILURE';

// 해쉬태그로 포스트 검색
export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

// 사용자에 따른 포스트 검색
export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

// 이미지 업로드
export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

// 이미지 업로드 취소 (비동기 처리가 필요 없으므로 하나로 처리)
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

// 포스트 업로드
export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

// 포스트 좋아요
export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

// 포스트 싫어요
export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

// 댓글 작성
export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

// 댓글 로드
export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST';
export const LOAD_COMMENTS_SUCCESS = 'LOAD_COMMENTS_SUCCESS';
export const LOAD_COMMENTS_FAILURE = 'LOAD_COMMENTS_FAILURE';

// 리트윗
export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

// 포스트 삭제
export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

// 개별 포스트 로드
export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST: {
        draft.isAddingPost = true;
        draft.addedPost = false;
        draft.addPostErrorReason = '';
        break;
      }

      case ADD_POST_SUCCESS: {
        draft.isAddingPost = false;
        draft.addedPost = true;
        draft.mainPosts.unshift(action.data);
        draft.imagePaths = []; // 이미지 미리보기 초기화
        break;
      }

      case ADD_POST_FAILURE: {
        draft.isAddingPost = false;
        draft.addPostErrorReason = action.error;
        break;
      }

      case UPLOAD_IMAGES_REQUEST:
        break;

      case UPLOAD_IMAGES_SUCCESS: {
        action.data.forEach((e) => {
          draft.imagePaths.push(e);
        });
        break;
      }

      case UPLOAD_IMAGES_FAILURE: {
        break;
      }

      case REMOVE_IMAGE: {
        const index = draft.imagePaths.findIndex((v, i) => i === action.index);
        draft.imagePaths.splice(index, 1);
        break;
      }

      case RETWEET_REQUEST: {
        break;
      }

      case RETWEET_SUCCESS: {
        draft.mainPosts.unshift(action.data);
        break;
      }

      case RETWEET_FAILURE: {
        break;
      }

      case ADD_COMMENT_REQUEST: {
        draft.isAddingComment = true;
        draft.addedComment = false;
        draft.addCommentErrorReason = '';
        break;
      }

      case ADD_COMMENT_SUCCESS: {
        const index = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[index].Comments.push(action.data.comment);
        draft.isAddingComment = false;
        draft.addedComment = true;
        break;
      }

      case ADD_COMMENT_FAILURE: {
        draft.isAddingComment = false;
        draft.addCommentErrorReason = action.error;
        break;
      }

      case LOAD_COMMENTS_REQUEST: {
        break;
      }

      case LOAD_COMMENTS_SUCCESS: {
        const index = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[index].Comments = action.data.comments;
        break;
      }

      case LOAD_COMMENTS_FAILURE: {
        break;
      }

      case LIKE_POST_REQUEST: {
        break;
      }

      case LIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
        break;
      }

      case LIKE_POST_FAILURE: {
        break;
      }

      case UNLIKE_POST_REQUEST: {
        break;
      }

      case UNLIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data.postId,
        );
        const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(
          (v) => v.id === action.data.userId,
        );
        draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
        break;
      }

      case UNLIKE_POST_FAILURE: {
        break;
      }

      case REMOVE_POST_REQUEST: {
        break;
      }

      case REMOVE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          (v) => v.id === action.data,
        );
        draft.mainPosts.splice(postIndex, 1);
        break;
      }

      case REMOVE_POST_FAILURE: {
        break;
      }

      case LOAD_POST_REQUEST: {
        break;
      }

      case LOAD_POST_SUCCESS: {
        draft.singlePost = action.data;
        break;
      }

      case LOAD_POST_FAILURE: {
        break;
      }

      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_USER_POSTS_REQUEST:
      case LOAD_MAIN_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
        draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
        break;
      }

      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_USER_POSTS_SUCCESS:
      case LOAD_MAIN_POSTS_SUCCESS: {
        action.data.forEach((e) => {
          draft.mainPosts.push(e);
        });
        draft.hasMorePost = action.data.length === 10;
        break;
      }

      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_MAIN_POSTS_FAILURE: {
        break;
      }

      default: {
        break;
      }
    }
  });
};

export default reducer;
