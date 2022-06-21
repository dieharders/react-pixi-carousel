import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styled from 'styled-components';

const ContainerRelativo =
  styled.div <
  { max } >
  `
  position: relative;
  max-width: ${({ max }) => `${max}px`};
  width: 100%;
`;

const Container = styled.div`
  max-width: 100%;
  width: 100%;
  overflow-x: scroll;
  display: flex;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }

  .buttons {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    width: 100%;

    button {
      background: #0000004e;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
    }

    .prev {
      transform: translateX(10px);
    }

    .next {
      transform: translateX(-10px);
    }
  }
`;

/**
 * Componente de Carosel simples. Para utilizar  certifique-se de que os childrens tem a mesma largura(width), para ter uma maior experiencia.
 * @param param0 {CaroselParams}
 * @returns {JSX.Element}
 */
const Carousel = ({ children, max_width }) => {
  const Carousel = useRef < HTMLDivElement > null;

  const [stateCarosel, setStateCarousel] = useState();

  const handleCarousel = useCallback(() => {
    if (Carousel.current) {
      const carousel = Carousel.current;
      setStateCarousel({
        ...stateCarosel,
        width_carosel: carousel.clientWidth,
        qnt_childrens: carousel.children.length,
        width_childrens: carousel.children.item(0)?.clientWidth,
        max_width_carousel:
          (carousel.children.length - 1) *
          carousel.children.item(0)?.clientWidth,
      });
    }
  }, [setStateCarousel]);

  const handleCarouselAction = (e) => {
    e.preventDefault();

    switch (e.currentTarget.id) {
      case 'next':
        return (Carousel.current.scrollLeft += stateCarosel?.width_childrens);

      case 'prev':
        return (Carousel.current.scrollLeft -= stateCarosel?.width_childrens);

      default:
        return null;
    }
  };

  useEffect(() => handleCarousel(), [handleCarousel]);

  return (
    <ContainerRelativo max={max_width || stateCarosel?.max_width_carousel}>
      <Container ref={Carousel}>
        {children}
        <div className="buttons">
          <button onClick={handleCarouselAction} id="prev" className="prev">
            prev
          </button>
          <button onClick={handleCarouselAction} id="next" className="next">
            next
          </button>
        </div>
      </Container>
    </ContainerRelativo>
  );
};

export default Carousel;
