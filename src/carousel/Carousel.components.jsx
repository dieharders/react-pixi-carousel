import React from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import { TextStyle, Point, Texture } from 'pixi.js';

export const NEXT = 'NEXT';
export const PREV = 'PREV';
export const INDEX = 'INDEX';

export const Wrapper = (props) => {
  return (
    <Container {...props}>
      {/* Background color */}
      <Sprite
        x={props.position[0]}
        y={props.position[1]}
        width={props.width}
        height={props.height}
        texture={Texture.WHITE}
      />
      {props.children}
    </Container>
  );
};

export const Carousel = (props) => {
  return <Container {...props}>{props.data}</Container>;
};

const Title = ({ x, y, index }) => {
  const _Text = Text;
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

export const Slot = React.forwardRef((props, ref) => {
  const { x, y, click, index, src, width, height } = props;
  const texture = Texture.from(src);
  const centerAnchor = new Point(0, 0.5);

  return (
    <>
      <Sprite
        ref={ref}
        x={x}
        y={y}
        anchor={centerAnchor}
        texture={texture}
        width={width}
        height={height}
        interactive
        click={click}
      />
      <Title x={x - width / 2} y={y} index={index || 0} />
    </>
  );
});
Slot.displayName = 'Slot';
