import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

// OpenTelemetry completely disabled for air-gap deployment
export abstract class BaseOpentelemetryOptionsFactory {
  abstract getMetricReader(): any;
  abstract getSpanExporter(): any;

  getInstractions(): any[] {
    return []; // No instrumentation
  }

  getMetricsProducers(): any[] {
    return []; // No metrics
  }

  getResource() {
    return {}; // No resource tracking
  }

  create(): any {
    return {}; // No telemetry configuration
  }
}

@Injectable()
export class OpentelemetryOptionsFactory extends BaseOpentelemetryOptionsFactory {
  getMetricReader(): any {
    return null; // No metrics for air-gap deployment
  }

  getSpanExporter(): any {
    return null; // No tracing for air-gap deployment
  }
}

@Injectable()
export class OpentelemetryProvider implements OnModuleInit {
  readonly #logger = new Logger(OpentelemetryProvider.name);

  constructor() {}

  async onModuleInit() {
    // OpenTelemetry disabled for air-gap deployment
    this.#logger.log('OpenTelemetry disabled for local deployment');
  }

  async onModuleDestroy() {
    // No cleanup needed
  }
}
