import { SimpleGrid } from '@mantine/core';
import { AlertTriangle, Cpu, CheckCircle2, MonitorCheck, MonitorDown, Wifi, WifiOff } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useTelemetry } from '../context/TelemetryContext';

export function TelemetryStats() {
    const { devices, isConnected } = useTelemetry();

    const totalCount = devices.length;

    const offlineDevices = devices.filter(d => d.status === 'offline');
    const hasOffline = offlineDevices.length > 0;
    // TODO: Make fault card derive state and icon from highest level warning,
    const faultCount = devices.filter(d => d.status && ["warning", "critical", "fault", "offline"].includes(d.status));
    const hasFaults = faultCount.length > 0;

    return (
        <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }} 
            spacing="md"
        >
            <StatsCard
                title="Fleet Status"
                value={isConnected ? 'Connected' : 'Offline'}
                description={isConnected ? "Link Stable" : "Retrying..."}
                descriptionColor={isConnected ? 'green' : 'red'}
                icon={isConnected ? Wifi : WifiOff}
                iconColor="blue"
            />
            <StatsCard
                title="Total Devices"
                value={totalCount}
                description="Live fleet size"
                icon={Cpu}
                iconColor="blue"
            />
            <StatsCard
                title="Offline Devices"
                value={offlineDevices.length}
                description={hasOffline ? "Attention required." : "All systems nominal"}
                descriptionColor={hasOffline ? 'red' : 'dimmed'}
                icon={hasOffline ? MonitorDown : MonitorCheck}
                iconColor="blue"
            />

            <StatsCard
                title="Warnings & Faults"
                value={faultCount.length}
                description={hasFaults ? "Requires attention" : "All systems nominal"}
                descriptionColor={hasFaults ? 'red' : 'dimmed'}
                icon={hasFaults ? AlertTriangle : CheckCircle2}
                iconColor="blue"
            />
        </SimpleGrid>
    );
}