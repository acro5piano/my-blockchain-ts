import { proofOfWork, getDigestHex } from './proof-of-work'

describe('proofOfWork', () => {
  it('can mine valid proof', async () => {
    const lastProof = 100
    const verifiedProof = await proofOfWork(lastProof)
    const hashFromProofs = getDigestHex(`${lastProof}${verifiedProof}`)

    expect(hashFromProofs.slice(-3)).toEqual('000')
  })
})
