import React from 'react';
import PropTypes from 'prop-types';
import { useCarousel } from 'Carousel.hooks';
import { Wrapper, CarouselContainer, CarouselSlot } from 'CarouselComponents';
import styles from 'Carousel.module.scss';

const Carousel = (props) => {
  const numItems = React.Children.count(props.children);
  const showNav = props.showNav;
  const shouldBlur = props.shouldBlur;

  const { state, renderNavTabs, getOrder } = useCarousel({
    onChange: props.onChange,
    interval: props.interval,
    children: props.children,
    numItems,
  });

  return (
    <>
      <Wrapper width={props.width}>
        <CarouselContainer width={props.width} dir={state.dir} sliding={state.sliding}>
          {props.children.map((media, index) => (
            <CarouselSlot
              key={index}
              width={props.width}
              height={props.height}
              order={getOrder({ index: index, pos: state.pos, numItems })}
              className={shouldBlur && styles.blurred}
            >
              {media}
            </CarouselSlot>
          ))}
        </CarouselContainer>
      </Wrapper>

      {renderNavTabs(showNav)}
    </>
  );
};

Carousel.propTypes = {
  children: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string,
  interval: PropTypes.number,
  showNav: PropTypes.bool,
  onChange: PropTypes.func,
  shouldBlur: PropTypes.bool,
};

Carousel.defaultProps = {
  height: 'inherit',
  interval: 5000,
  showNav: false,
  onChange: () => {},
  shouldBlur: false,
};

export default Carousel;
