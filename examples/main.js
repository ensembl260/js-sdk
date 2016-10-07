var mrClient = new MRClient.default({
    clientId: "{YOUR_CLIENT_ID}",
    clientSecret: "{YOUR_CLIENT_SECRET}",
});

var token = mrClient.auth.setToken({
    accessToken: "klfgkdj",
    expiredAt: new Date(),
    refreshToken: "fdmllkf"
});

mrClient.request('/me', {
   method: 'GET'
}).then(function (response) {
    return response.json();
}).then(function (payload) {
    console.log(payload.data.name);
});
