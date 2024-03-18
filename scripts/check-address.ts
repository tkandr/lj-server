import { createClient } from 'postchain-client';

const evmAddress = '';

async function main() {
  const client = await createClient({
    directoryNodeUrlPool: ['https://appnet.chromia.dev:7740'],
    blockchainRid:
      '76D6ED48F5D9C1455D9FA86E9AB73DE30062D719CCAA7EAD0A09A2791C37BB4E',
  });

  // Fetch the MNA Account ID which will simplifying checking the status of that player
  const mnaAccountId = await client.query<Buffer>(
    'ft3.evm.get_account_by_evm_address',
    {
      acc: Buffer.from(evmAddress.replace('0x', ''), 'hex'),
    },
  );

  if (!mnaAccountId) {
    console.log(`No MNA Account found for ${evmAddress}`);
    return;
  }

  console.log(`Found MNA Account ID: ${mnaAccountId.toString('hex')}`);

  // Check if the player registered an avatar, and if so what is their username?
  const player = await client.query<{
    username: string; // Name of avatar
    date_of_birth: number; // When it was created
  }>('player.find_by_account_id', {
    account_id: mnaAccountId,
  });

  if (!player) {
    console.log(`No avatar found for ${mnaAccountId.toString('hex')}`);
    return;
  }

  const dateOfBirth = new Date(player.date_of_birth);
  console.log(
    `Avatar with name: ${
      player.username
    } was created at ${dateOfBirth.toISOString()}`,
  );

  // Check what placeables the user has
  const inventory = await client.query<
    {
      'chromia.IOriginal.name': string;
      amount: number;
    }[]
  >('assets.get_counted_originals_from_owner_with_interface_q', {
    account_id: mnaAccountId,
    interface: 'com.myneighboralice.IPlaceable',
    attributes: ['chromia.IOriginal.name'],
    from: 0,
    page_size: 100,
  });

  console.log(
    `Inventory matched by interface found with a size of ${inventory.length}`,
  );
  for (const item of inventory) {
    console.log(`${item['chromia.IOriginal.name']} - ${item.amount}`);
  }
}

main().catch((e) => console.error(e));
