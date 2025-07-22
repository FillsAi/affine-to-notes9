import { Global, Injectable, Module, Provider } from '@nestjs/common';

import { OpentelemetryOptionsFactory } from '../../base/metrics';

// GCloud OpenTelemetry completely disabled for air-gap deployment
@Injectable()
export class GCloudOpentelemetryOptionsFactory extends OpentelemetryOptionsFactory {
  override getResource(): any {
    // No GCloud resource tracking for air-gap deployment
    return {};
  }

  override getSpanExporter(): any {
    // No GCloud span exporter for air-gap deployment
    return null;
  }
}

const FactorProvider: Provider = {
  provide: OpentelemetryOptionsFactory,
  useClass: GCloudOpentelemetryOptionsFactory,
};

@Global()
@Module({
  providers: [FactorProvider],
  exports: [FactorProvider],
})
export class GCloudMetrics {}
