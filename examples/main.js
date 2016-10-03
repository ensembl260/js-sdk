console.log(MRClient);

var mrClient = new MRClient.default({
    clientId: "{YOUR_CLIENT_ID}",
    clientSecret: "{YOUR_CLIENT_SECRET}",
});

console.log(mrClient);

var token = mrClient.auth.setToken({
    accessToken: "klfgkdj",
    expiredAt: new Date(),
    refreshToken: "fdmllkf"
});

console.log(token);
