import React from 'react';
import { Carousel } from './components/carousel';
import styled from 'styled-components';
import './App.css';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const cardData = [
  {
    id: 1,
    name: 'Dog 1',
  },
  {
    id: 2,
    name: 'Dog 2',
  },
  {
    id: 3,
    name: 'Dog 3',
  },
  {
    id: 4,
    name: 'Dog 4',
  },
  {
    id: 5,
    name: 'Dog 5',
  },
  {
    id: 6,
    name: 'Dog 6',
  },
  {
    id: 7,
    name: 'Dog 7',
  },
  {
    id: 8,
    name: 'Dog 8',
  },
  {
    id: 9,
    name: 'Dog 9',
  },
  {
    id: 10,
    name: 'Dog 10',
  }
]

function App() {
  return (
    <Container>
      <Carousel data={cardData} />
    </Container>
  );
}

export default App;
