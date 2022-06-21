import React from 'react';
import { Sprite } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

const Poster = React.forwardRef((props, ref) => {
  const bunnySrc = 'https://i.imgur.com/IaUrttj.png';
  const texture = PIXI.Texture.from(bunnySrc);
  const centerAnchor = new PIXI.Point(0.5, 0.5);

  return (
    <Sprite anchor={centerAnchor} texture={texture} {...props} ref={ref} />
  );
});

export default Poster;
