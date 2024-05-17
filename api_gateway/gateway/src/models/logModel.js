// Define la clase LogResponse
class LogResponse {
  constructor(name, summary, description, logType) {
    this.name = name;
    this.summary = summary;
    this.description = description;
    this.log_date = new Date().toISOString(); // Formato RFC3339
    this.log_type = logType;
    this.module = "GATEWAY";
  }
}

module.exports = LogResponse;
