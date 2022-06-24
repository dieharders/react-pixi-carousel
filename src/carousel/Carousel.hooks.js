/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect, useRef, useReducer } from 'react';
import { usePixiTicker } from 'react-pixi-fiber';
import { PREV, NEXT, INDEX } from 'carousel/Carousel.components';

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

export const useCarousel = ({ x: parentX, y: parentY, data, speed, slideComponent }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [renderSlides, setRenderSlides] = useState([]);
  const [isSliding, setIsSliding] = useState(false);
  const [posX, setPosX] = useState(parentX);
  const targetMovePos = useRef(parentX);
  const [moveSpeed, setMoveSpeed] = useState(0);
  const numItems = data?.length || 0;
  const animTimer = useRef();

  const createAnimTimer = useCallback(() => {
    if (animTimer.current) return;

    setIsSliding(true);

    const imgWidth = data[0].width;
    setMoveSpeed(imgWidth / (speed * 60));

    const interval = speed * 1000;
    const timer = setTimeout(() => {
      console.log('@@ timeout', interval);
      setIsSliding(false);
      animTimer.current = null;
    }, interval);

    animTimer.current = timer;
  }, [data, speed]);

  // When item is clicked
  const onClick = useCallback(
    ({ event, itemRef, index }) => {
      console.log('@@ clicked', itemRef.current, index, event);
      // Start Animation
      createAnimTimer();
    },
    [createAnimTimer],
  );

  // Move the items horizontally
  const animate = useCallback(
    (delta) => {
      const amount = delta * moveSpeed;
      setPosX((prev) => {
        const bufferAmount = 5;
        if (Math.abs(targetMovePos.current) - Math.abs(prev) >= bufferAmount)
          return targetMovePos.current;
        return prev - amount;
      });
    },
    [moveSpeed],
  );

  // Update the items state
  const onTick = useCallback(
    (delta) => {
      if (isSliding) animate(delta);
    },
    [animate, isSliding],
  );

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
   * @param Component ReactElement
   */
  const createSlides = useCallback(() => {
    const Component = slideComponent;
    return data.map((item, i) => {
      // Track ref for each item
      const posterRef = React.createRef();

      // Create a poster item using the passed component prop
      const imageWidth = item.width;
      const h = imageWidth;
      const x = i * imageWidth;
      const y = h / 2;
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
  }, [data, onClick, slideComponent]);

  // Create list of slides
  useEffect(() => {
    const slides = createSlides();
    console.log('@@ init slides:', slides);
    setRenderSlides(slides);
  }, [createSlides]);

  // useEffect(() => {
  //   if (isSliding) {
  //     const imgWidth = data[0].width;
  //     targetMovePos.current = posX - imgWidth;
  //     console.log('@@ aaahhh');
  //   }
  // }, [data, posX, isSliding]);

  // Update on each frame
  usePixiTicker(onTick);

  /**
   * Automatically move to next element
   * Watch `state.pos` for state changes
   */
  // useEffect(() => {
  //   const isMultipleSources = numItems > 1;
  //   if (!isMultipleSources) return;
  //   const intrvl = 5000;
  //   const id = setTimeout(() => {
  //     slide(NEXT);
  //   }, intrvl);
  //   return () => clearTimeout(id);
  // }, [state.pos, numItems, slide]);

  // Export hooks
  return {
    renderSlides,
    posX,
    state,
  };
};
