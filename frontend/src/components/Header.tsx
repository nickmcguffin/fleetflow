import { Group, Text, Box, Badge, Container } from '@mantine/core';
import { useTelemetry } from '../context/TelemetryContext';
import './Header.css';

export function Header() {
    const { isConnected } = useTelemetry();

    return (
        <Box
            component="header"
            py="md"
            style={{
                borderBottom: '1px solid var(--mantine-color-gray-2)',
                backgroundColor: 'var(--mantine-color-body)',
            }}
        >
            <Container size="90%" px="lg">
                <Group justify="space-between" align="center">
                    <Box>
                        <Text size="lg" fw={700} c="dark">
                            FleetFlow Mission Control
                        </Text>
                        <Text size="sm">
                            Real-time device status and analytics
                        </Text>
                    </Box>

                    <Badge
                        color={isConnected ? 'green' : 'red'}
                        variant="dot"
                        size="lg"
                        bg={isConnected ? 'green.0' : 'red.0'}
                        className={isConnected ? 'pulse-dot' : ''}
                        style={{ border: 'none' }}
                    >
                        {isConnected ? 'System Active' : 'Disconnected'}
                    </Badge>
                </Group>
            </Container>
        </Box>
    );
}

