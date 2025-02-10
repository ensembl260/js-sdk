/* @flow */

export default class Token {
    accessToken: string;
    refreshToken: ?string;
    expiredAt: Date;

    constructor(
        options: {
            accessToken: string,
            expiredAt: Date,
            refreshToken?: string
        }
    ) {
        this.accessToken = options.accessToken;
        this.refreshToken = options.refreshToken;
        this.expiredAt = options.expiredAt;
    }

    isExpired(): boolean {
        return this.expiredAt < Date.now();
    }
}
