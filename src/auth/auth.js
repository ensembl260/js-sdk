/* @flow */

import {
    OAUTH_TOKEN_URL,
    OAUTH_GRANT_CLIENT_CREDENTIALS,
    OAUTH_GRANT_REFRESH_TOKEN,
    OAUTH_GRANT_PASSWORD,
    OAUTH_GRANT_EXTERNAL
} from "../constants";

export default function auth(): Object {
    return {
        applicationAuthentication: () => {
            return this.request(OAUTH_TOKEN_URL, {
                method: "GET",
                query: {
                    client_id: this._clientId,
                    client_secret: this._clientSecret,
                    grant_type: OAUTH_GRANT_CLIENT_CREDENTIALS
                }
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

            return this.request(OAUTH_TOKEN_URL, {
                method: "GET",
                query: query
            });
        },

        refreshAuthentication: (refreshToken) => {
            return this.request(OAUTH_TOKEN_URL, {
                method: "GET",
                query: {
                    client_id: this._clientId,
                    client_secret: this._clientSecret,
                    grant_type: OAUTH_GRANT_REFRESH_TOKEN,
                    refresh_token: refreshToken
                }
            });
        },

        isAuthenticated: () => {
            return this._token && !this._token.isExpired();
        }
    };
}
