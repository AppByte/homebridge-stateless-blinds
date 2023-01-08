# homebridge-stateless-blinds

A homebridge plugin for controlling blinds which don't have any position control feature.


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
