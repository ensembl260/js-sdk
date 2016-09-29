import MRClient from "../src/mr-client";
import Token from "../src/auth/token";

import expect, { spyOn, restoreSpies } from "expect";

const clientId = "client_id";
const clientSecret = "client_secret";

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
});
