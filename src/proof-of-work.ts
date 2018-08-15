import forge from 'node-forge'

/*
 * Get sha256 Digest string.
 */
export const getDigestHex = (normalString: string): string => {
  const md = forge.md.sha256.create()
  md.update(normalString)
  return md.digest().toHex()
}

/*
 * Get a new valid proof.
 */
export const proofOfWork = (lastProof: number, proofCandidate: number = 0): Promise<number> => {
  return new Promise(resolve => {
    if (verifyProof(lastProof, proofCandidate)) {
      return resolve(proofCandidate)
    } else {
      return process.nextTick(() => {
        resolve(proofOfWork(lastProof, proofCandidate + 1))
      })
    }
  })
}

/*
 * Verify a new proof.
 */
export const verifyProof = (lastProof: number, proofCandidate: number) => {
  const guess = `${lastProof}${proofCandidate}`
  const guessHash = getDigestHex(guess)

  return guessHash.slice(-3) === '000'
}
