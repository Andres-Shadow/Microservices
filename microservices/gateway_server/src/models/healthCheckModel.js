// Define la clase para el objeto 'data' dentro de cada check
class CheckData {
  /**
   * @param {string} from
   * @param {string} status
   */
  constructor(from, status) {
    this.from = from;
    this.status = status;
  }
}

// Define la clase para cada 'check' en la lista
class Check {
  /**
   * @param {CheckData} data
   * @param {string} name
   * @param {string} status
   */
  constructor(data, name, status) {
    this.data = data;
    this.name = name;
    this.status = status;
  }
}

// Define la clase para el objeto principal que contiene los 'checks'
class LiveStatus {
  /**
   * @param {string} status
   * @param {Check[]} checks
   * @param {string} version
   */
  constructor(status, checks, version) {
    this.status = status;
    this.checks = checks;
    this.version = version;
  }
}

module.exports = { CheckData, Check, LiveStatus };
