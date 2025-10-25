"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdRpc = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdRpc {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd RPC',
            name: 'unrealIRCdRpc',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage RPC connections and settings on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd RPC',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'unrealIRCdCredentialsApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Info',
                            value: 'info',
                            description: 'Get RPC connection information',
                            action: 'Get RPC info',
                        },
                        {
                            name: 'Set Issuer',
                            value: 'set_issuer',
                            description: 'Set RPC issuer information',
                            action: 'Set RPC issuer',
                        },
                    ],
                    default: 'info',
                },
                {
                    displayName: 'Redaction Options',
                    name: 'redactionOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Redact Sensitive Data',
                            name: 'redactSensitiveData',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to redact sensitive information from responses',
                        },
                    ],
                },
                {
                    displayName: 'Issuer',
                    name: 'issuer',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The issuer name for RPC operations',
                    displayOptions: {
                        show: {
                            operation: ['set_issuer'],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('unrealIRCdCredentialsApi');
                const operation = this.getNodeParameter('operation', i);
                const redactionOptionsParam = this.getNodeParameter('redactionOptions', i);
                const redactionOptions = {
                    redactSensitiveData: redactionOptionsParam.redactSensitiveData || false,
                    redactIPs: false,
                    redactEmails: false,
                    redactPasswords: false,
                    customRedactionPatterns: []
                };
                const rpc = new UnrealIRCdJsonRpc_1.UnrealIRCdJsonRpc(credentials, redactionOptions, this);
                let result;
                switch (operation) {
                    case 'info':
                        result = await rpc.rpcInfo();
                        break;
                    case 'set_issuer':
                        const issuer = this.getNodeParameter('issuer', i);
                        result = await rpc.rpcSetIssuer(issuer);
                        break;
                }
                returnData.push({
                    json: {
                        operation,
                        success: true,
                        result,
                    },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : String(error),
                            success: false,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.UnrealIRCdRpc = UnrealIRCdRpc;
//# sourceMappingURL=UnrealIRCdRpc.node.js.map