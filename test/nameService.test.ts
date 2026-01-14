import { describe, it, expect, beforeEach } from 'bun:test'
import { NameService } from '../src/services/nameService'

class FakeSigner {
  address = '0x2222222222222222222222222222222222222222'
  chainId = 1
  async signMessage(message: string) {
    return `signed(${message})`
  }
  async readContract({ abi, address, functionName }: any) {
    if (functionName === 'getEvvmID') return 777n
    return null
  }
}

let signer: any
let svc: NameService

beforeEach(() => {
  signer = new FakeSigner()
  svc = new NameService(signer, '0xNAMESERVICEADDRESS0000000000000000000')
})

describe('NameService service', () => {
  it('makeOffer builds SignedAction correctly', async () => {
    const r = await svc.makeOffer({
      username: 'alice',
      expireDate: 1710000000n,
      amount: 100n,
      nonce: 1n,
      user: signer.address,
    } as any)

    expect(r.functionName).toBe('makeOffer')
    expect(r.data.user).toBe(signer.address)
    expect(r.data.username).toBe('alice')
  })

  it('withdrawOffer builds SignedAction', async () => {
    const r = await svc.withdrawOffer({ username: 'alice', offerID: 1n, nonce: 2n, user: signer.address } as any)
    expect(r.functionName).toBe('withdrawOffer')
    expect(r.data.user).toBe(signer.address)
  })

  it('registrationUsername & preRegistrationUsername produce SignedAction', async () => {
    const pre = await svc.preRegistrationUsername({ hashPreRegisteredUsername: '0xdeadbeef', nonce: 3n, user: signer.address } as any)
    expect(pre.functionName).toBe('preRegistrationUsername')

    const r = await svc.registrationUsername({ username: 'alice', clowNumber: 1n, nonce: 4n, user: signer.address } as any)
    expect(r.functionName).toBe('registrationUsername')
    expect(r.data.username).toBe('alice')
  })

  it('custom metadata operations return SignedAction', async () => {
    const add = await svc.addCustomMetadata({ identity: 'bob', value: 'x', nonce: 5n, user: signer.address } as any)
    expect(add.functionName).toBe('addCustomMetadata')

    const remove = await svc.removeCustomMetadata({ identity: 'bob', key: 0n, nonce: 6n, user: signer.address } as any)
    expect(remove.functionName).toBe('removeCustomMetadata')

    const flush = await svc.flushCustomMetadata({ identity: 'bob', nonce: 7n, user: signer.address } as any)
    expect(flush.functionName).toBe('flushCustomMetadata')
  })
})
