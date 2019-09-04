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

### Error Message

1. Error: Include unexpected. Element has to be either a Model, an Association or an object

- 라우터에서 sequelize include에서 model 오타

2. TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters

- 요청 주소에 한글이나 특수문자가 있으면 인코딩 해줘야된다.
- 프론트에서는 encodeURIComponent, 서버에서는 decodeURIComponent
