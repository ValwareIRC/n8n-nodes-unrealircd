import { ICredentialDataDecryptedObject, IExecuteFunctions } from 'n8n-workflow';
export interface JsonRpcRequest {
    jsonrpc: string;
    method: string;
    params: Record<string, any>;
    id: number | string;
}
export interface JsonRpcResponse {
    jsonrpc: string;
    id: number | string;
    result?: any;
    error?: {
        code: number;
        message: string;
    };
}
export interface RedactionOptions {
    redactSensitiveData: boolean;
    redactIPs: boolean;
    redactEmails: boolean;
    redactPasswords: boolean;
    customRedactionPatterns: string[];
}
export declare class UnrealIRCdJsonRpc {
    private credentials;
    private redactionOptions;
    private executeFunctions;
    constructor(credentials: ICredentialDataDecryptedObject, redactionOptions: RedactionOptions, executeFunctions: IExecuteFunctions);
    private redactData;
    makeRequest(method: string, params?: Record<string, any>): Promise<any>;
    userList(params?: Record<string, any>): Promise<any>;
    userGet(nick: string, params?: Record<string, any>): Promise<any>;
    userSetNick(nick: string, newnick: string, force?: boolean): Promise<any>;
    userSetUsername(nick: string, username: string): Promise<any>;
    userSetRealname(nick: string, realname: string): Promise<any>;
    userSetVhost(nick: string, vhost: string): Promise<any>;
    userSetMode(nick: string, modes: string, hidden?: boolean): Promise<any>;
    userSetSnomask(nick: string, snomask: string, hidden?: boolean): Promise<any>;
    userSetOper(nick: string, operAccount: string, operClass: string, options?: Record<string, any>): Promise<any>;
    userJoin(nick: string, channel: string, key?: string, force?: boolean): Promise<any>;
    userPart(nick: string, channel: string, force?: boolean): Promise<any>;
    userKill(nick: string, reason: string): Promise<any>;
    userQuit(nick: string, reason: string): Promise<any>;
    channelList(params?: Record<string, any>): Promise<any>;
    channelGet(channel: string, params?: Record<string, any>): Promise<any>;
    channelSetMode(channel: string, modes: string, parameters: string): Promise<any>;
    channelSetTopic(channel: string, topic: string, setBy?: string, setAt?: string): Promise<any>;
    channelKick(channel: string, nick: string, reason: string): Promise<any>;
    serverList(params?: Record<string, any>): Promise<any>;
    serverGet(name: string, params?: Record<string, any>): Promise<any>;
    serverRehash(): Promise<any>;
    serverConnect(server: string): Promise<any>;
    serverDisconnect(server: string, reason?: string): Promise<any>;
    serverBanList(params?: Record<string, any>): Promise<any>;
    serverBanGet(name: string, type: string): Promise<any>;
    serverBanAdd(name: string, type: string, options?: Record<string, any>): Promise<any>;
    serverBanDel(name: string, type: string): Promise<any>;
    serverBanExceptionList(params?: Record<string, any>): Promise<any>;
    serverBanExceptionGet(name: string, type: string): Promise<any>;
    serverBanExceptionAdd(name: string, type: string, options?: Record<string, any>): Promise<any>;
    serverBanExceptionDel(name: string, type: string): Promise<any>;
    spamfilterList(params?: Record<string, any>): Promise<any>;
    spamfilterGet(id: string): Promise<any>;
    spamfilterAdd(match: string, target: string, action: string, options?: Record<string, any>): Promise<any>;
    spamfilterDel(id: string): Promise<any>;
    nameBanList(params?: Record<string, any>): Promise<any>;
    nameBanGet(name: string): Promise<any>;
    nameBanAdd(name: string, options?: Record<string, any>): Promise<any>;
    nameBanDel(name: string): Promise<any>;
    rpcSetIssuer(issuer: string): Promise<any>;
    rpcInfo(): Promise<any>;
    rpcAddTimer(every: number, id: string, method: string, params?: Record<string, any>): Promise<any>;
    rpcDelTimer(id: string): Promise<any>;
    statsGet(params?: Record<string, any>): Promise<any>;
    logSend(level: string, subsystem: string, event_id: string, msg: string): Promise<any>;
    logList(params?: Record<string, any>): Promise<any>;
    logSubscribe(params?: Record<string, any>): Promise<any>;
    logUnsubscribe(): Promise<any>;
    whowasGet(nick: string, params?: Record<string, any>): Promise<any>;
}
