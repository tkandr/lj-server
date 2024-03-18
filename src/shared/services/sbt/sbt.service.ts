import { ethers } from 'ethers';
import { Inject, Injectable } from '@nestjs/common';

import { ISbtConfig, sbtConfig as _sbtConfig } from '@lj/config';

@Injectable()
export class SbtService {
  private readonly signer: ethers.Wallet = new ethers.Wallet(
    this.sbtConfig.signerPrivateKey,
  );
  constructor(@Inject(_sbtConfig.KEY) private readonly sbtConfig: ISbtConfig) {}

  public async getSingerMessage(address): Promise<{
    message: string;
    signature: string;
    contractAddress: string;
  }> {
    const now = new Date().getTime();
    const message = `verify ${now}`;
    const messageHash = ethers.solidityPackedKeccak256(
      ['string', 'address'],
      [message, address],
    );
    const signature = await this.signer.signMessage(
      ethers.getBytes(messageHash),
    );

    return {
      signature,
      message,
      contractAddress: this.sbtConfig.contractAddress,
    };
  }
}
