import { Commitment, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define our Mint address
const mint = new PublicKey("783HDrZdxwnYQTnoKDYKaN16FMJoe4bifTrArxJyrnQu")

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBuffer(),
    mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

(async () => {
    try {
        // Start here
        const [metadata_pda] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);
        const transaction = new Transaction()
                                .add(
                                    createCreateMetadataAccountV3Instruction({
                                        metadata: metadata_pda,
                                        mint,
                                        mintAuthority: keypair.publicKey,
                                        payer: keypair.publicKey,
                                        updateAuthority: keypair.publicKey
                                    },
                                    {
                                        createMetadataAccountArgsV3: {
                                            data: {
                                                name: 'Altar Coin',
                                                symbol: 'ALT',
                                                uri: '',
                                                sellerFeeBasisPoints: 0,
                                                creators: [{
                                                    address: keypair.publicKey,
                                                    verified: true,
                                                    share: 100
                                                }],
                                                collection: null,
                                                uses: null,
                                            },
                                            isMutable: true,
                                            collectionDetails: null,
                                        }
                                    })
                                );
        const tx = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();