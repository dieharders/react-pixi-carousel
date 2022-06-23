import React, { useRef } from 'react';
import Marquee from 'components/Marquee';
import { Stage } from 'react-pixi-fiber';
import 'style.css';

export const App = () => {
  const height = 500;
  const width = 500;
  const fetchData = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      const src = 'https://i.imgur.com/IaUrttj.png';
      arr.push({ src });
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
      <Marquee x={0} y={50} width={width} height={100} data={data.current} />
    </Stage>
  );
};
