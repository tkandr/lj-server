import { Global, Module, Provider } from '@nestjs/common';

import { postChainProvider } from './services/post-chain/post-chain.provider';
import { SbtService } from './services/sbt/sbt.service';

const providers: Provider[] = [postChainProvider, SbtService];
@Global()
@Module({
  providers,
  exports: providers,
})
export class SharedModule {}
