/* @flow */

import {
    OAUTH_TOKEN_URL,
    OAUTH_GRANT_CLIENT_CREDENTIALS,
    OAUTH_GRANT_REFRESH_TOKEN,
    OAUTH_GRANT_PASSWORD,
    OAUTH_GRANT_EXTERNAL
} from "../constants";
import Token from "./token";

export default function auth(): Object {
    return {
        applicationAuthentication: () => {
            return this.auth._requestToken({
                client_id: this._clientId,
                client_secret: this._clientSecret,
                grant_type: OAUTH_GRANT_CLIENT_CREDENTIALS
            });
        },

        userAuthentication: (
            credentials: {
                email?: string,
                password?: string,
                token?: string,
                service?: string,
            }
        ) => {
            var query = {
                client_id: this._clientId,
                client_secret: this._clientSecret
            };

            if (credentials.email && credentials.password) {
                query = Object.assign({}, query, {
                    username: credentials.email,
                    password: credentials.password,
                    grant_type: OAUTH_GRANT_PASSWORD
                });
            } else if (credentials.token && credentials.service) {
                query = Object.assign({}, query, {
                    username: credentials.token,
                    password: credentials.service,
                    grant_type: OAUTH_GRANT_EXTERNAL
                });
            } else {
                throw Error("You must specify (email, password) OR (token, service).");
            }

            return this.auth._requestToken(query);
        },

        refreshAuthentication: (refreshToken) => {
            return this.auth._requestToken({
                client_id: this._clientId,
                client_secret: this._clientSecret,
                grant_type: OAUTH_GRANT_REFRESH_TOKEN,
                refresh_token: refreshToken
            });
        },

        _requestToken: (query: Object) => {
            return this.request(OAUTH_TOKEN_URL, {
                method: "GET",
                query: query,
                auth: false
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                }

                throw Error("Authentication fail!");
            }).then(json => {
                const expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() + json.expires_in);
                const token = new Token({
                    accessToken: json.access_token,
                    refreshToken: json.refresh_token || null,
                    expiredAt: expiredAt,
                });

                this.auth.setToken(token);

                return token;
            });
        },

        isAuthenticated: () => {
            return this._token && !this._token.isExpired();
        },

        logout: () => {
            this._token = null;
        },

        setToken: (token: {
            accessToken: string,
            expiredAt: Date,
            refreshToken?: string
        }) => {
            this._token = new Token({
                accessToken: token.accessToken,
                expiredAt: token.expiredAt,
                refreshToken: token.refreshToken
            });

            return this._token;
        }
    };
}
