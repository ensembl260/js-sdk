# js-sdk

WIP

# Installation

Update your package.json:

```json
{
    "dependencies": {
        "private-repo": "git+https://github.com/ma-residence/js-sdk.git"
    }
}
```

# Usage

To create an instance, simply provide an Object with your clientId, clientSecret and the API host:

```js
import MRClient from "mr-js-sdk";

const clientId = "MY_CLIENT_ID";
const clientSecret = "MY_CLIENT_SECRET";

const client = new MRClient({
    clientId: clientId,
    clientSecret: clientSecret
});
```

***NOTE:*** You can override the host URL if you need with `ApiUrl` argument.

If have you have already an access token, like this one:

```js
import Token from "mr-js-sdk/auth/Token";

const token = new Token({
    accessToken: myToken,        // string
    expiredAt: myExpirationDate, // Date
    refreshToken: myRefreshToken // string, optional
});
```

You can defined directly in the constructor:
```js
const client = new MRClient({
    // ...
    token: token
});
```
Or by a setter:
```js
client.auth.setToken(token);
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
    body: "some_data",
}).then(res => {
    // do your stuff
}).catch(err => {
    // handle error
});
```

Check to documentation to see what are available routes.
