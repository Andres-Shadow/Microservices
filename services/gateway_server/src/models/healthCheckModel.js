class CheckData {
  constructor(from, status) {
    this.from = from;
    this.status = status;
  }
}

class Check {
  constructor(data, name, status) {
    this.data = data;
    this.name = name;
    this.status = status;
  }
}

class LiveStatus {
  constructor(status, checks, version) {
    this.status = status;
    this.checks = checks;
    this.version = version;
  }
}

module.exports = { CheckData, Check, LiveStatus };
