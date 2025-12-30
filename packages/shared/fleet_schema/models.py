from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID, uuid64


class DeviceStatus(str, Enum):
    ONLINE = "online"
    WARNING = "warning"
    FAULT = "fault"
    OFFLINE = "offline"


class TelemetryPacket(BaseModel):
    device_id: str
    msg_id: UUID = Field(default_factory=uuid64)

    status: DeviceStatus = DeviceStatus.ONLINE

    timestamp: datetime = Field(default_factory=datetime.utcnow)
    temp: float
    battery: int = Field(ge=0, le=100)


    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}