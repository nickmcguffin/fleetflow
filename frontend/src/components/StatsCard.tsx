import { Paper, Text, Group, Box, Title } from '@mantine/core';
import type { MantineColor } from '@mantine/core';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description: string;
    descriptionColor?: MantineColor;
    icon: LucideIcon;
    iconColor?: MantineColor;
}

export function StatsCard({
    title,
    value,
    description,
    descriptionColor = 'green',
    icon: Icon,
    iconColor = 'blue'
}: StatsCardProps) {
    return (
        <Paper 
            withBorder 
            p="lg" 
            radius="md" 
            style={{
                marginInline: "auto",
                minWidth: 240,
                width: '100%',
                maxWidth: 320
            }}
        >
            <Group justify="space-between" align="center" wrap="nowrap">
                <Box>
                    <Text size="sm" fw={500} c="dimmed">
                        {title}
                    </Text>
                    <Title order={1} fw={700} style={{ fontSize: '2rem' }}>
                        {value}
                    </Title>
                    <Text size="xs" c={descriptionColor} fw={500} mt={4}>
                        {description}
                    </Text>
                </Box>
                <Box
                    style={{
                        backgroundColor: `var(--mantine-color-${iconColor}-0)`,
                        padding: '12px',
                        borderRadius: '12px',
                        color: `var(--mantine-color-${iconColor}-6)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon size={24} strokeWidth={2} />
                </Box>
            </Group>
        </Paper>
    );
}
