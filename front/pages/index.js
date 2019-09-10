import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

/**
 * GET /
 * 메인 페이지
 */
const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]); // ! ref가 아닌 일반 빈배열을 쓰면 랜더링할 때마다 빈 배열이 된다

  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id; // 로드한 글 중 가장 마지막 글의 id
        // 같은 id에 대한 중복 요청을 막는다.
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId,
          });
        }
        countRef.current.push(lastId);
      }
    }
  }, [mainPosts.length, hasMorePost]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePost]);

  return (
    <div>
      {me && <PostForm />}
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

/**
 * * 서버 사이드 렌더링 (주소창 or 새로고침)
 * 처음 로딩될 떼 & 새로고침 했을땐 프론트서버에서 실행되고
 * 링크 등으로 라우팅될 땐 프론트에서 실행된다.
 * ! 클라이언트 렌더링(링크 클릭)의 경우 getInitialProps와 리액트 라이프 사이클이 각각 동작
 * ! 그래서 데이터가 비어있을 경우 렌더링에 대한 조치를 취해야 한다.
 */
Home.getInitialProps = async (context) => {
  console.log(Object.keys(context));
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};

export default Home;
