import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'


const Container = styled.div`
  position: relative;
  padding-bottom: 8rem;
  h1 {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`

const CarouselRow = styled(animated.div)`
  display: flex;
  flex-wrap: nowrap;
  touch-action: pan-x;

  & > *:not(:first-child) {
    margin-left: 32px;
  }
`

const StyledCard = styled(animated.div)`
  z-index: ${({ active }) => active ? 1 : 0};
  width: 15rem;
  height: 15rem;
  background-image: url('https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
  background-size: cover;
  background-position: center;
`

const Card = ({ handleActiveState }) => {
  const [ active, setActive ] = useState(false);
  const [{ xy, scale }, set] = useSpring(() => ({ xy: [0, 0], scale: 1 }));

  const bind = useDrag(({ down, movement: [movementX, movementY], last, elapsedTime }) => {
    if (active) {
      if (last) {
        handleActiveState(false)
        setActive(false);
        return set({ xy: [0, 0], scale: 1});
      }
      return set({ xy: down ? [movementX, movementY] : [0, 0], scale: 1.1 });
    }
    if (
      (Math.abs(movementY) > Math.abs(movementX)) &&
      movementY > 200 &&
      elapsedTime < 1000
    ) {
      setActive(true)
      handleActiveState(true)
    }
  });
 

  return (
    <StyledCard
      {...bind()}
      active={active}
      style={{
        transform: xy.interpolate((x, y) => `translate3d(${x}px, ${y}px, 0) scale(${scale.value})`),
      }}
    />
  )
}

export const StoreCarousel = (props) => {
  const [ lock, setLock ] = useState(false);
  const [ focusedCard, setFocusedCard ] = useState(0);

  const carouselRef = useRef(null);

  const [{ x }, set] = useSpring(() => ({ x: -120 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ last, movement: [movementX], memo = x.value}) => {
    if (lock) return;

    if (last) {
      const spaceBetween = carouselRef.current.children[0].offsetWidth + 32;
      
      const absCardsTravelled = Math.floor(Math.abs(movementX) / spaceBetween);
      const cardsTravelled = movementX < 0 ? absCardsTravelled : -absCardsTravelled;
      const newCardIndex = cardsTravelled + focusedCard;
      
      const newCard =
        newCardIndex > props.data.length - 1
          ? props.data.length - 1
          : newCardIndex < 0
            ? 0
            : newCardIndex
      
      setFocusedCard(newCard); 
      return centerOnCard(newCard);
    };

    set({
      x: memo + movementX
    })

    return memo;
  }, { axis: 'x'});

  const centerOnCard = (cardIndex) => {
    const centralCard = carouselRef.current.children[cardIndex];
    const center = centralCard.offsetLeft + centralCard.offsetWidth / 2;
    
    return set({
      x: -center,
    })
  }


  return (
    <Container>
      <CarouselRow
        {...bind()}
        ref={carouselRef}
        style={{
          transform: x.interpolate(x => `translateX(calc(50% + ${x}px))`),
        }}
      >
        {props.data.map((item, i) => 
          <Card
            key={item.id}
            handleActiveState={(active) => setLock(active)}
          />  
        )}
      </CarouselRow>
      <h1>{props.data[focusedCard].name}</h1>
    </Container>
  )
}