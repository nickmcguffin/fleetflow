from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fleetflow_shared import TelemetryPacket

app = FastAPI(title="FleetFlow Mission Control")

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "FleetFlow Mission Control is operational."}

@app.websocket("/ws/telemetry")
async def telemetry_stream(websocket: WebSocket):
    """
    WebSocket endpoint to receive telemetry data from devices
    """
    await websocket.accept()
    print("Telemetry stream websocket established.")
    
    try:
        while True:
            data = await websocket.receive_json()
            packet = TelemetryPacket(**data)
            print(
                f"Received telemetry packet from device: {packet.device_id} at {packet.timestamp}:"
                f"Temperature: {packet.temp}, Battery: {packet.battery}%"
            )
    except WebSocketDisconnect:
        print("Telemetry stream websocket disconnected.")
    except Exception as e:
        print(f"Error in telemetry stream: {e}")