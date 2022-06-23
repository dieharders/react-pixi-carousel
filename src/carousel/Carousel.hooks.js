import { useCallback, useEffect, useReducer } from 'react';
import { PREV, NEXT, INDEX } from 'carousel/CarouselComponents';
import styles from 'carousel/CarouselComponents.module.scss';

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

const getOrder = ({ index, pos, numItems: itemCount }) => {
  const i = index + 1;
  let result = i - pos < 0 ? itemCount - Math.abs(i - pos) : i - pos;
  if (result > itemCount - 1) result = 0;
  return result;
};

export const useCarousel = ({ onChange, numItems, interval, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
  const renderNavTabs = (showNav) => {
    if (showNav) {
      return (
        <div className={styles.navContainer}>
          <ul
            className={[styles.listContainer, numItems > 1 ? styles.vAlign : ''].join(
              ' ',
            )}
            hidden={numItems <= 1}
          >
            {children.map((_, index) => (
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

  useEffect(() => {
    onChange && onChange(state.pos);
  }, [state.pos, onChange]);

  /**
   * Automatically move to next element
   * Watch `state.pos` for state changes
   */
  useEffect(() => {
    const isMultipleSources = numItems > 1;
    if (!isMultipleSources) return;

    const jiggleTime = Math.floor(Math.random(1) * 1000);
    const interval = interval + jiggleTime;
    const id = setTimeout(() => {
      slide(NEXT);
    }, interval);

    return () => clearTimeout(id);
  }, [state.pos, numItems, interval, slide]);

  // Export hooks
  return { slide, renderNavTabs, getOrder, state };
};
