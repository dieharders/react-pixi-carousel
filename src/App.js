/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import Marquee from 'components/Marquee';
import { usePixiApp, CustomPIXIComponent, Stage } from 'react-pixi-fiber';
import AutoCarousel from 'components/AutoCarousel';
import 'style.css';
import Poster from 'components/Poster';

// const A = CustomPIXIComponent(
//   {
//     customDisplayObject: (_props) => new PIXI.Graphics(),
//     customApplyProps: function (instance, _oldProps, newProps) {
//       const { fill, x, y, width, height } = newProps;
//       console.log({ fill, x, y, width, height });
//       instance.clear();
//       instance.beginFill(fill);
//       instance.drawRect(x, y, width, height);
//       instance.endFill();
//     },
//   },
//   'Rectangle',
// );

// const DisplayObjectViewport = CustomPIXIComponent(
//   {
//     customDisplayObject: ({ application }) => {
//       console.log({ application });
//       const viewport = new PixiViewport({
//         screenWidth: application.renderer.width,
//         screenHeight: application.renderer.height,
//         worldWidth: 1000,
//         worldHeight: 1000,
//         // interaction: application.renderer.plugins.interaction,
//       })
//         .drag()
//         .pinch()
//         .wheel()
//         .decelerate();
//       console.log({ viewport });
//       return viewport;
//     },
//   },
//   'Viewport',
// );

// const Viewport = function Viewport() {
//   const application = usePixiApp();

//   return <DisplayObjectViewport application={application} />;
// };

export const App = () => {
  const height = 500;
  const width = 500;
  const fetchData = (n) => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      // const placeholder = `https://via.placeholder.com/150`;
      const bunny = 'https://i.imgur.com/IaUrttj.png';
      arr.push({ src: bunny });
    }
    return arr;
  };
  const data = useRef(fetchData(100));

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
      <Marquee x={0} y={-100} width="500px" height="320px" data={data.current} />

      {/* <AutoCarousel x={0} y={-100} />
      <AutoCarousel x={0} y={-50} />
      <AutoCarousel x={0} y={0} />
      <AutoCarousel x={0} y={50} />
      <AutoCarousel x={0} y={100} /> */}

      {/* For building a WebGL only app */}
      {/* <Viewport>
        <Container>
          <A x={20} y={50} width={100} height={100} fill={0xff0000} />
        </Container>
      </Viewport> */}
    </Stage>
  );
};
