"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdStatsTool = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdStatsTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Stats Tool',
            name: 'unrealIRCdStatsTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for getting statistics from UnrealIRCd server with automatic data redaction',
            defaults: {
                name: 'UnrealIRCd Stats Tool',
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
                            name: 'Get',
                            value: 'get',
                            description: 'Get server statistics (ai_safe)',
                            action: 'Get server statistics',
                        },
                    ],
                    default: 'get',
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
                    displayName: 'Statistics Type',
                    name: 'statsType',
                    type: 'options',
                    options: [
                        { name: 'All', value: 'all' },
                        { name: 'General', value: 'general' },
                        { name: 'Users', value: 'users' },
                        { name: 'Channels', value: 'channels' },
                        { name: 'Network', value: 'network' },
                    ],
                    default: 'all',
                    description: 'Type of statistics to retrieve',
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
                    case 'get':
                        const statsType = this.getNodeParameter('statsType', i);
                        result = await rpc.statsGet({ type: statsType });
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
exports.UnrealIRCdStatsTool = UnrealIRCdStatsTool;
//# sourceMappingURL=UnrealIRCdStatsTool.node.js.map