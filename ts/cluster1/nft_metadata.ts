import { Connection, Commitment, clusterApiUrl, Keypair } from '@solana/web3.js'
import wallet from '../wba-wallet.json'
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js'

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
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: 'Generug',
            symbol: 'GRG',
            description: 'An exotic rug',
            image: 'https://arweave.net/HZHvDIKvJGJPSggplY-16FhJ6ilQMv3DLkv193U9NWo',
            seller_fee_basis_points: 500,
            attributes: [
                {
                    trait_type: 'Primary Color',
                    value: 'Green'
                },
                {
                    trait_type: 'Pattern',
                    value: 'Dotted'
                },
                {
                    trait_type: 'Secondary Colors',
                    value: 'Violet-Brown-Black'
                }
            ],
            properties: {
                files: [
                    {
                        type: 'image/png',
                        uri: 'https://arweave.net/HZHvDIKvJGJPSggplY-16FhJ6ilQMv3DLkv193U9NWo'
                    }
                ],
                creators: [
                    {
                        address: keypair.publicKey.toBase58(),
                        share: 100
                    }
                ]
            }
        })
    console.log('Uri', uri)
    } catch (error) {
        console.log('Something went wrong', error)
    }
})()