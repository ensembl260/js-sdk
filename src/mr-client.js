/* @flow */

declare var fetch: any;

import { API_URL } from "./constants";
import auth from "./auth/auth";
import Token from "./auth/token";
import { stringify as qsStringify } from "querystring";

export default class MRClient {
    _apiUrl: string;

    _clientId: string;
    _clientSecret: string;

    _token: ?Token;

    auth: Object;

    constructor(
        options: {
            apiUrl: string,
            clientId: string,
            clientSecret: string,
            token?: Token
        }
    ) {
        this._apiUrl = options.apiUrl || API_URL;
        this._clientId = options.clientId;
        this._clientSecret = options.clientSecret;
        this._token = options.token;

        this.auth = auth.bind(this)();
    }

    request(
        url: string,
        requestOptions: {
            method: string,
            query: Object,
            headers: Object,
            body: Object,
            auth?: boolean
        }
    ):Promise<any> {
        const auth = requestOptions.auth || true;
        const token = this._token;

        if (auth && token) {
            if (token.isExpired() && token.refreshToken) {
                this.auth.refreshAuthentication(token.refreshToken)
                    .then(() => {
                        return this.request(url, requestOptions);
                    })
                    .catch(() => {
                        // TODO
                    });
            }
            requestOptions.headers["Authorization"] = `Bearer ${token.accessToken}`;
        }

        if (requestOptions.body) {
            requestOptions.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        if (requestOptions.query) {
            url = decodeURIComponent(`${url}?${qsStringify(requestOptions.query)}`);
        }

        return fetch(url, requestOptions);
    }
}
