import React, { useCallback, useState, useEffect, useRef } from 'react';
import { usePixiTicker, Text, Container } from 'react-pixi-fiber';
import { TextStyle } from 'pixi.js';
import Poster from './Poster';

const AutoCarousel = ({ x: parentX, y: parentY }) => {
  const ref = React.createRef(null);
  const numPosters = 1000;
  const height = 500;
  const rate = 5;
  const [moveX, setMoveX] = useState(parentX);
  const [tick, setTick] = useState(0);
  const [moveAmount, setMoveAmount] = useState(0);
  const posters = useRef([]);
  const [refsById, setRefsById] = useState(); // Keep track of items' refs
  const imageWidth = 50;

  const animate = useCallback((delta) => {
    setTick((tick) => tick * delta);
    const randOffset = Math.random();
    setMoveAmount(delta * rate * randOffset);
  }, []);
  usePixiTicker(animate);

  const onClick = ({ event, itemRef, index }) => {
    // const elem = refsById[index].current;
    console.log('@@ clicked', itemRef.current, index);
  };

  const makeList = () => {
    const refs = [];

    for (let i = 0; i < numPosters; i++) {
      // Track ref for each item
      const itemRef = React.createRef(null);
      refs.push(itemRef);

      const x = parentX + i * imageWidth;
      const y = parentY + height / 2;
      const textColor = ['#ffffff', '#00ff99']; // gradient
      const poster = (
        <>
          <Text
            text={`Num-${i}`}
            anchor={0.5}
            x={x}
            y={y - 30}
            style={
              new TextStyle({
                align: 'center',
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fontSize: 10,
                fontWeight: 400,
                fill: textColor,
                stroke: '#01d27e',
                strokeThickness: 1,
              })
            }
          />
          <Poster
            ref={itemRef}
            x={x}
            y={y}
            interactive
            click={(event) => onClick({ event, index: i, itemRef })}
          />
        </>
      );
      posters.current.push(poster);
    }

    setRefsById(refs);

    return posters.current;
  };

  // Create list of slides
  useEffect(() => {
    posters.current = makeList();
  }, []);

  // Update the items' state
  useEffect(() => {
    // Change state of each item
    // if (!refsById) return;
    // for (let i in posters.current) {
    //   const elem = refsById[i].current;
    //   // Move item horizontally
    //   elem.x -= moveAmount;
    // }

    setMoveX(moveX - moveAmount);
  }, [moveAmount]);

  return (
    <Container ref={ref} position={[moveX, parentY]}>
      {posters.current}
    </Container>
  );
};

export default AutoCarousel;
