/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type DeviceStatus = "online" | "warning" | "critical" | "fault" | "offline";

export interface TelemetryPacket {
  device_id: string;
  msg_id?: string;
  status?: DeviceStatus;
  timestamp?: string;
  temp: number;
  battery: number;
}
