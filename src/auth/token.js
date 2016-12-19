/* @flow */

export default class Token {
    accessToken: string;
    refreshToken: ?string;
    _expiredAt: Date;

    constructor(
        options: {
            accessToken: string,
            expiredAt: Date,
            refreshToken?: string
        }
    ) {
        this.accessToken = options.accessToken;
        this.refreshToken = options.refreshToken;
        this._expiredAt = options.expiredAt;
    }

    isExpired(): boolean {
        return this._expiredAt < Date.now();
    }
}
