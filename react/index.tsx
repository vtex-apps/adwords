import { getSkuPrice } from './utils'

const conversionId = window.__SETTINGS__.conversionId
const conversionLabel = window.__SETTINGS__.conversionLabel

if (!conversionId) {
  throw new Error('Warning: No Google Adwords ID is defined. To setup the app, go to your admin.')
}

const script = document.createElement('script')

script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`
script.async = true

document.head!.prepend(script)

window.dataLayer = window.dataLayer || []

function gtag(...args: any[]) {
  window.dataLayer.push(args)
}

gtag('js', new Date())
gtag('config', conversionId)

window.addEventListener('message', e => {
  switch (e.data.eventName) {
    case 'vtex:productView': {
      const { product } = e.data
      const productId = product.id || product.productId
      const skuId = product.selectedSku || null
      const productPrice = skuId ? getSkuPrice(product, skuId) : null
      const productDetails = {
        'ecomm_prodid': skuId ? `${productId}_${skuId}`: productId,
        'ecomm_pagetype': 'product',
        'send_to': conversionId,
        'ecomm_totalvalue': +productPrice,
        'ecomm_category': product.categories[0] || '',
      }
      gtag(productDetails)
      return
    }

    case 'vtex:orderPlaced': {
      const conversionObject = {
        event: 'conversion',
        send_to: conversionLabel ? `${conversionId}/${conversionLabel}`: conversionId,
        value: e.data.transactionTotal || 0,
        currency: e.data.transactionCurrency || 'BRL',
        transaction_id: e.data.transactionId || '',
      }
      gtag(conversionObject)
      return
    }

    default: {
      return
    }
  }
})
