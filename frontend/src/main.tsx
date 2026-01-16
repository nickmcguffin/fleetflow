import App from './App.tsx';
import { TelemetryProvider } from "./context/TelemetryContext.tsx";
import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MantineProvider>
        <TelemetryProvider>
          <App />
        </TelemetryProvider>
      </MantineProvider>
  </StrictMode>
)
