import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react';
import { usePixiTicker } from 'react-pixi-fiber';
import { PREV, NEXT, INDEX } from 'carousel/Carousel.components';
import styles from 'carousel/Carousel.components.module.scss';

const initialState = { pos: 0, sliding: false, dir: NEXT };

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

const onClick = ({ event, itemRef, index }) => {
  console.log('@@ clicked', itemRef.current, index, event);
};

export const useCarousel = ({
  interval,
  x: parentX,
  y: parentY,
  data,
  showNav,
  slideComponent,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [renderSlides, setRenderSlides] = useState([]);
  const [moveAmountX, setMoveAmountX] = useState(parentX);
  const numItems = data?.length || 0;
  const randN = useRef(Math.random());
  const randomIntFromInterval = (min, max) => {
    return Math.floor(randN.current * (max - min + 1) + min);
  };

  // Update the items' state
  const animate = useCallback((delta) => {
    // Move the items horizontally
    const rate = 0.05;
    const randOffset = randomIntFromInterval(1, 100);
    const amount = delta * rate * randOffset;
    setMoveAmountX((prev) => prev - amount);
  }, []);

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

  /**
   * Navigation tabs
   */
  const renderNavTabs = () => {
    if (showNav) {
      return (
        <div className={styles.navContainer}>
          <ul
            className={[styles.listContainer, numItems > 1 ? styles.vAlign : ''].join(
              ' ',
            )}
            hidden={numItems <= 1}
          >
            {data.map((_, index) => (
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
   * @param Component ReactElement
   */
  const createSlides = useCallback(() => {
    const Component = slideComponent;
    return data.map((item, i) => {
      // Track ref for each item
      const posterRef = React.createRef();

      // Create a poster item using the passed component prop
      const imageWidth = 50; // @TODO Calc from image
      const h = imageWidth;
      const x = parentX + i * imageWidth;
      const y = parentY + h / 2;
      const poster = (
        <Component
          key={`poster-${i}`}
          ref={posterRef}
          index={i}
          src={item.src}
          x={x}
          y={y}
          width={imageWidth}
          height={imageWidth}
          click={(event) => onClick({ event, index: i, itemRef: posterRef })}
        />
      );
      return poster;
    });
  }, [data, parentX, parentY, slideComponent]);

  // Create list of slides
  useEffect(() => {
    const slides = createSlides();
    console.log('@@ init slides:', slides);
    setRenderSlides(slides);
  }, [createSlides]);

  // Update on each frame
  usePixiTicker(animate);

  /**
   * Automatically move to next element
   * Watch `state.pos` for state changes
   */
  useEffect(() => {
    const isMultipleSources = numItems > 1;
    if (!isMultipleSources) return;
    const jiggleTime = Math.floor(Math.random(1) * 1000);
    const intrvl = interval + jiggleTime;
    const id = setTimeout(() => {
      slide(NEXT);
    }, intrvl);
    return () => clearTimeout(id);
  }, [state.pos, numItems, interval, slide]);

  // Export hooks
  return {
    renderNavTabs,
    renderSlides,
    moveAmountX,
    state,
  };
};
