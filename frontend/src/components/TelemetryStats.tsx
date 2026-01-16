import { SimpleGrid } from '@mantine/core';
import { AlertTriangle, Cpu, CheckCircle2, MonitorCheck, MonitorDown, Wifi, WifiOff } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useTelemetry } from '../context/TelemetryContext';

export function TelemetryStats() {
    const { devices, isConnected } = useTelemetry();

    const totalCount = devices.length;

    // TODO: Make active devices status badge.
    const activeCount = devices.filter(d => d.status === 'online').length;

    // TODO: Make fault card derive state and icon from highest level warning,
    const faultCount = devices.filter(d => d.status && ["warning", "critical", "fault", "offline"].includes(d.status)).length;

    return (
        <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} 
            spacing="md"
        >
            <StatsCard
                title="Fleet Status"
                value={isConnected ? 'Connected' : 'Offline'}
                description={isConnected ? "Link Stable" : "Retrying..."}
                descriptionColor={isConnected ? 'green' : 'red'}
                icon={isConnected ? Wifi : WifiOff}
                iconColor={isConnected ? 'green' : 'red'}
            />


            {/* TODO: Colours/Icons need to change for this one... not sure I like this total devices being the way it is. */}
            <StatsCard
                title="Total Devices"
                value={totalCount}
                description="Live fleet size"
                icon={Cpu}
                iconColor="green"
            />

            <StatsCard
                title="Active Devices"
                value={activeCount}
                description={activeCount <= totalCount ? "All systems nominal" : "Attention required."}
                icon={activeCount <= totalCount ? MonitorCheck : MonitorDown}
                iconColor={activeCount <= totalCount ? "green" : "yellow"}
            />

            <StatsCard
                title="Active Alerts"
                value={faultCount}
                description={faultCount > 0 ? "Requires attention" : "All systems nominal"}
                descriptionColor={faultCount > 0 ? 'red' : 'dimmed'}
                icon={faultCount > 0 ? AlertTriangle : CheckCircle2}
                iconColor={faultCount > 0 ? 'red' : 'green'}
            />
        </SimpleGrid>
    );
}