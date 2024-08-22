import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SessionContext, SessionProvider } from './context/SessionContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
      <SessionContext.Consumer>
        {({ guestSessionData }) => <App guestID={guestSessionData} />}
      </SessionContext.Consumer>
    </SessionProvider>
  </StrictMode>
);
