import { AppShell, Container } from '@mantine/core';
import './App.css';
import { Header } from './components/Header';
import { TelemetryStats } from "./components/TelemetryStats";

export default function App() {
  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
      styles={{
        main: {
          backgroundColor: 'var(--mantine-color-gray-0)',
          minHeight: '100vh',
        },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="90%" py="lg">
          <TelemetryStats />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
