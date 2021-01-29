import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'


const CarouselRow = styled(animated.div)`
  display: flex;
  flex-wrap: nowrap;
`

const StyledCard = styled(animated.div)`
  width: 300px;
  height: 300px;
  margin: 2rem;
  background-image: url('https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
  background-size: cover;
  background-position: center;
`

const Card = (props) => {
  const { transform } = useSpring({
    transform: `perspective(700px) rotateY(${props.focused ? 0 : 70}deg) scale(${props.focused ? 1.75 : 1})`,
    config: { mass: 5, tension: 500, friction: 80 }
  })

  return (
    <StyledCard style={{transform: transform.interpolate(t => `${t} rotateY(180deg)`)}} />
  )
}

export const Carousel = (props) => {
  const [ focusedCard, setFocusedCard ] = useState(0);

  const carouselRef = useRef(null);

  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(({ last, movement: [movementX], memo = x.value}) => {
    if (last) {
      let newCard = movementX < -50 ? focusedCard + 1 : movementX > 50 ? focusedCard - 1 : focusedCard;
      newCard = newCard < 0 ? 0 : newCard > props.data.length -1 ? props.data.length - 1 : newCard;
      const centralCard = carouselRef.current.children[newCard];
      const center = centralCard.offsetLeft;

      return set({
        x: -center,
        onRest: setFocusedCard(newCard)
      })
    };

    set({
      x: memo + movementX
    })

    return memo;
  });

  console.log(x)

  return (
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
          focused={i === focusedCard}
        />  
      )}
    </CarouselRow>
  )
}