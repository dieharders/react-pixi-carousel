import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  usePixiTicker,
  Container,
  InteractionEvent,
  InteractiveComponent,
  PointLikeTuple,
  // usePixiApp,
} from 'react-pixi-fiber';
import Poster from 'components/Poster';

type T_ComponentProps = {
  x: number;
  y: number;
};

type T_ClickProps = {
  event: InteractionEvent;
  itemRef: React.RefObject<InteractiveComponent>;
  index: number;
};

const AutoCarousel = ({ x: parentX, y: parentY }: T_ComponentProps) => {
  const componentRef = React.createRef<Container>();
  const numPosters = 1000;
  const height = 500;
  const [moveAmountX, setMoveAmountX] = useState<number>(parentX);
  const [posters, setPosters] = useState<JSX.Element[]>([]);
  const imageWidth = 50;
  const randN = useRef(Math.random());
  const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(randN.current * (max - min + 1) + min);
  };

  // Update the items' state
  const animate = useCallback((delta: number) => {
    // Move the items horizontally
    const rate = 0.05;
    const randOffset = randomIntFromInterval(1, 100);
    const amount = delta * rate * randOffset;
    setMoveAmountX((prev) => prev - amount);
  }, []);

  const onClick = ({ event, itemRef, index }: T_ClickProps) => {
    console.log('@@ clicked', itemRef.current, index, event);
  };

  const makeList = useCallback(() => {
    const postersArray: JSX.Element[] = [];

    for (let i = 0; i < numPosters; i++) {
      // Track ref for each item
      const posterRef = React.createRef<InteractiveComponent>();

      // Create a poster item
      const x = parentX + i * imageWidth;
      const y = parentY + height / 2;
      const poster = (
        <Poster
          key={`poster-${i}`}
          ref={posterRef}
          index={i}
          x={x}
          y={y}
          click={(event: InteractionEvent) =>
            onClick({ event, index: i, itemRef: posterRef })
          }
        />
      );
      postersArray.push(poster);
    }

    return postersArray;
  }, [parentX, parentY]);

  // Create list of slides
  useEffect(() => {
    const arr = makeList();
    setPosters(arr);
  }, [makeList]);

  // Update on each frame
  usePixiTicker(animate);

  // Can also register a render callback like so...
  // const { ticker } = usePixiApp();
  // ticker.add(animate);

  // Render component
  const position: PointLikeTuple = [moveAmountX, parentY];
  const _Container = Container as React.ElementType;

  return (
    <_Container ref={componentRef} position={position}>
      {posters}
    </_Container>
  );
};

export default AutoCarousel;
