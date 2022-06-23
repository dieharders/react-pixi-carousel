import React from 'react';
import PropTypes from 'prop-types';
import { usePixiApp } from 'react-pixi-fiber';
import { useCarousel } from 'carousel/Carousel.hooks';
import { Wrapper, Carousel, Slot } from 'carousel/Carousel.components';

const Marquee = ({ x, y, width, height, interval, showNav, data }) => {
  const { renderSlides, moveAmountX } = useCarousel({
    x,
    y,
    width,
    height,
    interval,
    data,
    showNav,
    slideComponent: Slot,
  });
  const { screen } = usePixiApp();
  const { width: screenWidth } = screen;
  console.log('@@ screenWidth', screenWidth);

  return (
    <Wrapper width={width} height={height} position={[x, y]}>
      <Carousel
        position={[moveAmountX, y]}
        width={width}
        height={height}
        data={renderSlides}
      />
    </Wrapper>
  );
};

Marquee.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  interval: PropTypes.number,
  showNav: PropTypes.bool,
};

Marquee.defaultProps = {
  interval: 5000,
  showNav: false,
};

export default Marquee;
