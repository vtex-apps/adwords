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
  debugger
  switch (e.data.eventName) {
    case 'vtex:productView': {
      const { product } = e.data
      const skuId = product.id || product.productId
      const productDetails = {
        ecomm_prodid: skuId,
        event: 'view_item',
        send_to: adwordsId,
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
