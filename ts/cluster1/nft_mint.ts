import { Connection, Commitment, Keypair, clusterApiUrl } from '@solana/web3.js'
import wallet from '../wba-wallet.json'
import { Metaplex, bundlrStorage, keypairIdentity } from '@metaplex-foundation/js'

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
        const { nft } = await metaplex.nfts()
                                    .create({
                                        name: 'Generug',
                                        symbol: 'GRG',
                                        uri: 'https://arweave.net/MnHS_PJliVhrVkCk1ND-2ng68z7TIFvxV2cSc8j4BcE',
                                        sellerFeeBasisPoints: 500,
                                        isMutable: true
                                    })
        console.log('NFT address:', nft.address.toBase58())
    } catch (error) {
        console.log('Something went wrong', error)
    }
})()