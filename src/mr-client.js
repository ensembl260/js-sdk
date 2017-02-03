/* @flow */

declare var fetch: any;
declare var FileReader: any;

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
    _refreshRequest: ?Promise<any>;

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

        this._refreshRequest = null;

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
            query?: Object,
            body?: Object,
            auth?: boolean,
            json?: boolean
        }
    ):Promise<any> {
        this.event.emit(EVENT_PRE_REQUEST, this);

        let { method, query, body } = requestOptions;
        let headers = new Headers();
        const auth = (requestOptions.auth === undefined) ? true : requestOptions.auth;
        const json = (requestOptions.json === undefined) ? true : requestOptions.json;
        const token = this._token;

        if (auth && token) {
            if (token.isExpired() && token.refreshToken) {
                if (this._refreshRequest === undefined || this._refreshRequest === null) {
                    this._refreshRequest = this.auth.refreshAuthentication(token.refreshToken);
                }

                return this._refreshRequest.then(() => {
                    return this.request(url, requestOptions);
                });
            }

            headers.append("Authorization", `Bearer ${token.accessToken}`);
        }

        if (body) {
            if (json) {
                headers.append("Content-Type", "application/json");

                body = JSON.stringify({
                    data: body
                });
            } else {
                headers.append("Content-Type", "application/x-www-form-urlencoded");

                body = qsStringify(body);
            }
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

    upload(url: string, file: Blob, form?: Object):Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e.target.result);

            reader.readAsBinaryString(file);
        }).then(content => {
            return this.request(url, {
                method: "POST",
                body: Object.assign({}, form || {}, {
                    file: btoa(content)
                }),
            });
        });
    }
}
