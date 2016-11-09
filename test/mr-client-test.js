import MRClient from "../src/mr-client";
import { EVENT_PRE_AUTH } from "../src/constants";
import Token from "../src/auth/token";

import expect, { spyOn, restoreSpies } from "expect";

const clientId = global.client_id;
const clientSecret = global.client_secret;

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
            const mrClient = new MRClient({
                clientId: clientId,
                clientSecret: clientSecret,
                token: {
                    accessToken: "access_token",
                    expiredAt: new Date()
                }
            });

            expect(mrClient._token).toBeAn(Token);
            expect(mrClient._token.accessToken).toBe("access_token");
        });
    });

    describe("auth", () => {
        const mrClient = new MRClient({
            clientId: clientId,
            clientSecret: clientSecret,
        });

        it("should set the token on the auth of MRClient instance", () => {
            mrClient.auth.setToken({
                accessToken: "access_token",
                expiredAt: new Date()
            });

            expect(mrClient._token).toBeAn(Token);
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

        it("should have the token in the MRClient instance", () => {
            mrClient.auth.setToken({
                accessToken: "access_token",
                expiredAt: new Date()
            });

            expect(mrClient.auth.getToken()).toBeAn(Token);
        });

        it("should unset the token in the MRClient instance", () => {
            mrClient.auth.setToken({
                accessToken: "access_token",
                expiredAt: new Date()
            });

            expect(mrClient._token).toBeAn(Token);

            mrClient.auth.logout();

            expect(mrClient._token).toBe(null);
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

                    done();
                });
            });
        });
    });

    describe("event", () => {
        const mrClient = new MRClient({
            clientId: clientId,
            clientSecret: clientSecret,
        });

        it("should add and remove a listener", () => {
            let listener = function () {};

            mrClient.event.addListener(EVENT_PRE_AUTH, listener);
            expect(mrClient.event.removeListener(EVENT_PRE_AUTH, listener)).toBe(true);
        });

        it("should triggered an event", (done) => {
            let listener = function () {
                done();
            };

            mrClient.event.addListener(EVENT_PRE_AUTH, listener);
            mrClient.event.emit(EVENT_PRE_AUTH);
        });
    });
});
