import { describe, it, expect } from 'vitest'

describe('Smoke Test', () => {
  it('should pass if test infrastructure is working', () => {
    expect(true).toBe(true)
  })

  it('should be able to perform basic math', () => {
    expect(1 + 1).toBe(2)
  })
})
