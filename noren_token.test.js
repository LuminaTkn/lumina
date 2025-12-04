const anchor = require('@coral-xyz/anchor');
const { SystemProgram } = anchor.web3;

describe('noren_token', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NorenToken;

  it('Initializes token', async () => {
    const mint = anchor.web3.Keypair.generate();
    const userToken = anchor.web3.Keypair.generate();

    await program.rpc.initialize(new anchor.BN(1000000000), {
      accounts: {
        mint: mint.publicKey,
        userTokenAccount: userToken.publicKey,
        authority: provider.wallet.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId
      },
      signers: [mint]
    });
  });
});
