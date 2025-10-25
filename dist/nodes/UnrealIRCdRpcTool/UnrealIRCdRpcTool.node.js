"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdRpcTool = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdRpcTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd RPC Tool',
            name: 'unrealIRCdRpcTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for managing RPC connections on UnrealIRCd server with automatic data redaction',
            defaults: {
                name: 'UnrealIRCd RPC Tool',
            },
            inputs: ["main"],
            outputs: ["main"],
            usableAsTool: true,
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
                            description: 'Get RPC connection information (ai_safe)',
                            action: 'Get RPC info',
                        },
                        {
                            name: 'Set Issuer',
                            value: 'set_issuer',
                            description: 'Set RPC issuer information (ai_safe)',
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
                    default: {
                        redactSensitiveData: true,
                        redactIPs: true,
                        redactEmails: true,
                        redactPasswords: true,
                    },
                    options: [
                        {
                            displayName: 'Redact Sensitive Data',
                            name: 'redactSensitiveData',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact sensitive information from responses',
                        },
                        {
                            displayName: 'Redact IP Addresses',
                            name: 'redactIPs',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact IP addresses from responses',
                        },
                        {
                            displayName: 'Redact Email Addresses',
                            name: 'redactEmails',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact email addresses from responses',
                        },
                        {
                            displayName: 'Redact Passwords',
                            name: 'redactPasswords',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact passwords from responses',
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
        var _a, _b, _c, _d;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const credentials = await this.getCredentials('unrealIRCdCredentialsApi');
                const operation = this.getNodeParameter('operation', i);
                const redactionOptionsParam = this.getNodeParameter('redactionOptions', i);
                const redactionOptions = {
                    redactSensitiveData: (_a = redactionOptionsParam.redactSensitiveData) !== null && _a !== void 0 ? _a : true,
                    redactIPs: (_b = redactionOptionsParam.redactIPs) !== null && _b !== void 0 ? _b : true,
                    redactEmails: (_c = redactionOptionsParam.redactEmails) !== null && _c !== void 0 ? _c : true,
                    redactPasswords: (_d = redactionOptionsParam.redactPasswords) !== null && _d !== void 0 ? _d : true,
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
                        ai_safe: true,
                    },
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : String(error),
                            success: false,
                            ai_safe: true,
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
exports.UnrealIRCdRpcTool = UnrealIRCdRpcTool;
//# sourceMappingURL=UnrealIRCdRpcTool.node.js.map