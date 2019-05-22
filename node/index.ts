
import { Apps, ServiceContext } from '@vtex/api'
import { mapObjIndexed } from 'ramda'
import * as url from 'url'
import { vendor, name, version } from '../manifest.json'

const prepare = (resolver: any) => async (ctx: ServiceContext) => {
    try {
      return resolver(ctx) 
    } catch (e) {
      console.error(e)
      if (e.response) {
        const errorDetails = e.response.config
          ? { method: e.response.config.method, url: e.response.config.url, data: e.response.data }
          : { status: e.response.status, data: e.response.data }
        console.log('error on prepare resources', 'error', errorDetails)
      } else {
        console.log('error on prepare resources', 'error', e)
      }
      throw e
    }
}

const parseQuery = (req: any) => {
    const urlParts = url.parse(req.url, true)
    const query = urlParts.query
    return query
}

const parseVersion = () => {
    return version.slice(0,2) + 'x'
}

export default {
    routes: mapObjIndexed(prepare, {
        saveSettings: async ( ctx: ServiceContext ) => {
            const { vtex: ioContext, request: req, response: res } = ctx
            const query = parseQuery(req)
            const versionX = parseVersion()
            console.log(query)
            if(!("conversionId" in query)) {
                res.status = 500
                throw new Error("Conversion Id not sent in parameters")
            }
            const appsClient = new Apps(ioContext)
            try {
            await appsClient.saveAppSettings(`${vendor}.${name}@${versionX}`, query)
            res.body = { message: "GRACAS AOS DEUSES DA INFRA E AO PIMENTEL FUNCIONOU" }
            res.status = 200
            return res
            } catch ( err ) {
                console.log(err)
                throw err
            }
        }
    })
}