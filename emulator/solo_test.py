import asyncio
from device import SimulatedDevice

class DummyTransport:
    async def send(self, packet):
        print(f"[{packet.timestamp.strftime('%H:%M:%S')}] {packet.device_id} "
              f"| Temp: {packet.temp:5.2f}°C "
              f"| Bat: {packet.battery:3}% "
              f"| Status: {packet.status.value.upper()}")

async def run_test():
    transport = DummyTransport()
    
    fleet = [
        SimulatedDevice("ALPHA-01", transport),
        SimulatedDevice("BRAVO-02", transport),
        SimulatedDevice("CHARLIE-03", transport)
    ]
    
    print("--- STARTING SOLO EMULATOR TEST ---")

    tasks = [asyncio.create_task(d.run()) for d in fleet]
    
    try:
        await asyncio.wait_for(asyncio.gather(*tasks), timeout=120)
    except asyncio.TimeoutError:
        print("\n--- TEST COMPLETE ---")

if __name__ == "__main__":
    asyncio.run(run_test())