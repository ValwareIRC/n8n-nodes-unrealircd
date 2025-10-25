"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdUserTool = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const UnrealIRCdJsonRpc_1 = require("../UnrealIRCdJsonRpc");
class UnrealIRCdUserTool {
    constructor() {
        this.description = {
            displayName: 'UnrealIRCd User Tool',
            name: 'unrealIRCdUserTool',
            icon: 'file:unrealircd.svg',
            group: ['communication'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'AI tool for managing users on UnrealIRCd server',
            defaults: {
                name: 'UnrealIRCd User Tool',
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
                            name: 'List Users',
                            value: 'list',
                            description: 'Get a list of all users on the IRC server',
                            action: 'List all IRC users',
                        },
                        {
                            name: 'Get User',
                            value: 'get',
                            description: 'Get detailed information about a specific user',
                            action: 'Get IRC user details',
                        },
                        {
                            name: 'Set Nick',
                            value: 'setNick',
                            description: 'Change a user\'s nickname on the IRC server',
                            action: 'Change IRC user nickname',
                        },
                        {
                            name: 'Set Username',
                            value: 'setUsername',
                            description: 'Change a user\'s username/ident on the IRC server',
                            action: 'Change IRC user username',
                        },
                        {
                            name: 'Set Realname',
                            value: 'setRealname',
                            description: 'Change a user\'s real name (GECOS) on the IRC server',
                            action: 'Change IRC user realname',
                        },
                        {
                            name: 'Set Virtual Host',
                            value: 'setVhost',
                            description: 'Set a virtual host for a user on the IRC server',
                            action: 'Set IRC user virtual host',
                        },
                        {
                            name: 'Set Mode',
                            value: 'setMode',
                            description: 'Change user modes on the IRC server',
                            action: 'Change IRC user modes',
                        },
                        {
                            name: 'Set SNOMask',
                            value: 'setSnomask',
                            description: 'Change user server notices mask for IRC operators',
                            action: 'Change IRC user snomask',
                        },
                        {
                            name: 'Set Oper',
                            value: 'setOper',
                            description: 'Grant IRC operator status to a user',
                            action: 'Grant IRC operator status',
                        },
                        {
                            name: 'Join Channel',
                            value: 'join',
                            description: 'Make a user join an IRC channel',
                            action: 'Join user to IRC channel',
                        },
                        {
                            name: 'Part Channel',
                            value: 'part',
                            description: 'Make a user leave an IRC channel',
                            action: 'Part user from IRC channel',
                        },
                        {
                            name: 'Kill User',
                            value: 'kill',
                            description: 'Force disconnect a user from the IRC server (KILL)',
                            action: 'Kill IRC user',
                        },
                        {
                            name: 'Quit User',
                            value: 'quit',
                            description: 'Make a user quit normally from the IRC server',
                            action: 'Quit IRC user',
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
                        redactPasswords: true,
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
                    description: 'The nickname or UID of the IRC user to target',
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
                    description: 'The new nickname to assign to the IRC user',
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
                    description: 'Bypass nick checks and kill existing user if nickname is already taken',
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
                    description: 'The new username/ident for the IRC user',
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
                    description: 'The new real name/GECOS for the IRC user',
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
                    description: 'The virtual host to set for the IRC user',
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
                    description: 'IRC user mode string (e.g., "+i-w" to set invisible and remove wallops)',
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
                    description: 'IRC server notices mask string for operators (e.g., "+bB-c")',
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
                    description: 'Don\'t show the mode/snomask change notification to the user',
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
                    description: 'The IRC operator account name to assign',
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
                            description: 'Network administrator with override capabilities',
                        },
                        {
                            name: 'Net Admin',
                            value: 'netadmin',
                            description: 'Network administrator',
                        },
                        {
                            name: 'Server Admin',
                            value: 'sadmin',
                            description: 'Server administrator',
                        },
                        {
                            name: 'Admin',
                            value: 'admin',
                            description: 'Administrator',
                        },
                        {
                            name: 'Oper',
                            value: 'oper',
                            description: 'IRC Operator',
                        },
                        {
                            name: 'Local Oper',
                            value: 'locop',
                            description: 'Local IRC Operator',
                        },
                    ],
                    default: 'oper',
                    required: true,
                    description: 'The IRC operator class/privilege level to assign',
                    displayOptions: {
                        show: {
                            operation: ['setOper'],
                        },
                    },
                },
                {
                    displayName: 'Channel',
                    name: 'channel',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '#channel',
                    description: 'The IRC channel name(s) to join/part (e.g., "#general" or "#chan1,#chan2")',
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
                    description: 'The IRC channel key/password (if the channel requires one)',
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
                    description: 'The reason message for kill/quit action',
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
                    redactPasswords: redactionOptionsParam.redactPasswords !== false,
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
                        const operOptions = {
                            class: 'opers',
                            modes: '+ws',
                            snomask: '+bBcdfkqsSoO',
                            vhost: ''
                        };
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
exports.UnrealIRCdUserTool = UnrealIRCdUserTool;
//# sourceMappingURL=UnrealIRCdUserTool.node.js.map