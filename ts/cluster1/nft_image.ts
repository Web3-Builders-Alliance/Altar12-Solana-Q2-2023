import { Connection, Commitment, Keypair, clusterApiUrl } from '@solana/web3.js'
import wallet from '../wba-wallet.json'
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from '@metaplex-foundation/js'
import { readFile } from 'fs/promises'

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet))

const commitment: Commitment = 'confirmed'
const connection = new Connection(clusterApiUrl('devnet'), commitment)
const metaplex = Metaplex.make(connection)
                    .use(keypairIdentity(keypair))
                    .use(bundlrStorage({
                        address: 'https://devnet.bundlr.network',
                        providerUrl: clusterApiUrl('devnet'),
                        timeout: 60000
                    }));

(async () => {
    try {
        const image = await readFile('./images/generug.png')
        const file = toMetaplexFile(image, 'generug.png')
        const uri = await metaplex.storage().upload(file)
        console.log('Uri', uri)
    } catch (error) {
        console.log('Something went wrong', error)
    }
})()