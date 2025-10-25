"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdStats = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdStats {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Stats',
            name: 'unrealIRCdStats',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Get statistics and metrics from UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd Stats',
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
                            name: 'Get',
                            value: 'get',
                            description: 'Get server statistics',
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
exports.UnrealIRCdStats = UnrealIRCdStats;
//# sourceMappingURL=UnrealIRCdStats.node.js.map