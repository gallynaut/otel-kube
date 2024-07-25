import { trace } from "@opentelemetry/api";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const otelColEndpoint =
  process.env.OTEL_COL_OTLP_ENDPOINT || "http://localhost:4318/v1/traces";
console.log(`Exporting to traces to ${otelColEndpoint}`);

const serviceName = process.env.SERVICE_NAME || "OtelDemo";

const exporter = new OTLPTraceExporter({
  url: otelColEndpoint,
});
const sdk = new opentelemetry.NodeSDK({
  spanProcessor: new SimpleSpanProcessor(exporter),
  serviceName: serviceName,
});
sdk.start();
console.log(`${serviceName}: Start Tracing...\n`);

const startTimestamp = Date.now();
let spanCounter = 0;
setInterval(async () => {
  process.stdout.write(`\rSending trace #${spanCounter}`);
  let span = trace
    .getTracer("My Tracer")
    .startSpan(`Span number: # ${spanCounter++} (${startTimestamp})`);
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * 100))
  );
  span.end();
}, 3000);
