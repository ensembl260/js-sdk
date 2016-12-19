global.fetch = require("node-fetch");
global.Headers = require("node-fetch").Headers;
global.FormData = require("form-data");

global.client_id = "c4ee8504-80d2-11e6-8f1f-9be34f73e493_4g8j1az05u2o8gog4c8k0kksk800ws84ks0o48k88gosg4wg0k";
global.client_secret = "4fd07cend9c084w0owk844wc4o4okwwoogg8s4k0ksocwos08k";

const nock = require("nock");

nock.disableNetConnect();
const api = nock("http://api.ma-residence.fr");

api.persist()
    .post("/oauth/v2/token", {
        client_id: global.client_id,
        client_secret: global.client_secret,
        grant_type: "client_credentials",
    })
    .reply(200, {
        access_token: "Y2M5OTM5NTA0N2Q4MDU5ODA1NzJiYWRkOGUxYTAyZmRjMWZmMTZlNjg0OWNkNDM1M2Q3ZmM5ZDEwOWVjZmU5Yg",
        expires_in: 3600,
        token_type: "bearer",
        scope: null,
        refresh_token: null
    });

api.persist()
    .post("/oauth/v2/token", {
        client_id: global.client_id,
        client_secret: global.client_secret,
        grant_type: "password",
        username: "test@ma-residence.fr",
        password: "password"
    })
    .reply(200, {
        access_token: "Y2M5OTM5NTA0N2Q4MDU5ODA1NzJiYWRkOGUxYTAyZmRjMWZmMTZlNjg0OWNkNDM1M2Q3ZmM5ZDEwOWVjZmU5Yg",
        expires_in: 3600,
        token_type: "bearer",
        scope: null,
        refresh_token: "N2QwZjk5ZGU4Mzc5MDg0Njk2Y2YzOGY3N2M2OTdkYzk5NDQ2NDUyZjRkNjRlMGNmNmZhNGQ5YjA3Yzg5Yjg0Yg"
    });

api.persist()
    .post("/oauth/v2/token", {
        client_id: global.client_id,
        client_secret: global.client_secret,
        grant_type: "refresh_token",
        refresh_token: "N2QwZjk5ZGU4Mzc5MDg0Njk2Y2YzOGY3N2M2OTdkYzk5NDQ2NDUyZjRkNjRlMGNmNmZhNGQ5YjA3Yzg5Yjg0Yg",
    })
    .reply(200, {
        access_token: "new_token",
        expires_in: 3600,
        token_type: "bearer",
        scope: null,
        refresh_token: "new_refresh_token"
    });

api.get("/some/path")
    .reply(200, {
        foo: "bar",
    });

api.get("/me")
    .reply(200, {
        id: "c4ee8504-80d2-11e6-8f1f-9be34f73e493",
        name: "test test",
    });
