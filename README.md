# js-sdk

A SDK for ma-residence API in Javascript.

# Installation

Update your bower.json:

```json
{
    "dependencies": {
        "mr-js-sdk": "git@github.com:ma-residence/js-sdk.git"
    }
}
```

# Usage

To create an instance, simply provide an Object with your clientId, clientSecret and the API host:

```js
const clientId = "MY_CLIENT_ID";
const clientSecret = "MY_CLIENT_SECRET";

const client = new MRClient.default({
    clientId: clientId,
    clientSecret: clientSecret
});
```

***NOTE:*** You can override the host URL if you need with `ApiUrl` argument.

If have you have already an access token, you can defined directly in the constructor:
```js
const client = new MRClient.default({
    // ...
    token: {
        accessToken: myToken,        // string
        expiredAt: myExpirationDate, // Date
        refreshToken: myRefreshToken // string, optional
    }
});
```
Or by a setter:
```js
client.auth.setToken({
    accessToken: myToken,        // string
    expiredAt: myExpirationDate, // Date
    refreshToken: myRefreshToken // string, optional
});
```

## Authentication

There is 3 ways to be authenticated with the API.

For an user by his email and password:

```js
client.auth.userAuthentication({
    email: "foo@bar.com",
    password: "password"
});
```

With external service (like facebook):

```js
client.auth.userAuthentication({
    service: "facebook",
    token: "facebook_access_token"
});
```

Or if you need to be authenticated anonymously:

```js
client.auth.applicationAuthentication();
```

## Request data

```js
client.request("/foo", {
    method: "GET",
    query: {
        foo: "foo"
    },
    body: {
        foo: "foo"
    },
}).then(function(response) {
    // Here you can check the response status, etc.
    // And we return the deserialize content
    return response.json();
}).then(function(payload) {
    // A payload object contains the data, errors and metadata    
}).catch(function(err) {
    // catch error exception during the promise
});
```

Check [API documentation](http://doc.ma-residence.fr) to see all available routes.

## Event listener

The client triggered several events so you can register some callbacks to them:

```js
client.event.addListener(MRClient.default.EVENT_PRE_REQUEST, function (client) {
    // Do your stuff
});
```

Available events:

|              Constant              |    Event    |
|                 ---                |     ---     |
| MRClient.default.EVENT_PRE_REQUEST | pre_request |
| MRClient.default.EVENT_PRE_AUTH    |  pre_auth   |
| MRClient.default.EVENT_POST_AUTH   |  post_auth  |
| MRClient.default.EVENT_FAIL_AUTH   |  fail_auth  |
