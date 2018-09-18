import { Component } from 'react'

import { Helmet } from 'render'

import { Pixel } from 'vtex.store/PixelContext'

const APP_LOCATOR = 'vtex.adwords'

class Adwords extends Component {
  constructor(props) {
    super(props)
    this.props.subscribe(this)
  }
  
  gtag(data) {
    dataLayer.push(data)
  }
  
  get adwordsID() {
    const { adwordsID } = this.context.getSettings(APP_LOCATOR) || {} 
    if (!adwordsID) {
      console.warn("Warning: The Google Adwords ID isn't set on your environment.")
    }
    return adwordsID 
  }

  productView = event => {
    const { products } = event
    if (products && products.length > 0) {
      const skuId = event.products[0].id
      this.gtag({
        event: 'page_view',
        send_to: this.adwordsID,
        ecomm_prodid: skuId
      })
    }
  }

  departmentView = event => {
    console.log(">>> Adwords >>> Department View: ", event)
  }

  componentDidMount() {
    window.dataLayer = window.dataLayer || []
    this.gtag({js: new Date()})
    this.gtag({config: this.adwordsID})
  }

  render() {
    return (
      <Helmet>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${this.adwordsID}`} />
      </Helmet>
    )
  }
}

Adwords.contextTypes = {
  getSettings: PropTypes.func,
  context: PropTypes.object,
}

export default Pixel(Adwords)