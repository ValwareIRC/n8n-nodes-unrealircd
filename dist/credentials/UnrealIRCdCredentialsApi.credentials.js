"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdCredentialsApi = void 0;
class UnrealIRCdCredentialsApi {
    constructor() {
        this.name = 'unrealIRCdCredentialsApi';
        this.displayName = 'UnrealIRCd Credentials';
        this.documentationUrl = 'https://www.unrealircd.org/docs/JSON-RPC';
        this.properties = [
            {
                displayName: 'User Name',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: 'https://example.com',
                description: 'The host to connect to. Can be a URL or an IP address.',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 8600,
                description: 'The port to connect to.',
            },
            {
                displayName: 'Use HTTPS',
                name: 'useHttps',
                type: 'boolean',
                default: true,
                description: 'Whether to use HTTPS for the connection.',
            }
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                auth: {
                    username: '={{ $credentials.username }}',
                    password: '={{ $credentials.password }}',
                },
                qs: {
                    n8n: 'rocks',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{ $credentials.useHttps ? "https" : "http" }}://={{ $credentials.host }}:={{ $credentials.port }}',
                url: '/api',
            },
        };
    }
}
exports.UnrealIRCdCredentialsApi = UnrealIRCdCredentialsApi;
//# sourceMappingURL=UnrealIRCdCredentialsApi.credentials.js.map