"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdSpamfilter = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdSpamfilter {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Spamfilter',
            name: 'unrealIRCdSpamfilter',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage spamfilters on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd Spamfilter',
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
                            name: 'List',
                            value: 'list',
                            description: 'Get a list of spamfilters',
                            action: 'List spamfilters',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get details of a specific spamfilter',
                            action: 'Get spamfilter details',
                        },
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a new spamfilter',
                            action: 'Add spamfilter',
                        },
                        {
                            name: 'Delete',
                            value: 'del',
                            description: 'Remove a spamfilter',
                            action: 'Delete spamfilter',
                        },
                    ],
                    default: 'list',
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
                    displayName: 'Spamfilter ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The spamfilter ID',
                    displayOptions: {
                        show: {
                            operation: ['get', 'del'],
                        },
                    },
                },
                {
                    displayName: 'Match Pattern',
                    name: 'match',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The regex pattern to match',
                    displayOptions: {
                        show: {
                            operation: ['add'],
                        },
                    },
                },
                {
                    displayName: 'Target',
                    name: 'target',
                    type: 'string',
                    default: 'channel',
                    required: true,
                    description: 'Where to apply the filter (channel, private, etc.)',
                    displayOptions: {
                        show: {
                            operation: ['add'],
                        },
                    },
                },
                {
                    displayName: 'Action',
                    name: 'action',
                    type: 'options',
                    options: [
                        { name: 'Block', value: 'block' },
                        { name: 'Kill', value: 'kill' },
                        { name: 'Gline', value: 'gline' },
                        { name: 'Warn', value: 'warn' },
                    ],
                    default: 'block',
                    required: true,
                    description: 'Action to take when filter matches',
                    displayOptions: {
                        show: {
                            operation: ['add'],
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
                    case 'list':
                        result = await rpc.spamfilterList({});
                        break;
                    case 'get':
                        const id = this.getNodeParameter('id', i);
                        result = await rpc.spamfilterGet(id);
                        break;
                    case 'add':
                        const match = this.getNodeParameter('match', i);
                        const target = this.getNodeParameter('target', i);
                        const action = this.getNodeParameter('action', i);
                        result = await rpc.spamfilterAdd(match, target, action);
                        break;
                    case 'del':
                        const delId = this.getNodeParameter('id', i);
                        result = await rpc.spamfilterDel(delId);
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
exports.UnrealIRCdSpamfilter = UnrealIRCdSpamfilter;
//# sourceMappingURL=UnrealIRCdSpamfilter.node.js.map