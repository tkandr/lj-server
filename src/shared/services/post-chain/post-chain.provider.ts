import { createClient } from 'postchain-client';
import { POST_CHAIN_SERVICE_TOKEN } from 'src/constants';

import { PostChainService } from './post-chain.service';

export const postChainProvider = {
  provide: POST_CHAIN_SERVICE_TOKEN,
  useFactory: async () => {
    const client = await createClient({
      directoryNodeUrlPool: ['https://appnet.chromia.dev:7740'],
      blockchainRid:
        '76D6ED48F5D9C1455D9FA86E9AB73DE30062D719CCAA7EAD0A09A2791C37BB4E',
    });

    return new PostChainService(client);
  },
};
