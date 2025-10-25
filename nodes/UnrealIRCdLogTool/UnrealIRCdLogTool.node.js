"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdLogTool = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdLogTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Log Tool',
            name: 'unrealIRCdLogTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for accessing logs on UnrealIRCd server with automatic data redaction',
            defaults: {
                name: 'UnrealIRCd Log Tool',
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
                            name: 'Subscribe',
                            value: 'subscribe',
                            description: 'Subscribe to log events (ai_safe)',
                            action: 'Subscribe to log events',
                        },
                        {
                            name: 'Unsubscribe',
                            value: 'unsubscribe',
                            description: 'Unsubscribe from log events (ai_safe)',
                            action: 'Unsubscribe from log events',
                        },
                    ],
                    default: 'subscribe',
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
                    displayName: 'Log Level',
                    name: 'logLevel',
                    type: 'options',
                    options: [
                        { name: 'Debug', value: 'debug' },
                        { name: 'Info', value: 'info' },
                        { name: 'Warn', value: 'warn' },
                        { name: 'Error', value: 'error' },
                        { name: 'Fatal', value: 'fatal' },
                    ],
                    default: 'info',
                    description: 'Minimum log level to subscribe to',
                    displayOptions: {
                        show: {
                            operation: ['subscribe'],
                        },
                    },
                },
                {
                    displayName: 'Sources',
                    name: 'sources',
                    type: 'string',
                    default: '',
                    description: 'Comma-separated list of log sources to filter (optional)',
                    displayOptions: {
                        show: {
                            operation: ['subscribe'],
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
                    case 'subscribe':
                        const logLevel = this.getNodeParameter('logLevel', i);
                        const sources = this.getNodeParameter('sources', i);
                        const params = { log_level: logLevel };
                        if (sources) {
                            params.sources = sources.split(',').map(s => s.trim());
                        }
                        result = await rpc.logSubscribe(params);
                        break;
                    case 'unsubscribe':
                        result = await rpc.logUnsubscribe();
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
exports.UnrealIRCdLogTool = UnrealIRCdLogTool;
//# sourceMappingURL=UnrealIRCdLogTool.node.js.map