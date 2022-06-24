import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePixiApp } from 'react-pixi-fiber';
import { useCarousel } from 'carousel/Carousel.hooks';
import { Wrapper, Carousel, Slot } from 'carousel/Carousel.components';

// @TODO Not playing nice with multiple instances
const Marquee = ({ id, x, y, width, height, data, speed }) => {
  const { renderSlides, posX } = useCarousel({
    id,
    x,
    y,
    width,
    height,
    speed, // in seconds
    data,
    slideComponent: Slot,
  });
  const { screen } = usePixiApp();
  const { width: screenWidth } = screen;

  useEffect(() => {
    console.log('@@ screenWidth', screenWidth);
  }, [screenWidth]);

  return (
    <Wrapper width={width} height={height} position={[x, y]}>
      <Carousel position={[posX, y]} width={width} height={height} data={renderSlides} />
    </Wrapper>
  );
};

Marquee.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  showNav: PropTypes.bool,
};

Marquee.defaultProps = {
  showNav: false,
};

export default Marquee;
