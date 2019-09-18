# Nodebird

## Frontend

- react
- redux
- redux-saga
- next
- express

## Backend

- express
- sequelize
- mysql
- passport

## ETC

### Check Point

1. useEffect

   - 의존 배열의 값은 객체 대신 일반 값을 사용한다.
   - (객체나 배열은 비교하기 까다롭기 때문에)
   - 객체 안의 값을 사용할땐 먼저 객체가 undefined인지 체크하자

```js
useEffect(() => {
  // me는 객체 값
  if (me) {
    alert("메인 페이지로 이동합니다.");
    Router.push("/");
  }
}, [me && me.id]);
```

### Error Message

1. Error: Include unexpected. Element has to be either a Model, an Association or an object

- 라우터에서 sequelize include에서 model 오타

2. TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters

- 요청 주소에 한글이나 특수문자가 있으면 인코딩 해줘야된다.
- 프론트에서는 encodeURIComponent, 서버에서는 decodeURIComponent
