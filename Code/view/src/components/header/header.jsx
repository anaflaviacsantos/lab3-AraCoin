'use client'

import React from 'react';
import { Container, Title, Text, Burger } from '@mantine/core';
import classes from './header.module.css';

const Header = ({ open, setOpened }) => {
  return (
    <header className={classes.header}>
      <Container fluid className={classes.inner}>
        <Burger
          opened={open}
          onClick={() => setOpened((o) => !o)}
          title={open ? 'Close navigation' : 'Open navigation'}
          color='white'
        />
        <div>
          <Title order={1} style={{ color: 'white', textAlign: 'center' }}>
            Aracoin
          </Title>
          <Text style={{ color: '#cccccc', textAlign: 'center', marginTop: '5px' }}>
            
          </Text>
        </div>
      </Container>
    </header>
  );
};

export default Header;
