import { get } from 'env-var';
import { registerAs } from '@nestjs/config';

export interface ISbtConfig {
  signerPrivateKey: string;
}

export const sbtConfig = registerAs<ISbtConfig>('sbt', () => ({
  signerPrivateKey: get('SBT_CONTRACT_SIGNER_PRIVATE_KEY')
    .required()
    .asString(),
}));
