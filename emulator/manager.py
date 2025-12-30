import asyncio
from device import SimulatedDevice


class ConsoleTransport:
    async def send(self, packet):
        print(f"{packet.device_id} | Temp: {packet.temp}°C | Status: {packet.status}")


async def main():
    transport = ConsoleTransport()

    devices = [
        SimulatedDevice(f"SAT-{i:02}", transport) 
        for i in range(1, 4)
    ]

    tasks = [asyncio.create_task(d.run()) for d in devices]

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
