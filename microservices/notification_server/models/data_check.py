from datetime import datetime
from typing import List

class CheckData:
    def __init__(self, from_, status):
        self.from_ = from_
        self.status = status

    def to_dict(self):
        return {
            "from": self.from_,
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            from_=data["from"],
            status=data["status"]
        )

class Check:
    def __init__(self, data, name, status):
        self.data = data
        self.name = name
        self.status = status

    def to_dict(self):
        return {
            "data": self.data.to_dict(),
            "name": self.name,
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data=CheckData.from_dict(data["data"]),
            name=data["name"],
            status=data["status"]
        )

class HealthReport:
    def __init__(self, status, checks):
        self.status = status
        self.checks = checks

    def to_dict(self):
        return {
            "status": self.status,
            "checks": [check.to_dict() for check in self.checks]
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            status=data["status"],
            checks=[Check.from_dict(check) for check in data["checks"]]
        )
        
class HelathCheck:
    def __init__(self, ready, live):
        self.ready = ready
        self.live = live

    def to_dict(self):
        return {
            "ready": self.ready.to_dict(),
            "live": self.live.to_dict()
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            ready=HealthReport.from_dict(data["ready"]),
            live=HealthReport.from_dict(data["live"])
        )