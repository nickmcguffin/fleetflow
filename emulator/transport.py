import websockets
from fleetflow_shared.models import TelemetryPacket

class WebSocketTransport:
    def __init__(self, url: str):
        """
        A transport mechanism using WebSockets to send telemetry data.
        """
        self.url = url
        self.connection = None
        # TODO: Implement a listener for incoming commands from the server to allow device control from the UI. 

    async def connect(self):
        """
        Establishes connection and starts a background listener for commands.
        """
        try:
            self.connection = await websockets.connect(self.url)
            print(f"Connection established to {self.url}")

        except Exception as e:
            print(f"Connection error: {e}")
            raise

    async def send(self, packet: TelemetryPacket):
        """
        Serializes the Pydantic packet and sends it.
        """
        if not self.connection:
            return

        try:
            await self.connection.send(packet.model_dump_json())
        except websockets.ConnectionClosed:
            self.connection = None
