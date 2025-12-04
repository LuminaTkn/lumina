const anchor = require('@coral-xyz/anchor');
const { TOKEN_PROGRAM_ID, getAccount, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } = require('@solana/spl-token');

describe('Noren Token', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  const wallet = provider.wallet;

  let mint;
  let userTokenAccount;
  let recipientTokenAccount;

  it('Initializes token mint and account', async () => {
    // Create mint
    mint = await createMint(connection, wallet.payer, wallet.publicKey, wallet.publicKey, 9);

    // Create associated token account for deployer
    userTokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet.payer, mint, wallet.publicKey);

    // Mint initial supply
    const totalSupply = 1_000_000_000 * 10 ** 9;
    await mintTo(connection, wallet.payer, mint, userTokenAccount.address, wallet.publicKey, totalSupply);

    const accountInfo = await getAccount(connection, userTokenAccount.address);
    console.log("Deployer balance:", accountInfo.amount.toString());
  });

  it('Transfers tokens between accounts', async () => {
    // Create recipient token account
    const recipient = anchor.web3.Keypair.generate();
    recipientTokenAccount = await getOrCreateAssociatedTokenAccount(connection, wallet.payer, mint, recipient.publicKey);

    // Transfer some tokens
    const amount = 1000 * 10 ** 9; // 1000 NOREN
    await transfer(
      connection,
      wallet.payer,
      userTokenAccount.address,
      recipientTokenAccount.address,
      wallet.publicKey,
      amount
    );

    const senderInfo = await getAccount(connection, userTokenAccount.address);
    const recipientInfo = await getAccount(connection, recipientTokenAccount.address);

    console.log("Sender balance after transfer:", senderInfo.amount.toString());
    console.log("Recipient balance:", recipientInfo.amount.toString());
  });
});
