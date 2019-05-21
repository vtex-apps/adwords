// import { path } from 'ramda'

export const getSkuPrice = (product: any, skuId: string) => {
    const selectedItem = product.items.find((item: any) => item.itemId === skuId)
    // const commertialOffer: any = path(['sellers', 0, 'commertialOffer'], selectedItem)
    const commertialOffer = selectedItem.sellers[0].commertialOffer
    return commertialOffer ? commertialOffer.PriceWithoutDiscount || commertialOffer.Price || commertialOffer.ListPrice || null : null
}