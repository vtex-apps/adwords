# How to add to your Store

1 - Open the VTEX APP Store and install the app on your store.

2 - Add the following line to your store manifest:
>    
    "vtex.adwords": "0.x"

3 - Add the following code to your store pages.json:
>
    ...
    "templates": {
      "store": {
        ...
        "props": {
          "elements": [
            ...
            "pixel",
            ...
          ]
        },
        "extensions": {
          "pixel": {
            "component": "vtex.render-runtime/ExtensionContainer"
          },
          "pixel/adwords": {
            "component": "vtex.adwords/index"
          },
          ...
        }
      }
    }

See an example in [Dreamstore](https://github.com/vtex-apps/dreamstore/blob/master/pages/pages.json).