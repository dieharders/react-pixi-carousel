import React, { useRef } from 'react';
import Marquee from 'components/Marquee';
import { Stage } from 'react-pixi-fiber';
import 'style.css';

export const App = () => {
  const height = 500;
  const width = 500;
  const imageWidth = 125;
  const imageHeight = 125;
  const fetchData = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const src = `https://picsum.photos/${imageWidth}/${imageHeight}`;
      arr.push({ src, width: imageWidth, height: imageHeight });
    }
    return arr;
  };
  const data = useRef(fetchData(1000));

  return (
    <Stage
      options={{
        width,
        height,
        antialias: true,
        backgroundColor: 0x012b30,
        autoResize: true,
        resolution: window.devicePixelRatio || 1,
      }}
    >
      <Marquee
        x={0}
        y={50}
        width={width}
        height={imageHeight}
        data={data.current}
        speed={1}
      />
    </Stage>
  );
};
