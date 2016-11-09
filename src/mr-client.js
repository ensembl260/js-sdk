/* @flow */

declare var fetch: any;

import {
    API_URL,
    EVENT_PRE_REQUEST
} from "./constants";
import auth from "./auth/auth";
import event from "./event";
import Token from "./auth/token";
import { stringify as qsStringify } from "querystring";

export default class MRClient {
    _apiUrl: string;

    _clientId: string;
    _clientSecret: string;

    _token: ?Token;

    auth: Object;
    event: Object;

    constructor(
        options: {
            apiUrl: string,
            clientId: string,
            clientSecret: string,
            token?: {
                accessToken: string,
                expiredAt: Date,
                refreshToken?: string
            }
        }
    ) {
        this._apiUrl = options.apiUrl || API_URL;
        this._clientId = options.clientId;
        this._clientSecret = options.clientSecret;

        this.auth = auth.bind(this)();
        this.event = event.bind(this)();
        this.event.listeners = new Map();

        if (options.token) {
            this.auth.setToken(options.token);
        }
    }

    request(
        url: string,
        requestOptions: {
            method: string,
            query: Object,
            body: Object,
            auth?: boolean
        }
    ):Promise<any> {
        this.event.emit(EVENT_PRE_REQUEST, this);

        let { method, query, body } = requestOptions;
        let headers = {};
        const auth = requestOptions.auth || true;
        const token = this._token;

        if (auth && token) {
            if (token.isExpired() && token.refreshToken) {
                return this.auth.refreshAuthentication(token.refreshToken)
                    .then(() => {
                        return this.request(url, requestOptions);
                    });
            }

            headers["Authorization"] = `Bearer ${token.accessToken}`;
        }

        if (body) {
            headers["Content-Type"] = "application/json";

            body = JSON.stringify({
                data: body
            });
        }

        if (query) {
            url = decodeURIComponent(`${url}?${qsStringify(query)}`);
        }

        return fetch(`${this._apiUrl}${url}`, {
            method,
            headers,
            body: (method !== "GET") && body ? body : undefined
        });
    }
}
