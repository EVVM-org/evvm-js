import { describe, it, expect, beforeEach } from 'bun:test'
import { P2PSwap } from '../src/services/p2pswap'

class FakeSigner {
  address = '0x1111111111111111111111111111111111111111'
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
let svc: P2PSwap

beforeEach(() => {
  signer = new FakeSigner()
  svc = new P2PSwap(signer, '0xP2PSWAPADDRESS000000000000000000000000')
})

describe('P2PSwap service', () => {
  it('makeOrder returns SignedAction with expected data', async () => {
    const evvmSignedAction = { data: { priorityFee: 0n, nonce: 1n, priorityFlag: false, signature: 'esig' } } as any
    const r = await svc.makeOrder({
      nonce: 1n,
      tokenA: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      tokenB: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      amountA: 100n,
      amountB: 90n,
      evvmSignedAction,
    } as any)

    expect(r.functionName).toBe('makeOrder')
    expect(r.data.user).toBe(signer.address)
    expect(typeof r.data.metadata).toBe('object')
    expect(r.data.metadata.nonce).toBe(1n)
    expect(typeof r.data._signature_Evvm).toBe('string')
  })

  it('cancelOrder returns SignedAction with expected fields', async () => {
    const r = await svc.cancelOrder({ nonce: 2n, tokenA: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tokenB: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', orderId: 1n } as any)
    expect(r.functionName).toBe('cancelOrder')
    expect(r.data.user).toBe(signer.address)
  })

  it('dispatchOrder fill proportional fee includes metadata and evvm signature', async () => {
    const evvmSignedAction = { data: { priorityFee: 0n, nonce: 2n, priorityFlag: true, signature: 'esig2' } } as any
    const r = await svc.dispatchOrder_fillPropotionalFee({
      nonce: 3n,
      tokenA: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      tokenB: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      orderId: 1n,
      amountOfTokenBToFill: 50n,
      evvmSignedAction,
    } as any)

    expect(r.functionName).toBe('dispatchOrder_fillPropotionalFee')
    expect(r.data.user).toBe(signer.address)
    expect(typeof r.data._signature_Evvm).toBe('string')
  })

  it('dispatchOrder fill fixed fee includes maxFillFixedFee when present', async () => {
    const evvmSignedAction = { data: { priorityFee: 0n, nonce: 3n, priorityFlag: false, signature: 'esig3' } } as any
    const r = await svc.dispatchOrder_fillFixedFee({
      nonce: 4n,
      tokenA: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      tokenB: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      orderId: 2n,
      amountOfTokenBToFill: 10n,
      maxFillFixedFee: 5n,
      evvmSignedAction,
    } as any)

    expect(r.functionName).toBe('dispatchOrder_fillFixedFee')
    expect(r.data.maxFillFixedFee).toBeDefined()
    expect(typeof r.data._signature_Evvm).toBe('string')
  })
})
