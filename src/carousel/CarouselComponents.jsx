import classNames from 'classnames';
import styles from 'carousel/CarouselComponents.module.scss';

export const NEXT = 'NEXT';
export const PREV = 'PREV';
export const INDEX = 'INDEX';

export const Wrapper = ({ width }) => {
  const wrapperStyle = { width };
  return <div className={classNames(styles.wrapper)} style={wrapperStyle}></div>;
};

export const Carousel = ({ width, sliding, children, dir }) => {
  const calcTransform = () => {
    if (children.length <= 1) return 'translateX(0%)';
    if (!sliding) return 'translateX(-100%)';
    if (dir === INDEX) return 'translateX(-100%)';
    if (dir === NEXT) return 'translateX(0%)';
    if (dir === PREV) return 'translateX(-200%)';
    return 'translateX(-100%)';
  };
  const carouselStyle = {
    width,
    transition: sliding ? 'none' : 'transform 400ms ease',
    transform: calcTransform(),
  };

  return <div className={classNames(styles.container)} style={carouselStyle}></div>;
};

export const Slot = ({ width, height, order }) => {
  const slotStyle = { width, height, order, '-webkit-order': order };
  return <div style={slotStyle}></div>;
};
