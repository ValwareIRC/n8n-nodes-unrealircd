"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdServer = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdServer {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Server',
            name: 'unrealIRCdServer',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage servers on UnrealIRCd network',
            defaults: {
                name: 'UnrealIRCd Server',
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
                            name: 'List Servers',
                            value: 'list',
                            description: 'Get a list of all servers',
                            action: 'List servers',
                        },
                        {
                            name: 'Get Server',
                            value: 'get',
                            description: 'Get details of a specific server',
                            action: 'Get server details',
                        },
                        {
                            name: 'Rehash',
                            value: 'rehash',
                            description: 'Reload server configuration',
                            action: 'Rehash server',
                        },
                        {
                            name: 'Connect',
                            value: 'connect',
                            description: 'Connect to a server',
                            action: 'Connect to server',
                        },
                        {
                            name: 'Disconnect',
                            value: 'disconnect',
                            description: 'Disconnect from a server',
                            action: 'Disconnect from server',
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
                    displayName: 'Server Name',
                    name: 'serverName',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The server name',
                    displayOptions: {
                        show: {
                            operation: ['get', 'connect', 'disconnect'],
                        },
                    },
                },
                {
                    displayName: 'Reason',
                    name: 'reason',
                    type: 'string',
                    default: '',
                    description: 'Disconnect reason',
                    displayOptions: {
                        show: {
                            operation: ['disconnect'],
                        },
                    },
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
                switch (operation) {
                    case 'list':
                        const objectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                        result = await rpc.serverList({ object_detail_level: objectDetailLevel });
                        break;
                    case 'get':
                        const serverName = this.getNodeParameter('serverName', i);
                        const getObjectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                        result = await rpc.serverGet(serverName, { object_detail_level: getObjectDetailLevel });
                        break;
                    case 'rehash':
                        result = await rpc.serverRehash();
                        break;
                    case 'connect':
                        const connectServer = this.getNodeParameter('serverName', i);
                        result = await rpc.serverConnect(connectServer);
                        break;
                    case 'disconnect':
                        const disconnectServer = this.getNodeParameter('serverName', i);
                        const reason = this.getNodeParameter('reason', i);
                        result = await rpc.serverDisconnect(disconnectServer, reason || undefined);
                        break;
                    default:
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
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
exports.UnrealIRCdServer = UnrealIRCdServer;
//# sourceMappingURL=UnrealIRCdServer.node.js.map