/* eslint-disable no-unused-vars */
import React from 'react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { usePixiApp, CustomPIXIComponent, Stage } from 'react-pixi-fiber';
import AutoCarousel from './AutoCarousel';
import './style.css';

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
      {/* <Carousel>
        <img
          src="https://via.placeholder.com/150"
          alt="imagem"
          title="imagem"
        />
        <img
          src="https://via.placeholder.com/150"
          alt="imagem"
          title="imagem"
        />
        <img
          src="https://via.placeholder.com/150"
          alt="imagem"
          title="imagem"
        />
        <img
          src="https://via.placeholder.com/150"
          alt="imagem"
          title="imagem"
        />
        <img
          src="https://via.placeholder.com/150"
          alt="imagem"
          title="imagem"
        />
      </Carousel> */}

      <AutoCarousel x={0} y={-100} />
      <AutoCarousel x={0} y={-50} />
      <AutoCarousel x={0} y={0} />
      <AutoCarousel x={0} y={50} />
      <AutoCarousel x={0} y={100} />

      {/* For building a WebGL only app */}
      {/* <Viewport>
        <Container>
          <A x={20} y={50} width={100} height={100} fill={0xff0000} />
        </Container>
      </Viewport> */}
    </Stage>
  );
};
