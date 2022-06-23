import React from 'react';
import PropTypes from 'prop-types';
import { useCarousel } from 'carousel/Carousel.hooks';
import { Wrapper, Carousel, Slot } from 'carousel/CarouselComponents';
import styles from 'components/Marquee.module.scss';

const Marquee = (props) => {
  const numItems = React.Children.count(props.children);
  const shouldBlur = props.shouldBlur;
  const { state, getOrder } = useCarousel({
    onChange: props.onChange,
    interval: props.interval,
    children: props.children,
    numItems,
  });

  return (
    <Wrapper width={props.width}>
      <Carousel width={props.width} dir={state.dir} sliding={state.sliding}>
        {props.children.map((media, index) => (
          <Slot
            key={index}
            width={props.width}
            height={props.height}
            order={getOrder({ index: index, pos: state.pos, numItems })}
            className={shouldBlur && styles.blurred}
          >
            {media}
          </Slot>
        ))}
      </Carousel>
    </Wrapper>
  );
};

Marquee.propTypes = {
  children: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string,
  interval: PropTypes.number,
  showNav: PropTypes.bool,
  onChange: PropTypes.func,
  shouldBlur: PropTypes.bool,
};

Marquee.defaultProps = {
  height: 'inherit',
  interval: 5000,
  showNav: false,
  onChange: () => {},
  shouldBlur: false,
};

export default Marquee;
