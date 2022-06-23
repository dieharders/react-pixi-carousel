import React from 'react';
import PropTypes from 'prop-types';
import { useCarousel } from 'carousel/Carousel.hooks';
import { Wrapper, Carousel, Slot } from 'carousel/CarouselComponents';

const Marquee = (props) => {
  // const componentRef = React.createRef();
  const shouldBlur = props.shouldBlur;
  const { state, renderSlides, moveAmountX } = useCarousel({
    x: props.x,
    y: props.y,
    height: props.height,
    onChange: props.onChange,
    interval: props.interval,
    shouldBlur,
    data: props.data,
    slideComponent: Slot,
  });

  return (
    <Wrapper width={props.width} position={[props.x, props.y]}>
      <Carousel
        // ref={componentRef}
        position={[moveAmountX, 0]}
        width={props.width}
        dir={state.dir}
        sliding={state.sliding}
        data={renderSlides}
      />
    </Wrapper>
  );
};

Marquee.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
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
