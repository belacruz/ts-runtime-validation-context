import React from 'react';
import { UserContextProvider } from './UserContext.tsx';
import Header from './Header.tsx';
import Content from './Content.tsx';

const App = () => {
  return (
    <UserContextProvider>
      <div className="container-principal">
        <Header />
        <Content />
      </div>
    </UserContextProvider>
  );
};

export default App;
