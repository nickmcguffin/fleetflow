import asyncio
from transport import WebSocketTransport
from device import SimulatedDevice

async def main():
    transport = WebSocketTransport("ws://127.0.0.1:8000/ws/telemetry")
    await transport.connect()

    devices = [
        SimulatedDevice("ALPHA-01", transport),
        SimulatedDevice("BRAVO-02", transport),
        SimulatedDevice("CHARLIE-03", transport)
    ]

    tasks = [asyncio.create_task(device.run()) for device in devices]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())