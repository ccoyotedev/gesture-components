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
    id: 1
  },
  {
    id: 2
  },
  {
    id: 3
  },
  {
    id: 4
  },
  {
    id: 5
  },
  {
    id: 6
  },
  {
    id: 7
  },
  {
    id: 8
  },
  {
    id: 9
  },
  {
    id: 10
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
