"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdUser = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdUser {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd User',
            name: 'unrealIRCdUser',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Manage users on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd User',
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
                            name: 'List Users',
                            value: 'list',
                            description: 'Get a list of all users',
                            action: 'List users',
                        },
                        {
                            name: 'Get User',
                            value: 'get',
                            description: 'Get details of a specific user',
                            action: 'Get user details',
                        },
                        {
                            name: 'Set Nick',
                            value: 'setNick',
                            description: 'Change a user\'s nickname',
                            action: 'Change user nickname',
                        },
                        {
                            name: 'Set Username',
                            value: 'setUsername',
                            description: 'Change a user\'s username/ident',
                            action: 'Change user username',
                        },
                        {
                            name: 'Set Realname',
                            value: 'setRealname',
                            description: 'Change a user\'s real name',
                            action: 'Change user realname',
                        },
                        {
                            name: 'Set Virtual Host',
                            value: 'setVhost',
                            description: 'Set a virtual host for a user',
                            action: 'Set user virtual host',
                        },
                        {
                            name: 'Set Mode',
                            value: 'setMode',
                            description: 'Change user modes',
                            action: 'Change user modes',
                        },
                        {
                            name: 'Set SNOMask',
                            value: 'setSnomask',
                            description: 'Change user server notices mask',
                            action: 'Change user snomask',
                        },
                        {
                            name: 'Set Oper',
                            value: 'setOper',
                            description: 'Grant IRC operator status',
                            action: 'Grant operator status',
                        },
                        {
                            name: 'Join Channel',
                            value: 'join',
                            description: 'Make user join a channel',
                            action: 'Join user to channel',
                        },
                        {
                            name: 'Part Channel',
                            value: 'part',
                            description: 'Make user leave a channel',
                            action: 'Part user from channel',
                        },
                        {
                            name: 'Kill User',
                            value: 'kill',
                            description: 'Force disconnect a user (KILL)',
                            action: 'Kill user',
                        },
                        {
                            name: 'Quit User',
                            value: 'quit',
                            description: 'Make user quit normally',
                            action: 'Quit user',
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
                        {
                            displayName: 'Redact Email Addresses',
                            name: 'redactEmails',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact email addresses',
                            displayOptions: {
                                show: {
                                    redactSensitiveData: [true],
                                },
                            },
                        },
                        {
                            displayName: 'Redact Passwords',
                            name: 'redactPasswords',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to redact password fields',
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
                    displayName: 'Nick',
                    name: 'nick',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The nickname or UID of the user',
                    displayOptions: {
                        show: {
                            operation: ['get', 'setNick', 'setUsername', 'setRealname', 'setVhost', 'setMode', 'setSnomask', 'setOper', 'join', 'part', 'kill', 'quit'],
                        },
                    },
                },
                {
                    displayName: 'New Nick',
                    name: 'newNick',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The new nickname',
                    displayOptions: {
                        show: {
                            operation: ['setNick'],
                        },
                    },
                },
                {
                    displayName: 'Force',
                    name: 'force',
                    type: 'boolean',
                    default: false,
                    description: 'Bypass nick checks and kill existing user if nick is taken',
                    displayOptions: {
                        show: {
                            operation: ['setNick'],
                        },
                    },
                },
                {
                    displayName: 'Username',
                    name: 'username',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The new username/ident',
                    displayOptions: {
                        show: {
                            operation: ['setUsername'],
                        },
                    },
                },
                {
                    displayName: 'Real Name',
                    name: 'realname',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The new real name/GECOS',
                    displayOptions: {
                        show: {
                            operation: ['setRealname'],
                        },
                    },
                },
                {
                    displayName: 'Virtual Host',
                    name: 'vhost',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The virtual host to set',
                    displayOptions: {
                        show: {
                            operation: ['setVhost'],
                        },
                    },
                },
                {
                    displayName: 'Modes',
                    name: 'modes',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '+i-w',
                    description: 'The mode string (e.g., "+i-w")',
                    displayOptions: {
                        show: {
                            operation: ['setMode'],
                        },
                    },
                },
                {
                    displayName: 'SNOMask',
                    name: 'snomask',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '+bB-c',
                    description: 'The snomask string (e.g., "+bB-c")',
                    displayOptions: {
                        show: {
                            operation: ['setSnomask'],
                        },
                    },
                },
                {
                    displayName: 'Hidden',
                    name: 'hidden',
                    type: 'boolean',
                    default: false,
                    description: 'Don\'t show the mode/snomask change to the user',
                    displayOptions: {
                        show: {
                            operation: ['setMode', 'setSnomask'],
                        },
                    },
                },
                {
                    displayName: 'Oper Account',
                    name: 'operAccount',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The oper account name',
                    displayOptions: {
                        show: {
                            operation: ['setOper'],
                        },
                    },
                },
                {
                    displayName: 'Oper Class',
                    name: 'operClass',
                    type: 'options',
                    options: [
                        {
                            name: 'Net Admin (with override)',
                            value: 'netadmin-with-override',
                        },
                        {
                            name: 'Net Admin',
                            value: 'netadmin',
                        },
                        {
                            name: 'Server Admin',
                            value: 'sadmin',
                        },
                        {
                            name: 'Admin',
                            value: 'admin',
                        },
                        {
                            name: 'Oper',
                            value: 'oper',
                        },
                        {
                            name: 'Local Oper',
                            value: 'locop',
                        },
                    ],
                    default: 'oper',
                    required: true,
                    description: 'The oper class to assign',
                    displayOptions: {
                        show: {
                            operation: ['setOper'],
                        },
                    },
                },
                {
                    displayName: 'Oper Options',
                    name: 'operOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ['setOper'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Class',
                            name: 'class',
                            type: 'string',
                            default: 'opers',
                            description: 'The class to put the user in',
                        },
                        {
                            displayName: 'Modes',
                            name: 'modes',
                            type: 'string',
                            default: '+ws',
                            description: 'User modes to set on oper',
                        },
                        {
                            displayName: 'SNOMask',
                            name: 'snomask',
                            type: 'string',
                            default: '+bBcdfkqsSoO',
                            description: 'SNOMask to set on oper',
                        },
                        {
                            displayName: 'Virtual Host',
                            name: 'vhost',
                            type: 'string',
                            default: '',
                            description: 'Virtual host to set on oper',
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
                    description: 'The channel name(s) to join/part',
                    displayOptions: {
                        show: {
                            operation: ['join', 'part'],
                        },
                    },
                },
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    default: '',
                    description: 'The channel key (if required)',
                    displayOptions: {
                        show: {
                            operation: ['join'],
                        },
                    },
                },
                {
                    displayName: 'Force Join/Part',
                    name: 'forceJoinPart',
                    type: 'boolean',
                    default: false,
                    description: 'Bypass join restrictions (SAJOIN) or show force notification (SAPART)',
                    displayOptions: {
                        show: {
                            operation: ['join', 'part'],
                        },
                    },
                },
                {
                    displayName: 'Reason',
                    name: 'reason',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The reason for kill/quit',
                    displayOptions: {
                        show: {
                            operation: ['kill', 'quit'],
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
                    redactEmails: redactionOptionsParam.redactEmails || false,
                    redactPasswords: redactionOptionsParam.redactPasswords || false,
                    customRedactionPatterns: redactionOptionsParam.customRedactionPatterns
                        ? redactionOptionsParam.customRedactionPatterns.split(',').map((p) => p.trim())
                        : []
                };
                const rpc = new UnrealIRCdJsonRpc_1.UnrealIRCdJsonRpc(credentials, redactionOptions, this);
                let result;
                switch (operation) {
                    case 'list':
                        const objectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                        result = await rpc.userList({ object_detail_level: objectDetailLevel });
                        break;
                    case 'get':
                        const nick = this.getNodeParameter('nick', i);
                        const getObjectDetailLevel = this.getNodeParameter('objectDetailLevel', i);
                        result = await rpc.userGet(nick, { object_detail_level: getObjectDetailLevel });
                        break;
                    case 'setNick':
                        const nickForChange = this.getNodeParameter('nick', i);
                        const newNick = this.getNodeParameter('newNick', i);
                        const force = this.getNodeParameter('force', i);
                        result = await rpc.userSetNick(nickForChange, newNick, force);
                        break;
                    case 'setUsername':
                        const nickForUsername = this.getNodeParameter('nick', i);
                        const username = this.getNodeParameter('username', i);
                        result = await rpc.userSetUsername(nickForUsername, username);
                        break;
                    case 'setRealname':
                        const nickForRealname = this.getNodeParameter('nick', i);
                        const realname = this.getNodeParameter('realname', i);
                        result = await rpc.userSetRealname(nickForRealname, realname);
                        break;
                    case 'setVhost':
                        const nickForVhost = this.getNodeParameter('nick', i);
                        const vhost = this.getNodeParameter('vhost', i);
                        result = await rpc.userSetVhost(nickForVhost, vhost);
                        break;
                    case 'setMode':
                        const nickForMode = this.getNodeParameter('nick', i);
                        const modes = this.getNodeParameter('modes', i);
                        const hidden = this.getNodeParameter('hidden', i);
                        result = await rpc.userSetMode(nickForMode, modes, hidden);
                        break;
                    case 'setSnomask':
                        const nickForSnomask = this.getNodeParameter('nick', i);
                        const snomask = this.getNodeParameter('snomask', i);
                        const snomaskHidden = this.getNodeParameter('hidden', i);
                        result = await rpc.userSetSnomask(nickForSnomask, snomask, snomaskHidden);
                        break;
                    case 'setOper':
                        const nickForOper = this.getNodeParameter('nick', i);
                        const operAccount = this.getNodeParameter('operAccount', i);
                        const operClass = this.getNodeParameter('operClass', i);
                        const operOptions = this.getNodeParameter('operOptions', i);
                        result = await rpc.userSetOper(nickForOper, operAccount, operClass, operOptions);
                        break;
                    case 'join':
                        const nickForJoin = this.getNodeParameter('nick', i);
                        const channelToJoin = this.getNodeParameter('channel', i);
                        const key = this.getNodeParameter('key', i);
                        const forceJoin = this.getNodeParameter('forceJoinPart', i);
                        result = await rpc.userJoin(nickForJoin, channelToJoin, key || undefined, forceJoin);
                        break;
                    case 'part':
                        const nickForPart = this.getNodeParameter('nick', i);
                        const channelToPart = this.getNodeParameter('channel', i);
                        const forcePart = this.getNodeParameter('forceJoinPart', i);
                        result = await rpc.userPart(nickForPart, channelToPart, forcePart);
                        break;
                    case 'kill':
                        const nickForKill = this.getNodeParameter('nick', i);
                        const killReason = this.getNodeParameter('reason', i);
                        result = await rpc.userKill(nickForKill, killReason);
                        break;
                    case 'quit':
                        const nickForQuit = this.getNodeParameter('nick', i);
                        const quitReason = this.getNodeParameter('reason', i);
                        result = await rpc.userQuit(nickForQuit, quitReason);
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
exports.UnrealIRCdUser = UnrealIRCdUser;
//# sourceMappingURL=UnrealIRCdUser.node.js.map