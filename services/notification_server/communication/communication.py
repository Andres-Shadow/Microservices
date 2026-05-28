from nats.aio.client import Client as NATS
from models.log import Log
import asyncio
import datetime
import os

class NATSClient:
    _instance = None
    _is_connected = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(NATSClient, cls).__new__(cls)
            cls._instance.nc = NATS()
        return cls._instance

    async def connect(self):
        if not self._is_connected:
            nats_host = os.getenv("NATS_SERVER", "localhost")
            nats_url = "nats://" + nats_host + ":4222"
            try:
                await self.nc.connect(nats_url)
                self._is_connected = True
            except Exception as e:
                print(f"Failed to connect to NATS: {e}")
                self._is_connected = False

    async def publish(self, subject, message):
        await self.nc.publish(subject, message)

    async def drain(self):
        await self.nc.drain()

    async def close(self):
        await self.nc.close()
        self._is_connected = False

async def send_log_via_nats(log):
    nats_client = NATSClient()
    await nats_client.connect()

    if nats_client._is_connected:
        log_json = log.to_json()
        await nats_client.publish("MicroservicesLogs", log_json.encode('utf-8'))

def create_log(name, summary, description, log_type):
    log = Log(
        name=name,
        summary=summary,
        description=description,
        log_type=log_type,
        log_date=datetime.datetime.now(),
        module="NOTIFICATION-API"
    )
    asyncio.run(send_log_via_nats(log))

async def test_connection():
    nats_client = NATSClient()
    await nats_client.connect()
    return nats_client._is_connected

async def send_sample_message():
    nats_client = NATSClient()
    await nats_client.connect()

    if nats_client._is_connected:
        log = Log(
            name="Test",
            summary="Test",
            description="Test",
            log_type="INFO",
            log_date=datetime.datetime.now(),
            module="NOTIFICATION-API"
        )
        log_json = log.to_json()
        await nats_client.publish("sample", log_json.encode('utf-8'))
        await nats_client.drain()
        await nats_client.close()