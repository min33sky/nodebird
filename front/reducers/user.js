import produce from 'immer';

export const initialState = {
  me: null, // 내 정보 & 로그인 여부
  userInfo: null, // 다른 유저 정보
  isLoggingIn: false, // 로그인 시도중
  isLoggingOut: false, // 로그아웃 시도중
  loginErrorReason: '', // 로그인 실패 이유
  isSignedUp: false, // 회원가입 성공
  isSigningUp: false, // 회원가입 시도중
  signUpErrorReason: '', // 회원가입 실패 이유
  isLoading: false, // 로딩 여부
  followingList: [],
  followerList: [],
  isEditingNickname: false, // 닉네임 변경 중
  nicknameErrorReason: '',
  hasMoreFollower: false, // 팔로워 더보기 버튼
  hasMoreFollowing: false, // 팔로잉 더보기 버튼
  signupData: null,
};

/**
 * ACTION TYPE
 * : request, success, failure 이런식의 액션 타입들은
 *   비동기 처리가 필요하므로 Redux-saga에서 처리하고
 *   그 외는 리덕스 자체에서 처리한다.
 */
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

// 사용자 정보 가져오기
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

// 팔로우 목록 가져오기
export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

// 팔로우
export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

// 언팔로우
export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

// 닉네임 변경
export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

// *********************** Action Func ************************** //
export const loginAction = (data) => ({
  type: LOG_IN_REQUEST,
  data,
});

export const logoutAction = {
  type: LOG_OUT_REQUEST,
};

export const signUpAction = (data) => ({
  type: SIGN_UP_REQUEST,
  data,
});

// ************************ REDUCER ***************************** //
const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST: {
        draft.isLoading = true;
        break;
      }

      case LOG_IN_SUCCESS: {
        draft.isLoading = false;
        draft.me = action.data;
        break;
      }

      case LOG_IN_FAILURE: {
        draft.isLoading = false;
        draft.me = null;
        draft.loginErrorReason = action.error;
        break;
      }

      case LOG_OUT_REQUEST: {
        draft.isLoggingOut = true;
        break;
      }

      case LOG_OUT_SUCCESS: {
        draft.isLoggingOut = false;
        draft.me = null;
        break;
      }

      case LOG_OUT_FAILURE: {
        break;
        // 에러 추가
      }

      case SIGN_UP_REQUEST: {
        draft.isSigningUp = true;
        draft.isSignedUp = false;
        break;
      }

      case SIGN_UP_SUCCESS: {
        draft.signupData = action.data;
        draft.isSigningUp = false;
        draft.isSignedUp = true;
        break;
      }

      case SIGN_UP_FAILURE: {
        draft.isSigningUp = false;
        draft.signUpErrorReason = action.error;
        break;
      }

      case LOAD_USER_REQUEST: {
        break;
      }

      case LOAD_USER_SUCCESS: {
        if (action.me) {
          draft.me = action.data;
          break;
        }
        draft.userInfo = action.data;
        break;
      }

      case LOAD_USER_FAILURE: {
        break;
      }

      case FOLLOW_USER_REQUEST: {
        break;
      }

      case FOLLOW_USER_SUCCESS: {
        draft.me.Followings.unshift({ id: action.data });
        break;
      }

      case FOLLOW_USER_FAILURE: {
        break;
      }

      case UNFOLLOW_USER_REQUEST: {
        break;
      }

      case UNFOLLOW_USER_SUCCESS: {
        const followingIndex = draft.me.Followings.findIndex(
          (v) => v.id === action.data,
        );
        const followingListIndex = draft.followingList.findIndex(
          (v) => v.id === action.data,
        );
        draft.me.Followings.splice(followingIndex, 1);
        draft.followingList.splice(followingListIndex, 1);
        break;
      }

      case UNFOLLOW_USER_FAILURE: {
        break;
      }

      // 게시물 등록할 때 로그인 한 유저 정보도 업데이트
      case ADD_POST_TO_ME: {
        draft.me.Posts.unshift({ id: action.data });
        break;
      }

      // 게시물 삭제할 때 로그인 한 유저 정보도 업데이트
      case REMOVE_POST_OF_ME: {
        const index = draft.me.Posts.findIndex((v) => v.id === action.data);
        draft.me.Posts.splice(index, 1);
        break;
      }

      case LOAD_FOLLOWERS_REQUEST: {
        // 처음 요청할 때는 비어있는 상태에서 시작 (이게 없으면 이전에 불러왔던 값들도 같이 출력)
        draft.followerList = !action.offset ? [] : draft.followerList;
        // 처음 데이터를 가져올 때는 더보기 버튼을 보여준다.
        draft.hasMoreFollower = action.offset ? draft.hasMoreFollower : true;
        break;
      }

      case LOAD_FOLLOWERS_SUCCESS: {
        action.data.forEach((e) => {
          draft.followerList.push(e);
        });
        // 3개일 때만 더보기 버튼을 보여준다.
        draft.hasMoreFollower = action.data.length === 3;
        break;
      }

      case LOAD_FOLLOWERS_FAILURE: {
        break;
      }

      case LOAD_FOLLOWINGS_REQUEST: {
        draft.followingList = !action.offset ? [] : draft.followingList;
        draft.hasMoreFollowing = action.offset ? draft.hasMoreFollowing : true;
        break;
      }

      case LOAD_FOLLOWINGS_SUCCESS: {
        action.data.forEach((e) => {
          draft.followingList.push(e);
        });
        draft.hasMoreFollowing = action.data.length === 3;
        break;
      }

      case LOAD_FOLLOWINGS_FAILURE: {
        break;
      }

      case REMOVE_FOLLOWER_REQUEST: {
        break;
      }

      case REMOVE_FOLLOWER_SUCCESS: {
        const followerIndex = draft.me.Followers.findIndex(
          (v) => v.id === action.data,
        );
        const followerListIndex = draft.followerList.findIndex(
          (v) => v.id === action.data,
        );
        draft.me.Followers.splice(followerIndex, 1);
        draft.followerList.splice(followerListIndex, 1);
        break;
      }

      case REMOVE_FOLLOWER_FAILURE: {
        break;
      }

      case CHANGE_NICKNAME_REQUEST: {
        draft.isEditingNickname = true;
        draft.nicknameErrorReason = '';
        break;
      }

      case CHANGE_NICKNAME_SUCCESS: {
        draft.me.nickname = action.data;
        draft.isEditingNickname = false;
        break;
      }

      case CHANGE_NICKNAME_FAILURE: {
        draft.isEditingNickname = false;
        draft.nicknameErrorReason = action.error;
        break;
      }

      default: {
        break;
      }
    }
  });
};

export default reducer;
