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
    margin-left: -8rem;
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
      style={{transform: transform.interpolate(t => `${t} rotateY(180deg)`)}}
    />
  )
}

export const Carousel = (props) => {
  const [ focusedCard, setFocusedCard ] = useState(0);

  const carouselRef = useRef(null);

  const [{ x }, set] = useSpring(() => ({ x: -160 }));

  useEffect(() => {
    const centralCard = carouselRef.current.children[focusedCard];
    const center = centralCard.offsetLeft + centralCard.offsetWidth / 2;

    return set({
      x: -center,
    })
  }, [focusedCard, set])

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ last, movement: [movementX], memo = x.value}) => {
    if (last) {
      let newCard = movementX < -50
        ? focusedCard + 1
        : movementX > 50
        ? focusedCard - 1
        : focusedCard;
      newCard = newCard < 0 ? 0 : newCard > props.data.length -1 ? props.data.length - 1 : newCard;
      if (newCard !== focusedCard) {
        return setFocusedCard(newCard);
      } else {
        const centralCard = carouselRef.current.children[focusedCard];
        const center = centralCard.offsetLeft + centralCard.offsetWidth / 2;

        return set({
          x: -center,
        })
      }
    };

    set({
      x: memo + movementX
    })

    return memo;
  });


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
            state={i < focusedCard ? 'prev' : i > focusedCard ? 'next' : 'current'}
            onClick={() => setFocusedCard(i)}
          />  
        )}
      </CarouselRow>
      <h1>{props.data[focusedCard].name}</h1>
    </Container>
  )
}