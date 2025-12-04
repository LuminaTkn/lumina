const anchor = require('@coral-xyz/anchor');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NorenToken;
  console.log('Deploying Noren Token...');
  // Deployment logic here
}

main().then(() => console.log('Deployment finished.'));
