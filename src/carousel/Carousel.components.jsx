import React from 'react';
import { Container, Sprite, Text } from 'react-pixi-fiber';
import { TextStyle, Point, Texture } from 'pixi.js';
// import classNames from 'classnames';
// import styles from 'carousel/Carousel.components.module.scss';

export const NEXT = 'NEXT';
export const PREV = 'PREV';
export const INDEX = 'INDEX';

export const Wrapper = (props) => {
  // @TODO Refactor these styling to work with Pixi components

  // const { width } = props;
  // const wrapperStyle = { width };
  // return <div className={classNames(styles.wrapper)} style={wrapperStyle}></div>;

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
  // @TODO Refactor these styling and logic to work with Pixi components

  // const { dir, width, sliding } = props;
  // const calcTransform = () => {
  //   if (children.length <= 1) return 'translateX(0%)';
  //   if (!sliding) return 'translateX(-100%)';
  //   if (dir === INDEX) return 'translateX(-100%)';
  //   if (dir === NEXT) return 'translateX(0%)';
  //   if (dir === PREV) return 'translateX(-200%)';
  //   return 'translateX(-100%)';
  // };
  // const carouselStyle = {
  //   width,
  //   transition: sliding ? 'none' : 'transform 400ms ease',
  //   transform: calcTransform(),
  // };

  // return <div className={classNames(styles.container)} style={carouselStyle}></div>;

  return <Container {...props}>{props.data}</Container>;
};

// @TODO Refactor these styling to work with Pixi components

// export const Slot = ({ width, height, order }) => {
//   const slotStyle = { width, height, order, '-webkit-order': order };
//   return <div style={slotStyle}></div>;
// };

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
  const centerAnchor = new Point(0.5, 0.5);

  return (
    <>
      <Title x={x} y={y} index={index || 0} />
      <Sprite
        ref={ref}
        anchor={centerAnchor}
        texture={texture}
        x={x}
        y={y}
        width={width}
        height={height}
        interactive
        click={click}
      />
    </>
  );
});
Slot.displayName = 'Slot';
