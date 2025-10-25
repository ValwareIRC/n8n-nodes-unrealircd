"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdBanTool = void 0;
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdBanTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Ban Tool',
            name: 'unrealIRCdBanTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for managing bans and ban exceptions on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd Ban Tool',
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
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Server Ban',
                            value: 'serverBan',
                            description: 'Manage IRC server bans (G-lines, K-lines, Z-lines, Q-lines)',
                        },
                        {
                            name: 'Server Ban Exception',
                            value: 'serverBanException',
                            description: 'Manage IRC server ban exceptions (E-lines)',
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
                            description: 'Get a list of IRC server bans or exceptions',
                            action: 'List IRC bans',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get details of a specific IRC ban or exception',
                            action: 'Get IRC ban details',
                        },
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a new IRC ban or exception',
                            action: 'Add IRC ban',
                        },
                        {
                            name: 'Delete',
                            value: 'del',
                            description: 'Remove an IRC ban or exception',
                            action: 'Delete IRC ban',
                        },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Ban Name/Mask',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '*@*.example.com',
                    description: 'The IRC ban mask or name pattern',
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
                            description: 'Global IRC network ban',
                        },
                        {
                            name: 'K-line (Local ban)',
                            value: 'kline',
                            description: 'Local IRC server ban',
                        },
                        {
                            name: 'Z-line (IP ban)',
                            value: 'zline',
                            description: 'IP address ban',
                        },
                        {
                            name: 'Q-line (Nick ban)',
                            value: 'qline',
                            description: 'Nickname ban',
                        },
                    ],
                    default: 'gline',
                    required: true,
                    description: 'The type of IRC ban to manage',
                    displayOptions: {
                        show: {
                            operation: ['get', 'add', 'del'],
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
                const redactionOptions = {
                    redactSensitiveData: true,
                    redactIPs: true,
                    redactEmails: true,
                    redactPasswords: false,
                    customRedactionPatterns: []
                };
                const rpc = new UnrealIRCdJsonRpc_1.UnrealIRCdJsonRpc(credentials, redactionOptions, this);
                let result;
                if (resource === 'serverBan') {
                    switch (operation) {
                        case 'list':
                            result = await rpc.serverBanList({ object_detail_level: 2 });
                            break;
                        case 'get':
                            const name = this.getNodeParameter('name', i);
                            const type = this.getNodeParameter('type', i);
                            result = await rpc.serverBanGet(name, type);
                            break;
                        case 'add':
                            const addName = this.getNodeParameter('name', i);
                            const addType = this.getNodeParameter('type', i);
                            result = await rpc.serverBanAdd(addName, addType, {});
                            break;
                        case 'del':
                            const delName = this.getNodeParameter('name', i);
                            const delType = this.getNodeParameter('type', i);
                            result = await rpc.serverBanDel(delName, delType);
                            break;
                    }
                }
                else {
                    switch (operation) {
                        case 'list':
                            result = await rpc.serverBanExceptionList({ object_detail_level: 2 });
                            break;
                        case 'get':
                            const name = this.getNodeParameter('name', i);
                            const type = this.getNodeParameter('type', i);
                            result = await rpc.serverBanExceptionGet(name, type);
                            break;
                        case 'add':
                            const addName = this.getNodeParameter('name', i);
                            const addType = this.getNodeParameter('type', i);
                            result = await rpc.serverBanExceptionAdd(addName, addType, {});
                            break;
                        case 'del':
                            const delName = this.getNodeParameter('name', i);
                            const delType = this.getNodeParameter('type', i);
                            result = await rpc.serverBanExceptionDel(delName, delType);
                            break;
                    }
                }
                returnData.push({
                    json: {
                        resource,
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
exports.UnrealIRCdBanTool = UnrealIRCdBanTool;
//# sourceMappingURL=UnrealIRCdBanTool.node.js.map