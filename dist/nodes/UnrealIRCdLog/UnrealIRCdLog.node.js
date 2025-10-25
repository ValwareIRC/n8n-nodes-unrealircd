"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdLog = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdLog {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Log',
            name: 'unrealIRCdLog',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Access and manage logs on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd Log',
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
                            name: 'Subscribe',
                            value: 'subscribe',
                            description: 'Subscribe to log events',
                            action: 'Subscribe to log events',
                        },
                        {
                            name: 'Unsubscribe',
                            value: 'unsubscribe',
                            description: 'Unsubscribe from log events',
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
exports.UnrealIRCdLog = UnrealIRCdLog;
//# sourceMappingURL=UnrealIRCdLog.node.js.map