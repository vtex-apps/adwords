import { path } from 'ramda'

export const getSkuPrice = (product: any, skuId: string) => {
    const selectedItem = product.items.find((item: any) => item.itemId === skuId)
    const commertialOffer: any = path(['sellers', 0, 'commertialOffer'], selectedItem)
    return commertialOffer ? commertialOffer.Price || commertialOffer.ListPrice || commertialOffer.PriceWithoutDiscount || null : null
}