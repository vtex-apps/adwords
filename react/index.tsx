import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Helmet } from 'render'
import { Pixel } from 'vtex.store/PixelContext'

const APP_LOCATOR = 'vtex.google-adwords'

interface Props {
  subscribe: (s: any) => () => void
}

/**
 * Component that encapsulate the communication to
 * the GoogleAdwords and listen for events comming
 * from the store through the Pixel HOC. 
 * It injects the gtag script to the HTML Head.
 */
class GoogleAdwords extends Component<Props> {
  public static contextTypes = {
    /** Function to bind the APP Settings. */
    getSettings: PropTypes.func,
  }

  private unsubscribe: () => void

  constructor(props: Props) {
    super(props)
    this.unsubscribe = this.props.subscribe(this)
  }

  public gtag(data: any) {
    window.dataLayer.push(data)
  }
  
  get adwordsID() {
    const { adwordsID } = this.context.getSettings(APP_LOCATOR) || { adwordsID: undefined } 

    return adwordsID 
  }

  public productView = (event: any) => {
    const { products } = event
    let skuId = null
    if (products && products.length > 0) {
      skuId = products[0].id
    }
    this.gtag({
      ecomm_prodid: skuId,
      event: 'view_item',
      send_to: this.adwordsID,
    })
  }

  public componentDidMount() {
    if (!this.adwordsID) {
      console.warn('Warning: The Google Adwords ID isn\'t set on your environment.')
    }

    window.dataLayer = window.dataLayer || []
    this.gtag({js: new Date()})
    this.gtag({config: this.adwordsID})
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  public render() {
    return (
      <Helmet>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${this.adwordsID}`} />
      </Helmet>
    )
  }
}

export default Pixel(GoogleAdwords)
