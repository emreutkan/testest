import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store'; // Adjust the path to your store file
import { Slot } from 'expo-router';

const Layout = () => {
  return (
      <Provider store={store}>
        <Slot />
      </Provider>
  );
};

export default Layout;
