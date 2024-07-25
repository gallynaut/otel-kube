// Require dependencies
const opentelemetry = require("@opentelemetry/sdk-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const {
  ExpressInstrumentation,
} = require("opentelemetry-instrumentation-express");
// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const exporter = new OTLPTraceExporter({
  // optional - url default value is http://localhost:55681/v1/traces
  url: "http://localhost:4318/v1/traces",
  // optional - collection of custom headers to be sent with each request, empty by default
  headers: {},
});
const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  instrumentations: [new ExpressInstrumentation()],
});
sdk.start();
