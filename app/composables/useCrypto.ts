import CryptoJS from 'crypto-js'

const AES_SECRET = 'nuxt-pos-aes-secret-2026'

interface DecryptedCardData {
  cardNumber: string
  expirationDate: string
  cvv: string
}

export function useCrypto() {
  function encryptCardData(cardNumber: string, expirationDate: string, cvv: string): string {
    const data = JSON.stringify({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expirationDate,
      cvv
    })

    return CryptoJS.AES.encrypt(data, AES_SECRET).toString()
  }

  function decryptData(encryptedData: string): DecryptedCardData | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, AES_SECRET)
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch {
      return null
    }
  }

  return {
    encryptCardData,
    decryptData
  }
}
