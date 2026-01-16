from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fleetflow_shared import TelemetryPacket
from services.connection_manager import connection_manager

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
            await connection_manager.broadcast(packet.model_dump(mode='json'))
            print(f"Broadcasting to {len(connection_manager.active_connections)} client/s")
    except WebSocketDisconnect:
        print("Telemetry stream websocket disconnected.")
    except Exception as e:
        print(f"Error in telemetry stream: {e}")
        
@app.websocket("/ws/client")
async def client_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for clients to receive telemetry data
    """
    await connection_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)