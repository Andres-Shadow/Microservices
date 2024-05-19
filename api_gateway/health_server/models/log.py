import json
import datetime
class Log:
    def __init__(self, name, summary, description, log_date, log_type, module):
        self.name = name
        self.summary = summary
        self.description = description
        self.log_date = log_date
        self.log_type = log_type
        self.module = module

    def to_json(self):
        def default(o):
            if isinstance(o, (datetime.date, datetime.datetime)):
                return o.isoformat()
            return o.__dict__
        return json.dumps(self, default=default)