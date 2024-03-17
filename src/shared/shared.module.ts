import { Global, Module, Provider } from '@nestjs/common';

import { postChainProvider } from './services/post-chain/post-chain.provider';

const providers: Provider[] = [postChainProvider];
@Global()
@Module({
  providers,
  exports: providers,
})
export class SharedModule {}
