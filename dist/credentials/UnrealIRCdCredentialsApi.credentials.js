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
                default: 'https://example.com/api',
                description: 'The full URL to connect to, e.g. https://localhost:8600/api',
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
                baseURL: '={{ $credentials.host }}',
                url: '',
            },
        };
    }
}
exports.UnrealIRCdCredentialsApi = UnrealIRCdCredentialsApi;
//# sourceMappingURL=UnrealIRCdCredentialsApi.credentials.js.map