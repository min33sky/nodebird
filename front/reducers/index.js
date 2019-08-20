// Root Reducer
import { combineReducers } from 'redux';
import post from './post';
import user from './user';

// 여러개의 리듀서를 하나로 합쳐서 하나의 상태 객체를 얻는다.
const rootReducer = combineReducers({
  post,
  user,
});

export default rootReducer;
