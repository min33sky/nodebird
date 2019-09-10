import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './ImageZoom';

const SERVER_URL = 'http://localhost:8080';

const PostImages = ({ images }) => {
  const [showImageZoom, setShowImageZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImageZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImageZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <div
          onClick={onZoom}
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        >
          <img alt="img" src={`${SERVER_URL}/${images[0].src}`} />
        </div>
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <div
          onClick={onZoom}
          role="button"
          tabIndex={0}
          style={{ display: 'inline', cursor: 'pointer' }}
        >
          <img alt="img" src={`${SERVER_URL}/${images[0].src}`} width="50%" />
        </div>
        <div
          onClick={onZoom}
          role="button"
          tabIndex={-1}
          style={{ display: 'inline', cursor: 'pointer' }}
        >
          <img alt="img" src={`${SERVER_URL}/${images[1].src}`} width="50%" />
        </div>
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <div>
        <div
          onClick={onZoom}
          role="button"
          tabIndex={0}
          style={{ display: 'inline', cursor: 'pointer' }}
        >
          <img alt="img" src={`${SERVER_URL}/${images[0].src}`} width="50%" />
        </div>
        <div
          style={{
            display: 'inline-block',
            width: '50%',
            textAlign: 'center',
            verticalAlign: 'middle',
            cursor: 'pointer',
          }}
          onClick={onZoom}
        >
          <Icon type="plus" />
          <br />
          {images.length - 1}개의 사진 더보기
        </div>
      </div>
      {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    }),
  ).isRequired,
};

export default PostImages;
