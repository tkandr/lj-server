import { ethers, solidityPackedKeccak256 } from 'ethers';
import { Inject, Injectable } from '@nestjs/common';

import { ISbtConfig, sbtConfig as _sbtConfig } from '@lj/config';

@Injectable()
export class SbtService {
  constructor(@Inject(_sbtConfig.KEY) private readonly sbtConfig: ISbtConfig) {}

  public async getSingerMessage(address) {
    const now = new Date().getTime();
    const message = `verify ${now}`;
    const messageHash = solidityPackedKeccak256(
      ['string', 'address'],
      [message, address],
    );

    return messageHash;
  }

  private getSigner(): ethers.Wallet {
    return new ethers.Wallet(this.sbtConfig.signerPrivateKey);
  }
}
