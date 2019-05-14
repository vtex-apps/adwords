import { getSkuPrice } from './utils'

const adwordsId = window.__SETTINGS__.adwordsId

if (!adwordsId) {
  throw new Error('Warning: No Google Adwords ID is defined. To setup the app, go to your admin.')
}

const script = document.createElement('script')

script.src = `https://www.googletagmanager.com/gtag/js?id=${adwordsId}`
script.async = true

document.head!.prepend(script)

window.dataLayer = window.dataLayer || []

function gtag(...args: any[]) {
  window.dataLayer.push(args)
}

gtag('js', new Date())
gtag('config', adwordsId)

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
        'send_to': adwordsId,
        'ecomm_totalvalue': +productPrice,
        'ecomm_category': product.categories[0] || '',
      }
      console.log(productDetails)
      gtag(productDetails)
      return
    }

    case 'vtex:orderPlaced': {
      const conversionObject = {
        event: 'conversion',
        send_to: adwordsId,
        value: e.data.transactionTotal || 0,
        currency: e.data.transactionCurrency || 'BRL',
        transaction_id: e.data.transactionId || '',
      }
      console.log(conversionObject)
      gtag(conversionObject)
      return
    }

    default: {
      return
    }
  }
})
