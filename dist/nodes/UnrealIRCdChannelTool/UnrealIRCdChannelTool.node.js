"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdChannelTool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdChannelTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd Channel Tool',
            name: 'unrealIRCdChannelTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for managing channels on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd Channel Tool',
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
                            name: 'List Channels',
                            value: 'list',
                            description: 'Get a list of all IRC channels on the server',
                            action: 'List IRC channels',
                        },
                        {
                            name: 'Get Channel',
                            value: 'get',
                            description: 'Get detailed information about a specific IRC channel',
                            action: 'Get IRC channel details',
                        },
                        {
                            name: 'Set Mode',
                            value: 'setMode',
                            description: 'Set or unset IRC channel modes',
                            action: 'Set IRC channel modes',
                        },
                        {
                            name: 'Set Topic',
                            value: 'setTopic',
                            description: 'Set IRC channel topic',
                            action: 'Set IRC channel topic',
                        },
                        {
                            name: 'Kick User',
                            value: 'kick',
                            description: 'Kick a user from the IRC channel',
                            action: 'Kick user from IRC channel',
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
                        redactEmails: true,
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
                            description: 'Whether to redact IP addresses from user information',
                            displayOptions: {
                                show: {
                                    redactSensitiveData: [true],
                                },
                            },
                        },
                        {
                            displayName: 'Redact Email Addresses',
                            name: 'redactEmails',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact email addresses from user information',
                            displayOptions: {
                                show: {
                                    redactSensitiveData: [true],
                                },
                            },
                        },
                        {
                            displayName: 'Custom Redaction Patterns',
                            name: 'customRedactionPatterns',
                            type: 'string',
                            default: '',
                            placeholder: 'pattern1,pattern2',
                            description: 'Comma-separated list of regex patterns to redact',
                            displayOptions: {
                                show: {
                                    redactSensitiveData: [true],
                                },
                            },
                        },
                    ],
                },
                {
                    displayName: 'Channel',
                    name: 'channel',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '#channel',
                    description: 'The IRC channel name (e.g., "#general")',
                    displayOptions: {
                        show: {
                            operation: ['get', 'setMode', 'setTopic', 'kick'],
                        },
                    },
                },
                {
                    displayName: 'Modes',
                    name: 'modes',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '+be',
                    description: 'IRC channel mode(s) to change (e.g., "+be" to add ban and ban exception, "-i+m" to remove invite-only and add moderated)',
                    displayOptions: {
                        show: {
                            operation: ['setMode'],
                        },
                    },
                },
                {
                    displayName: 'Parameters',
                    name: 'parameters',
                    type: 'string',
                    default: '',
                    placeholder: 'ban1 ban2',
                    description: 'Parameters for the IRC channel modes (space-separated)',
                    displayOptions: {
                        show: {
                            operation: ['setMode'],
                        },
                    },
                },
                {
                    displayName: 'Topic',
                    name: 'topic',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The new IRC channel topic text',
                    displayOptions: {
                        show: {
                            operation: ['setTopic'],
                        },
                    },
                },
                {
                    displayName: 'Set By',
                    name: 'setBy',
                    type: 'string',
                    default: '',
                    description: 'Username of who set the topic (for display purposes in topic queries)',
                    displayOptions: {
                        show: {
                            operation: ['setTopic'],
                        },
                    },
                },
                {
                    displayName: 'Set At',
                    name: 'setAt',
                    type: 'string',
                    default: '',
                    placeholder: '2023-01-07T09:19:59.000Z',
                    description: 'When the topic was set (ISO 8601 timestamp format)',
                    displayOptions: {
                        show: {
                            operation: ['setTopic'],
                        },
                    },
                },
                {
                    displayName: 'Nick',
                    name: 'nick',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The IRC user nickname to kick from the channel',
                    displayOptions: {
                        show: {
                            operation: ['kick'],
                        },
                    },
                },
                {
                    displayName: 'Reason',
                    name: 'reason',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The reason message for kicking the user',
                    displayOptions: {
                        show: {
                            operation: ['kick'],
                        },
                    },
                },
                {
                    displayName: 'Object Detail Level',
                    name: 'objectDetailLevel',
                    type: 'number',
                    default: 1,
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
                    redactEmails: redactionOptionsParam.redactEmails !== false,
                    redactPasswords: false,
                    customRedactionPatterns: redactionOptionsParam.customRedactionPatterns
                        ? redactionOptionsParam.customRedactionPatterns.split(',').map((p) => p.trim())
                        : []
                };
                const rpc = new UnrealIRCdJsonRpc_1.UnrealIRCdJsonRpc(credentials, redactionOptions, this);
                let result;
                switch (operation) {
                    case 'list':
                        const objectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                        result = await rpc.channelList({ object_detail_level: objectDetailLevel });
                        break;
                    case 'get':
                        const channel = this.getNodeParameter('channel', i);
                        const getObjectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                        result = await rpc.channelGet(channel, { object_detail_level: getObjectDetailLevel });
                        break;
                    case 'setMode':
                        const channelForMode = this.getNodeParameter('channel', i);
                        const modes = this.getNodeParameter('modes', i);
                        const parameters = this.getNodeParameter('parameters', i);
                        result = await rpc.channelSetMode(channelForMode, modes, parameters);
                        break;
                    case 'setTopic':
                        const channelForTopic = this.getNodeParameter('channel', i);
                        const topic = this.getNodeParameter('topic', i);
                        const setBy = this.getNodeParameter('setBy', i);
                        const setAt = this.getNodeParameter('setAt', i);
                        result = await rpc.channelSetTopic(channelForTopic, topic, setBy || undefined, setAt || undefined);
                        break;
                    case 'kick':
                        const channelForKick = this.getNodeParameter('channel', i);
                        const nick = this.getNodeParameter('nick', i);
                        const reason = this.getNodeParameter('reason', i);
                        result = await rpc.channelKick(channelForKick, nick, reason);
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
exports.UnrealIRCdChannelTool = UnrealIRCdChannelTool;
//# sourceMappingURL=UnrealIRCdChannelTool.node.js.map