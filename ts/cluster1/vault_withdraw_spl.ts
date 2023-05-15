// D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o

import { Connection, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { WbaVault, IDL } from "../programs/wba_vault";
import wallet from "../wba-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);
const mint = new PublicKey("783HDrZdxwnYQTnoKDYKaN16FMJoe4bifTrArxJyrnQu");

const vaultState = new PublicKey("5R3X3JsgYxxnEU8Ma3xKXGTqwt5CSPFW1dU7R1cnDHq9");
const [vaultAuth] = PublicKey.findProgramAddressSync([Buffer.from("auth"), vaultState.toBuffer()], program.programId);
const [vault] = PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultAuth.toBuffer()], program.programId);

// Execute our withdraw transaction
(async () => {
    try {
        const ownerAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        const vaultAta = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, vaultAuth, true);
        const txhash = await program.methods
        .withdrawSpl(new BN(0.1 * 10**6))
        .accounts({
            owner: keypair.publicKey,
            vaultState,
            vaultAuth,
            systemProgram: SystemProgram.programId,
            ownerAta: ownerAta.address,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([
            keypair
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();