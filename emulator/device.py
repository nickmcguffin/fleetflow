import asyncio
import random
from datetime import datetime
from fleetflow_shared import TelemetryPacket, DeviceStatus


class SimulatedDevice:
    def __init__(self, device_id: str, transport):
        self.device_id = device_id
        self.transport = transport

        self.status = DeviceStatus.ONLINE
        self.temp = random.uniform(30.0, 40.0)
        self.battery = random.randint(50, 90)

        self.is_running = False
        self.is_charging = False # TODO: make this toggleable through the UI

    async def _simulate_orbit(self):
        """
        A background task to flip the charging state periodically. The idea is that 
        it is simulating moving in and out of solar coverage.
        TODO: Remove function entirely after I implement UI control to change charging state manually.
        """
        while self.is_running:
            await asyncio.sleep(random.randint(30, 60))
            self.is_charging = not self.is_charging
            state = "in solar coverage, charging." if self.is_charging else "out of solar coverage, not charging."
            print(f" {self.device_id} is now in {state}")

    async def _update_sensors(self):
        """
        Simulate a somewhat realistic sensor drift (Random Walk).
        """

        # For each tick, apply a small random drift to the temperature
        # To avoid unrealistic temperatures on devices I've applied
        # hard minimum (10) and maximum (75) temperature limits.
        # TODO: try and  smooth the temperature changes out, so they aren't super jumpy
        # worried that this is gonna look gross in the UI.
        drift = random.uniform(-0.3, 0.3)
        heat_effect = 0.4 if self.is_charging else -0.4
        self.temp = max(10, min(75, self.temp + drift + heat_effect))

        # TODO: Might update some charge rates here if it looks whacky in the UI
        if self.is_charging:
            # Trying to simulate a realistic charging behaviour - lithium ion batteries
            # charge faster below roughly 80% from the very little research I've done
            # (see: CC/CV charging profile)
            charge_chance = 0.8 if self.battery < 80 else 0.2
            if random.random() < charge_chance:
                self.battery = min(100, self.battery + 1)
        elif self.battery > 0 and random.random() < 0.1:
            self.battery -= 1

        # TODO: I'd like to add some logic at some point to simulate faults and give 
        # more varied and meaningful status updates.

        # TODO: When the battery hits 0 we set the device status to be OFFLINE. I'd like to eveentually
        # have the device stop sending packets, and be able to be restarted from the UI somehow -
        # potentially with new initialising data... not sure yet.
        if self.battery == 0:
            self.status = DeviceStatus.OFFLINE
        elif self.temp > 60.0 or self.battery < 5:
            self.status = DeviceStatus.CRITICAL
        elif self.temp > 45.0 or self.battery < 20:
            self.status = DeviceStatus.WARNING
        else:
            self.status = DeviceStatus.ONLINE

    async def run(self):
        """
        Main loop that periodically updates sensor readings and sends telemetry packets.
        """
        self.is_running = True
        asyncio.create_task(self._simulate_orbit())
        print(f"Simulated device {self.device_id} has started.")

        try:
            while self.is_running:
                await self._update_sensors()

                # TODO: If the device is OFFLINE skip sending packets or send an OFFLINE state ??.
                packet = TelemetryPacket(
                    device_id=self.device_id,
                    status=self.status,
                    temp=round(self.temp, 2),
                    battery=self.battery,
                    timestamp=datetime.utcnow()
                )
                await self.transport.send(packet)

                # TODO: :Intorduce some randomness to the sending interval to simulate network jitter?
                # TODO: When battery hits 0, stop the loop or keep sending OFFLINE?
                # I think I'd like the UI to know it is offline for a while before it disappears.
                await asyncio.sleep(2)

        except asyncio.CancelledError:
            self.is_running = False
            print(f"Simulated device {self.device_id} is shutting down.")
