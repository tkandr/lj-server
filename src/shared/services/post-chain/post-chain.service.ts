import { IClient } from 'postchain-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostChainService {
  constructor(private readonly client: IClient) {}

  public async playerHasAccount(evmAddress: string): Promise<boolean> {
    const mnaAccountId = await this.getMNAAccount(evmAddress);

    return !!mnaAccountId;
  }

  public async playerHasAvatar(evmAddress: string): Promise<boolean> {
    const mnaAccountId = await this.getMNAAccount(evmAddress);

    if (!mnaAccountId) {
      return false;
    }

    const player = await this.client.query<{
      username: string; // Name of avatar
      date_of_birth: number; // When it was created
    }>('player.find_by_account_id', {
      account_id: mnaAccountId,
    });

    return !!player;
  }

  private async getMNAAccount(evmAddress: string): Promise<Buffer> {
    return await this.client.query<Buffer>(
      'ft3.evm.get_account_by_evm_address',
      {
        acc: Buffer.from(evmAddress.replace('0x', ''), 'hex'),
      },
    );
  }
}
