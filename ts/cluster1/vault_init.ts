// D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o

import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@project-serum/anchor"
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

const vaultStateKP = Keypair.generate();
console.log(`VaultState publickey: ${vaultStateKP.publicKey.toBase58()}`);
const [vaultAuth] = PublicKey.findProgramAddressSync([Buffer.from("auth"), vaultStateKP.publicKey.toBuffer()], program.programId);
const [vault] = PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultAuth.toBuffer()], program.programId);

// Execute our init transaction
(async () => {
    try {
        const txhash = await program.methods
        .initialize()
        .accounts({
            owner: keypair.publicKey,
            vaultState: vaultStateKP.publicKey,
            vaultAuth,
            vault,
            systemProgram: SystemProgram.programId,
        })
        .signers([
            keypair,
            vaultStateKP,
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();