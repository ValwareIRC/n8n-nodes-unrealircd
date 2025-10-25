"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdBan = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdBan {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Ban',
            name: 'unrealIRCdBan',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage bans and ban exceptions on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd Ban',
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
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Server Ban',
                            value: 'serverBan',
                            description: 'Manage server bans (G-lines, K-lines, etc.)',
                        },
                        {
                            name: 'Server Ban Exception',
                            value: 'serverBanException',
                            description: 'Manage server ban exceptions (E-lines)',
                        },
                    ],
                    default: 'serverBan',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'List',
                            value: 'list',
                            description: 'Get a list of bans/exceptions',
                            action: 'List bans',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get details of a specific ban/exception',
                            action: 'Get ban details',
                        },
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a new ban/exception',
                            action: 'Add ban',
                        },
                        {
                            name: 'Delete',
                            value: 'del',
                            description: 'Remove a ban/exception',
                            action: 'Delete ban',
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
                        {
                            displayName: 'Redact IP Addresses',
                            name: 'redactIPs',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact IP addresses',
                            displayOptions: {
                                show: {
                                    redactSensitiveData: [true],
                                },
                            },
                        },
                    ],
                },
                {
                    displayName: 'Ban Name/Mask',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '*@*.example.com',
                    description: 'The ban mask or name',
                    displayOptions: {
                        show: {
                            operation: ['get', 'add', 'del'],
                        },
                    },
                },
                {
                    displayName: 'Ban Type',
                    name: 'type',
                    type: 'options',
                    options: [
                        {
                            name: 'G-line (Global ban)',
                            value: 'gline',
                        },
                        {
                            name: 'K-line (Local ban)',
                            value: 'kline',
                        },
                        {
                            name: 'Z-line (IP ban)',
                            value: 'zline',
                        },
                        {
                            name: 'Q-line (Nick ban)',
                            value: 'qline',
                        },
                    ],
                    default: 'gline',
                    required: true,
                    description: 'The type of ban',
                    displayOptions: {
                        show: {
                            operation: ['get', 'add', 'del'],
                        },
                    },
                },
                {
                    displayName: 'Ban Options',
                    name: 'banOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ['add'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Reason',
                            name: 'reason',
                            type: 'string',
                            default: '',
                            description: 'Reason for the ban',
                        },
                        {
                            displayName: 'Duration',
                            name: 'duration',
                            type: 'string',
                            default: '',
                            placeholder: '1d',
                            description: 'Ban duration (e.g., "1h", "1d", "1w")',
                        },
                        {
                            displayName: 'Set By',
                            name: 'set_by',
                            type: 'string',
                            default: '',
                            description: 'Who set the ban',
                        },
                    ],
                },
                {
                    displayName: 'Object Detail Level',
                    name: 'objectDetailLevel',
                    type: 'number',
                    default: 2,
                    description: 'Level of detail in the response (0-7)',
                    displayOptions: {
                        show: {
                            operation: ['list', 'get'],
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
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                const redactionOptionsParam = this.getNodeParameter('redactionOptions', i);
                const redactionOptions = {
                    redactSensitiveData: redactionOptionsParam.redactSensitiveData || false,
                    redactIPs: redactionOptionsParam.redactIPs || false,
                    redactEmails: false,
                    redactPasswords: false,
                    customRedactionPatterns: []
                };
                const rpc = new UnrealIRCdJsonRpc_1.UnrealIRCdJsonRpc(credentials, redactionOptions, this);
                let result;
                if (resource === 'serverBan') {
                    switch (operation) {
                        case 'list':
                            const objectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                            result = await rpc.serverBanList({ object_detail_level: objectDetailLevel });
                            break;
                        case 'get':
                            const name = this.getNodeParameter('name', i);
                            const type = this.getNodeParameter('type', i);
                            result = await rpc.serverBanGet(name, type);
                            break;
                        case 'add':
                            const addName = this.getNodeParameter('name', i);
                            const addType = this.getNodeParameter('type', i);
                            const banOptions = this.getNodeParameter('banOptions', i);
                            result = await rpc.serverBanAdd(addName, addType, banOptions);
                            break;
                        case 'del':
                            const delName = this.getNodeParameter('name', i);
                            const delType = this.getNodeParameter('type', i);
                            result = await rpc.serverBanDel(delName, delType);
                            break;
                        default:
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                else if (resource === 'serverBanException') {
                    switch (operation) {
                        case 'list':
                            const objectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                            result = await rpc.serverBanExceptionList({ object_detail_level: objectDetailLevel });
                            break;
                        case 'get':
                            const name = this.getNodeParameter('name', i);
                            const type = this.getNodeParameter('type', i);
                            result = await rpc.serverBanExceptionGet(name, type);
                            break;
                        case 'add':
                            const addName = this.getNodeParameter('name', i);
                            const addType = this.getNodeParameter('type', i);
                            const banOptions = this.getNodeParameter('banOptions', i);
                            result = await rpc.serverBanExceptionAdd(addName, addType, banOptions);
                            break;
                        case 'del':
                            const delName = this.getNodeParameter('name', i);
                            const delType = this.getNodeParameter('type', i);
                            result = await rpc.serverBanExceptionDel(delName, delType);
                            break;
                        default:
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                    }
                }
                returnData.push({
                    json: {
                        resource,
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
exports.UnrealIRCdBan = UnrealIRCdBan;
//# sourceMappingURL=UnrealIRCdBan.node.js.map