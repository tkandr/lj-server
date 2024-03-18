import { get } from 'env-var';
import { registerAs } from '@nestjs/config';

export interface ISbtConfig {
  signerPrivateKey: string;
  contractAddress: string;
}

export const sbtConfig = registerAs<ISbtConfig>('sbt', () => ({
  signerPrivateKey: get('SBT_CONTRACT_SIGNER_PRIVATE_KEY')
    .required()
    .asString(),
  contractAddress: get('SBT_CONTRACT_ADDRESS').required().asString(),
}));
