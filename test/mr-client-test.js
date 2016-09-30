import MRClient from "../src/mr-client";
import Token from "../src/auth/token";

import expect, { spyOn, restoreSpies } from "expect";

const clientId = "c4ee8504-80d2-11e6-8f1f-9be34f73e493_4g8j1az05u2o8gog4c8k0kksk800ws84ks0o48k88gosg4wg0k";
const clientSecret = "4fd07cend9c084w0owk844wc4o4okwwoogg8s4k0ksocwos08k";

describe("MRClient", () => {

    describe("constructor", () => {
        const mrClient = new MRClient({
            clientId: clientId,
            clientSecret: clientSecret,
        });

        it("should successfully construct an MRClient instance", () => {
            expect(mrClient).toBeAn(MRClient);
        });

        it("should set an apiUrl on the MRClient instance", () => {
            expect(mrClient._apiUrl).toBe("http://api.ma-residence.fr");
        });

        it("should set the clientId argument on the MRClient instance", () => {
            expect(mrClient._clientId).toBe(clientId);
        });

        it("should set the clientSecret argument on the MRClient instance", () => {
            expect(mrClient._clientSecret).toBe(clientSecret);
        });

        it("should have an auth method", () => {
            expect(mrClient.auth).toExist();
        });

        it("should overwrite the api url", () => {
            const apiUrl = "http://foo.com";
            const mrClient = new MRClient({
                clientId: clientId,
                clientSecret: clientSecret,
                apiUrl: apiUrl
            });

            expect(mrClient._apiUrl).toBe(apiUrl);
        });

        it("should set the token argument on the auth of MRClient instance", () => {
            const token = new Token({
                accessToken: "access_token",
                expiredAt: new Date()
            });
            const mrClient = new MRClient({
                clientId: clientId,
                clientSecret: clientSecret,
                token: token
            });

            expect(mrClient._token).toBe(token);
        });
    });

    describe("auth", () => {
        const mrClient = new MRClient({
            clientId: clientId,
            clientSecret: clientSecret,
        });

        it("should set the token on the auth of MRClient instance", () => {
            const token = new Token({
                accessToken: "access_token",
                expiredAt: new Date()
            });

            mrClient.auth.setToken(token);

            expect(mrClient._token).toBe(token);
        });

        it("should set a new token as an app", (done) => {
            mrClient.auth.applicationAuthentication()
                .then(token => {
                    expect(token).toBeAn(Token);
                    expect(token.accessToken).toExist();
                    expect(token.isExpired()).toBe(false);
                    expect(mrClient.auth.isAuthenticated()).toBe(true);
                    done();
                });
        });

        it("should set a new token as an user", (done) => {
            mrClient.auth.userAuthentication({
                email: "user.a@ma-residence.fr",
                password: "password"
            }).then(token => {
                expect(token).toBeAn(Token);
                expect(token.accessToken).toExist();
                expect(token.refreshToken).toExist();
                expect(token.isExpired()).toBe(false);
                expect(mrClient.auth.isAuthenticated()).toBe(true);
                done();
            });
        });
    });


    describe("request", () => {
        const mrClient = new MRClient({
            clientId: clientId,
            clientSecret: clientSecret,
        });

        it("should set a new token as an user", (done) => {
            mrClient.auth.userAuthentication({
                email: "user.a@ma-residence.fr",
                password: "password"
            }).then(() => {
                expect(mrClient.auth.isAuthenticated()).toBe(true);

                mrClient.request("/me", {
                    method: "GET"
                }).then(response => {
                    expect(response.status).toBe(200);
                });

                done();
            });
        });
    });
});
