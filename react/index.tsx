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
      const categories = (product.categories[0] || '').slice(1,-1).split('/').join(' | ')
      const productDetails = {
        'send_to': conversionId,
        'ecomm_prodid': skuId ? `${productId}_${skuId}`: productId,
        'ecomm_pagetype': 'product',
        'ecomm_totalvalue': +productPrice,
        'ecomm_category': categories,
      }
      console.log(productDetails)
      script.onload = () => gtag('event', 'pageView', productDetails)
      return
    }

    case 'vtex:orderPlaced': {
      const conversionObject = {
        send_to: conversionLabel ? `${conversionId}/${conversionLabel}`: conversionId,
        value: e.data.transactionTotal || 0,
        currency: e.data.transactionCurrency || 'BRL',
        transaction_id: e.data.transactionId || '',
      }
      script.onload = () => gtag('event', 'conversion', conversionObject)
      return
    }

    default: {
      return
    }
  }
})
