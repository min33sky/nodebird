const dummyUser = {
  nickname: '리오넬메시',
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: false,
};

export const initialState = {
  me: null, // 내 정보
  user: null, // 남의 정보
  isLoggedIn: false, // 로그인 여부
  isLoggingIn: false, // 로그인 시도중
  isLoggingOut: false, // 로그아웃 시도중
  loginErrorReason: '', // 로그인 실패 이유
  signedUp: false, // 회원가입 성공
  isSigningUp: false, // 회원가입 시도중
  signUpErrorReason: '', // 회원가입 실패 이유
  followingList: [], // 팔로잉 리스트
  followerList: [], // 팔로워 리스트
  isLoading: false, // 로딩 여부
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

// 팔로우,팔로잉목록 가져오기
export const LOAD_FOLLOW_REQUEST = 'LOAD_FOLLOW_REQUEST';
export const LOAD_FOLLOW_SUCCESS = 'LOAD_FOLLOW_SUCCESS';
export const LOAD_FOLLOW_FAILURE = 'LOAD_FOLLOW_FAILURE';

// 팔로우 하기
export const FOLLOW_USER_REQUEST = 'FOLLOW_USER_REQUEST';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

// 언팔로우 하기
export const UNFOLLOW_USER_REQUEST = 'UNFOLLOW_USER_REQUEST';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';

export const loginAction = {
  type: LOG_IN_REQUEST,
  data: {
    nickname: '메시',
  },
};

export const logoutAction = {
  type: LOG_OUT_REQUEST,
};

export const signUpAction = (data) => ({
  type: SIGN_UP_REQUEST,
  data,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        isLoading: true,
        me: dummyUser,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        me: dummyUser,
        isLoading: false,
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    case LOG_OUT_REQUEST:
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        signupData: action.data,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
