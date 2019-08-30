export const initialState = {
  imagePaths: [], // 미리보기 이미지 경로
  mainPosts: [],
  addPostErrorReason: '', // 포스트 업로드 실패 사유
  addCommentErrorReason: '', // 댓글 업로드 실패 사유
  isAddingPost: false, // 포스트 업로드 중
  isAddingComment: false, // 댓글 업로드 중
  addedPost: false, // 포스트 추가 완료
  addedComment: false, // 댓글 추가 완료
};

const dummyComments = {
  id: 1,
  User: {
    id: 3,
    nickname: '네이마르',
  },
  createdAt: new Date(),
  content: '더미 댓글입니다.',
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
export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE';

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

export const addPostRequest = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        isAddingPost: true,
        addedPost: false,
        addPostErrorReason: '',
      };

    case ADD_POST_SUCCESS:
      return {
        ...state,
        isAddingPost: false,
        addedPost: true,
        mainPosts: [action.data, ...state.mainPosts],
      };

    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostErrorReason: action.error,
      };

    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        isAddingComment: true,
        addedComment: false,
        addCommentErrorReason: '',
      };

    case ADD_COMMENT_SUCCESS: {
      // ** 불변성 지키기 **
      // 댓글을 달 게시물 찾기
      const postIndex = state.mainPosts.findIndex(
        (v) => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      // 댓글 추가
      const Comments = [...post.Comments, action.data.comment];
      // 게시물 업데이트
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      1;
      return {
        ...state,
        isAddingComment: false,
        addedComment: true,
        mainPosts,
      };
    }

    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error,
      };

    case LOAD_COMMENTS_REQUEST:
      return {
        ...state,
      };

    case LOAD_COMMENTS_SUCCESS: {
      const postIndex = state.mainPosts.findIndex(
        (v) => v.id === action.data.postId,
      );
      const post = state.mainPosts[postIndex];
      const Comments = [...action.data.comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        mainPosts,
      };
    }

    case LOAD_COMMENTS_FAILURE: {
      return {
        ...state,
      };
    }

    case LOAD_HASHTAG_POSTS_REQUEST:
    case LOAD_USER_POSTS_REQUEST:
    case LOAD_MAIN_POSTS_REQUEST: {
      return {
        ...state,
        mainPosts: [],
      };
    }

    case LOAD_HASHTAG_POSTS_SUCCESS:
    case LOAD_USER_POSTS_SUCCESS:
    case LOAD_MAIN_POSTS_SUCCESS: {
      return {
        ...state,
        mainPosts: action.data,
      };
    }

    case LOAD_HASHTAG_POSTS_FAILURE:
    case LOAD_USER_POSTS_FAILURE:
    case LOAD_MAIN_POSTS_FAILURE: {
      return {
        ...state,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
