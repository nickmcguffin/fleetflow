from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID, uuid4


class DeviceStatus(str, Enum):
    ONLINE = "online"
    WARNING = "warning"
    CRITICAL = "critical"
    FAULT = "fault"
    OFFLINE = "offline"


class TelemetryPacket(BaseModel):
    device_id: str
    msg_id: UUID = Field(default_factory=uuid4)

    status: DeviceStatus = DeviceStatus.ONLINE

    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # TODO: add device information fields to a message dict
    # end goal is to let the message store status/config/etc. information
    temp: float
    battery: int = Field(ge=0, le=100)


    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}