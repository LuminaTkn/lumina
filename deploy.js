const anchor = require('@coral-xyz/anchor');
const { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

async function main() {
  // Set up provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const connection = provider.connection;
  const wallet = provider.wallet;

  console.log("Deploying Lumina Token...");

  // Create the token mint (Lumina)
  const decimals = 9; // Standard Solana token decimals
  const mint = await createMint(
    connection,
    wallet.payer,
    wallet.publicKey, // Mint authority
    wallet.publicKey, // Freeze authority
    decimals
  );

  console.log("Token mint created:", mint.toBase58());

  // Create the user's associated token account
  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet.payer,
    mint,
    wallet.publicKey
  );

  console.log("User token account:", userTokenAccount.address.toBase58());

  // Mint initial supply
  const totalSupply = 1_000_000_000 * 10 ** decimals; // 1 billion Lumina
  await mintTo(
    connection,
    wallet.payer,
    mint,
    userTokenAccount.address,
    wallet.publicKey,
    totalSupply
  );

  console.log(`Minted ${totalSupply / 10 ** decimals} Lumina to ${userTokenAccount.address.toBase58()}`);

  console.log("Deployment finished.");
}

main().catch(err => {
  console.error(err);
});
