import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper,
  CarouselContainer,
  CarouselSlot,
  PREV,
  NEXT,
  INDEX,
} from 'CarouselComponents';
import styles from 'Carousel.module.scss';

const initialState = { pos: 0, sliding: false, dir: NEXT };

const Carousel = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const numItems = React.Children.count(props.children);
  const showNav = props.showNav;
  const onChange = props.onChange;
  const shouldBlur = props.shouldBlur;

  const getOrder = ({ index, pos, numItems: itemCount }) => {
    const i = index + 1;
    let result = i - pos < 0 ? itemCount - Math.abs(i - pos) : i - pos;
    if (result > itemCount - 1) result = 0;
    return result;
    // return index - pos < 0 ? itemCount - Math.abs(index - pos) : index - pos;
  };

  /**
   * Move carousel next/prev/specific slot
   * @param {string} dir
   * @param {number|0} target
   */
  const slide = useCallback(
    (dir, target = 0) => {
      dispatch({ type: dir, numItems, target });

      const inputDelay = 50;
      setTimeout(() => {
        dispatch({ type: 'stopSliding' });
      }, inputDelay);
    },
    [numItems],
  );

  useEffect(() => {
    onChange && onChange(state.pos);
  }, [state.pos, onChange]);

  /**
   * Navigation tabs
   */
  const nav = () => {
    if (showNav) {
      return (
        <div className={styles.navContainer}>
          <ul
            className={[styles.listContainer, numItems > 1 ? styles.vAlign : ''].join(
              ' ',
            )}
            hidden={numItems <= 1}
          >
            {props.children.map((_, index) => (
              <div
                key={index}
                className={[styles.tabContainer, styles.vAlign].join(' ')}
                onClick={() => slide(INDEX, index)}
              >
                <li
                  key={index}
                  className={state.pos === index ? styles.active : styles.inactive}
                />
              </div>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  /**
   * Automatically move to next element
   * Watch `state.pos` for state changes
   */
  useEffect(() => {
    const isMultipleSources = numItems > 1;
    if (!isMultipleSources) return;

    const jiggleTime = Math.floor(Math.random(1) * 1000);
    const interval = props.interval + jiggleTime;
    const id = setTimeout(() => {
      slide(NEXT);
    }, interval);

    return () => clearTimeout(id);
  }, [state.pos, numItems, props.interval, slide]);

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

      {nav()}
    </>
  );
};

const reducer = (state, { type, numItems, target }) => {
  const delta = Math.abs(state.pos - target);

  switch (type) {
    case 'reset':
      return initialState;
    case INDEX:
      if (state.pos === target) return state;
      if (target > state.pos) {
        return {
          ...state,
          dir: INDEX, // NEXT
          sliding: true,
          pos: state.pos === numItems - 1 ? 0 : state.pos + delta,
        };
      } else {
        return {
          ...state,
          dir: INDEX, // PREV
          sliding: true,
          pos: state.pos === 0 ? numItems - 1 : state.pos - delta,
        };
      }
    case PREV:
      return {
        ...state,
        dir: PREV,
        sliding: true,
        pos: state.pos === 0 ? numItems - 1 : state.pos - 1,
      };
    case NEXT:
      return {
        ...state,
        dir: NEXT,
        sliding: true,
        pos: state.pos === numItems - 1 ? 0 : state.pos + 1,
      };
    case 'stopSliding':
      return { ...state, sliding: false };
    default:
      return state;
  }
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
