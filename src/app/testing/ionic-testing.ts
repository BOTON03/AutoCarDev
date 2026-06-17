import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';

export function provideIonicTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([provideIonicAngular()]);
}
