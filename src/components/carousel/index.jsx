import React, { useState, useRef } from 'react';
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
    margin-left: -120px;
  }
`

const StyledCard = styled(animated.div)`
  z-index: ${({ focused }) => focused ? 1 : 0};
  width: 20rem;
  height: 20rem;
  background-image: url('https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
  background-size: cover;
  background-position: center;
`

const Card = (props) => {
  const [mouseDown, setMouseDown ] = useState(true);
  const { transform } = useSpring({
    transform: `
      perspective(700px)
      rotateY(${props.state === 'prev' ? 70 : props.state === 'next' ? -70 : 0}deg)
      scale(${props.state === 'current' ? 1 : 0.6})`,
    config: { mass: 5, tension: 500, friction: 80 }
  })


  const handleMouseUp = () => {
    if (mouseDown) {
      props.onClick();
    }
  }

  const handleMouseMove = () => {
    if (mouseDown) {
      setMouseDown(false);
    }
  }

  return (
    <StyledCard
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      focused={props.state === 'current'}
      style={{transform: transform.interpolate(t => t)}}
    />
  )
}

export const Carousel = (props) => {
  const [ focusedCard, setFocusedCard ] = useState({
    current: 0,
    prev: 0,
  });

  const carouselRef = useRef(null);

  const [{ x }, set] = useSpring(() => ({ x: -160 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ last, movement: [movementX], memo = x.value}) => {
    if (last) {
      setFocusedCard(prevState => {
        return {
          ...prevState,
          prev: prevState.current
        }
      })

      return centerOnCard(focusedCard.current);
    };
    const spaceBetween = carouselRef.current.children[0].offsetWidth - 120;
    if (Math.abs(movementX) > spaceBetween || focusedCard.current !== focusedCard.prev) {
      const absCardsTravelled = Math.floor(Math.abs(movementX) / spaceBetween);
      const cardsTravelled = movementX < 0 ? absCardsTravelled : -absCardsTravelled;
      const newCardIndex = cardsTravelled + focusedCard.prev;
      if (newCardIndex !== focusedCard.current) {
        const newCard =
          newCardIndex > props.data.length - 1
            ? props.data.length - 1
            : newCardIndex < 0
              ? 0
              : newCardIndex
       
        setFocusedCard(prevState => {
          return {
            ...prevState,
            current: newCard
          }
        }); 
      }
    }
    set({
      x: memo + movementX
    })

    return memo;
  }, {
    filterTaps: true,
  });

  const centerOnCard = (cardIndex) => {
    const centralCard = carouselRef.current.children[cardIndex];
    const center = centralCard.offsetLeft + centralCard.offsetWidth / 2;
    
    return set({
      x: -center,
    })
  }

  const selectCard = (cardIndex) => {
    setFocusedCard({prev: cardIndex, current: cardIndex});
    centerOnCard(cardIndex);
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
            state={i < focusedCard.current ? 'prev' : i > focusedCard.current ? 'next' : 'current'}
            onClick={() => selectCard(i)}
          />  
        )}
      </CarouselRow>
      <h1>{props.data[focusedCard.prev].name}</h1>
    </Container>
  )
}