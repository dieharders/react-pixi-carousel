import React from 'react';
import { Sprite, InteractionEvent, InteractiveComponent, Text } from 'react-pixi-fiber';
import { TextStyle, Point, Texture } from 'pixi.js';

interface T_ComponentProps {
  src: string;
  x: number;
  y: number;
  index?: number;
  // eslint-disable-next-line no-unused-vars
  click?: (event: InteractionEvent) => void;
}

type T_TitleParam = {
  x: number;
  y: number;
  index: number;
};

const Title = ({ x, y, index }: T_TitleParam) => {
  const _Text = Text as React.ElementType;
  const anchor = new Point(0.5, 0.5);
  const textColor = ['#ffffff', '#00ff99']; // gradient color

  return (
    <_Text
      text={`Num-${index}`}
      anchor={anchor}
      x={x}
      y={y - 30}
      style={
        new TextStyle({
          align: 'center',
          fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
          fontSize: 10,
          fontWeight: '400',
          fill: textColor,
          stroke: '#01d27e',
          strokeThickness: 1,
        })
      }
    />
  );
};

const Poster = React.forwardRef(
  (props: T_ComponentProps, ref: React.ForwardedRef<InteractiveComponent>) => {
    const { x, y, click, index, src } = props;
    const texture = Texture.from(src);
    const centerAnchor = new Point(0.5, 0.5);
    const _Sprite = Sprite as React.ElementType;

    return (
      <>
        <Title x={x} y={y} index={index || 0} />
        <_Sprite
          ref={ref}
          anchor={centerAnchor}
          texture={texture}
          x={x}
          y={y}
          interactive
          click={click}
        />
      </>
    );
  },
);

Poster.displayName = 'Poster';

export default Poster;
