# homebridge-stateless-blinds
***
[![npm version](https://badge.fury.io/js/homebridge-stateless-blinds.svg)](https://badge.fury.io/js/homebridge-stateless-blinds)

A homebridge plugin for controlling http blinds which don't have any position control feature.


### Example configuration
***

Add the following example config to the list of your accessories in your homebridge config.json file. Replace the request options with suitable values for your blinds.  It should look like as follows:

```
...

"accessories": [
    {
        "accessory": "StatelessBlinds",
        "name": "Diningroom blind",
        "up": {
            "name": "Up",
            "active": false,
            "request": {
                "url": "http://x.x.x.x/",
                "method": "POST",
                "headers": {},
                "body": {}
            }
        },
        "down": {
            "name": "Down",
            "active": false,
            "request": {
                "url": "http://x.x.x.x/",
                "method": "POST",
                "headers": {},
                "body": {}
            }
        },
        "stop": {
            "request": {
                "url": "http://x.x.x.x/",
                "method": "POST",
                "headers": {},
                "body": {}
            }
        }
    }
],

...
```

### Support this project
***
If you like my project or need help using this project just open an issue on Github. If you get some profit from this or just want to encourage me to continue on this project, there are few ways you can do it:

* Starring and sharing 🚀

