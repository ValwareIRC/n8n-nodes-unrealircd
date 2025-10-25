import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class UnrealIRCdCredentialsApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: [
        {
            displayName: 'User Name';
            name: 'username';
            type: 'string';
            default: '';
        },
        {
            displayName: 'Password';
            name: 'password';
            type: 'string';
            typeOptions: { password: true };
            default: '';
        },
        {
            displayName: 'Host';
            name: 'host';
            type: 'string';
            default: 'https://example.com/api';
            description: 'The full URL to connect to, e.g. https://localhost:8600/api';
        }
    ];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
