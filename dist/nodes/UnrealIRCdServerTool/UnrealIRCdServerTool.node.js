"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdServerTool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdServerTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Server Tool',
            name: 'unrealIRCdServerTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for managing servers on UnrealIRCd network',
            defaults: {
                name: 'UnrealIRCd Server Tool',
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
                            name: 'List Servers',
                            value: 'list',
                            description: 'Get a list of all IRC servers in the network',
                            action: 'List IRC servers',
                        },
                        {
                            name: 'Get Server',
                            value: 'get',
                            description: 'Get detailed information about a specific IRC server',
                            action: 'Get IRC server details',
                        },
                        {
                            name: 'Rehash',
                            value: 'rehash',
                            description: 'Reload IRC server configuration',
                            action: 'Rehash IRC server',
                        },
                        {
                            name: 'Connect',
                            value: 'connect',
                            description: 'Connect to an IRC server',
                            action: 'Connect to IRC server',
                        },
                        {
                            name: 'Disconnect',
                            value: 'disconnect',
                            description: 'Disconnect from an IRC server',
                            action: 'Disconnect from IRC server',
                        },
                    ],
                    default: 'list',
                },
                {
                    displayName: 'Redaction Options',
                    name: 'redactionOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {
                        redactSensitiveData: true,
                        redactIPs: true,
                    },
                    options: [
                        {
                            displayName: 'Redact Sensitive Data',
                            name: 'redactSensitiveData',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact sensitive information from responses (recommended for AI)',
                        },
                        {
                            displayName: 'Redact IP Addresses',
                            name: 'redactIPs',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact IP addresses from server information',
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
                    description: 'The IRC server name to target',
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
                    description: 'Reason message for disconnecting from the IRC server',
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
                    description: 'Level of detail in the response (0-7, higher = more details)',
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
                    redactSensitiveData: redactionOptionsParam.redactSensitiveData !== false,
                    redactIPs: redactionOptionsParam.redactIPs !== false,
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
exports.UnrealIRCdServerTool = UnrealIRCdServerTool;
//# sourceMappingURL=UnrealIRCdServerTool.node.js.map