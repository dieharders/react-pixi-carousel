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

export const useCarousel = ({
  id: parentId,
  x: parentX,
  y: parentY,
  data,
  speed,
  slideComponent,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [renderSlides, setRenderSlides] = useState([]);
  const [isSliding, setIsSliding] = useState(false);
  const [posX, setPosX] = useState(parentX);
  const targetMovePos = useRef(parentX);
  const [moveSpeed, setMoveSpeed] = useState(0);
  const numItems = data?.length || 0;
  const imgWidth = data[0].width;

  const startAnim = useCallback(() => {
    setIsSliding(true);
    const spd = speed === 0 ? 1 : speed; // Prevent divide by 0
    setMoveSpeed(imgWidth / (spd * 60));
  }, [speed, imgWidth]);

  // When item is clicked
  const onClick = useCallback(
    ({ event, itemRef, index }) => {
      console.log('@@ clicked', itemRef.current, index, event);
      // Start Animation
      startAnim();
    },
    [startAnim],
  );

  // Move the items horizontally
  const animate = useCallback(
    (delta) => {
      const amount = delta * moveSpeed;
      setPosX((prev) => {
        // Move item with immediately if speed=0
        if (speed === 0 && Math.abs(prev) <= Math.abs(targetMovePos.current)) {
          console.log('@@ stopped');
          setIsSliding(false);

          return targetMovePos.current;
        }
        // Ensure perfect alignment
        if (Math.abs(prev) >= Math.abs(targetMovePos.current)) {
          setIsSliding(false);
          return targetMovePos.current;
        }
        // Move item smoothly
        return prev - amount;
      });
    },
    [moveSpeed, speed],
  );

  // Update the items state
  const onTick = useCallback(
    (delta) => {
      if (isSliding) animate(delta);
      if (!isSliding) targetMovePos.current = posX - imgWidth;
    },
    [isSliding, animate, posX, imgWidth],
  );

  // @TODO Use this logic to drive animation and track state
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
          key={`${parentId}-poster-${i}`}
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
  }, [data, onClick, parentId, slideComponent]);

  // Create list of slides
  useEffect(() => {
    const slides = createSlides();
    console.log('@@ init slides:', slides);
    setRenderSlides(slides);
  }, [createSlides]);

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
