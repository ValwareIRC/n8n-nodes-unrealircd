"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnrealIRCdJsonRpc = void 0;
class UnrealIRCdJsonRpc {
    constructor(credentials, redactionOptions, executeFunctions) {
        this.credentials = credentials;
        this.redactionOptions = redactionOptions;
        this.executeFunctions = executeFunctions;
    }
    redactData(data) {
        if (!this.redactionOptions.redactSensitiveData) {
            return data;
        }
        const dataStr = JSON.stringify(data);
        let redactedStr = dataStr;
        if (this.redactionOptions.redactIPs) {
            redactedStr = redactedStr.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, '[REDACTED_IP]');
            redactedStr = redactedStr.replace(/\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g, '[REDACTED_IPv6]');
        }
        if (this.redactionOptions.redactEmails) {
            redactedStr = redactedStr.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');
        }
        if (this.redactionOptions.redactPasswords) {
            redactedStr = redactedStr.replace(/"password"\s*:\s*"[^"]*"/gi, '"password":"[REDACTED]"');
        }
        this.redactionOptions.customRedactionPatterns.forEach(pattern => {
            try {
                const regex = new RegExp(pattern, 'gi');
                redactedStr = redactedStr.replace(regex, '[REDACTED_CUSTOM]');
            }
            catch (error) {
            }
        });
        try {
            return JSON.parse(redactedStr);
        }
        catch {
            return redactedStr;
        }
    }
    async makeRequest(method, params = {}) {
    const baseUrl = this.credentials.host;
        const requestId = Math.floor(Math.random() * 1000000);
        const requestBody = {
            jsonrpc: '2.0',
            method,
            params,
            id: requestId
        };
        try {
            const options = {
                method: 'POST',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
                auth: {
                    username: this.credentials.username,
                    password: this.credentials.password,
                },
                ignoreHttpStatusErrors: true,
                rejectUnauthorized: !this.credentials.allowSelfSigned,
                allowUnauthorizedCerts: !!this.credentials.allowSelfSigned,
            };
            const response = await this.executeFunctions.helpers.httpRequest(options);
            if (response.error) {
                throw new Error(`JSON-RPC Error ${response.error.code}: ${response.error.message}`);
            }
            return this.redactData(response.result || response);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                method,
                params,
                error: error instanceof Error ? error.message : String(error),
                credentials: {
                    host: this.credentials.host
                }
            };
            return this.redactData(errorResponse);
        }
    }
    async userList(params = {}) {
        return this.makeRequest('user.list', params);
    }
    async userGet(nick, params = {}) {
        return this.makeRequest('user.get', { nick, ...params });
    }
    async userSetNick(nick, newnick, force = false) {
        return this.makeRequest('user.set_nick', { nick, newnick, force });
    }
    async userSetUsername(nick, username) {
        return this.makeRequest('user.set_username', { nick, username });
    }
    async userSetRealname(nick, realname) {
        return this.makeRequest('user.set_realname', { nick, realname });
    }
    async userSetVhost(nick, vhost) {
        return this.makeRequest('user.set_vhost', { nick, vhost });
    }
    async userSetMode(nick, modes, hidden = false) {
        return this.makeRequest('user.set_mode', { nick, modes, hidden });
    }
    async userSetSnomask(nick, snomask, hidden = false) {
        return this.makeRequest('user.set_snomask', { nick, snomask, hidden });
    }
    async userSetOper(nick, operAccount, operClass, options = {}) {
        return this.makeRequest('user.set_oper', { nick, oper_account: operAccount, oper_class: operClass, ...options });
    }
    async userJoin(nick, channel, key, force = false) {
        const params = { nick, channel, force };
        if (key)
            params.key = key;
        return this.makeRequest('user.join', params);
    }
    async userPart(nick, channel, force = false) {
        return this.makeRequest('user.part', { nick, channel, force });
    }
    async userKill(nick, reason) {
        return this.makeRequest('user.kill', { nick, reason });
    }
    async userQuit(nick, reason) {
        return this.makeRequest('user.quit', { nick, reason });
    }
    async channelList(params = {}) {
        return this.makeRequest('channel.list', params);
    }
    async channelGet(channel, params = {}) {
        return this.makeRequest('channel.get', { channel, ...params });
    }
    async channelSetMode(channel, modes, parameters) {
        return this.makeRequest('channel.set_mode', { channel, modes, parameters });
    }
    async channelSetTopic(channel, topic, setBy, setAt) {
        const params = { channel, topic };
        if (setBy)
            params.set_by = setBy;
        if (setAt)
            params.set_at = setAt;
        return this.makeRequest('channel.set_topic', params);
    }
    async channelKick(channel, nick, reason) {
        return this.makeRequest('channel.kick', { channel, nick, reason });
    }
    async serverList(params = {}) {
        return this.makeRequest('server.list', params);
    }
    async serverGet(name, params = {}) {
        return this.makeRequest('server.get', { name, ...params });
    }
    async serverRehash() {
        return this.makeRequest('server.rehash', {});
    }
    async serverConnect(server) {
        return this.makeRequest('server.connect', { server });
    }
    async serverDisconnect(server, reason) {
        const params = { server };
        if (reason)
            params.reason = reason;
        return this.makeRequest('server.disconnect', params);
    }
    async serverBanList(params = {}) {
        return this.makeRequest('server_ban.list', params);
    }
    async serverBanGet(name, type) {
        return this.makeRequest('server_ban.get', { name, type });
    }
    async serverBanAdd(name, type, options = {}) {
        return this.makeRequest('server_ban.add', { name, type, ...options });
    }
    async serverBanDel(name, type) {
        return this.makeRequest('server_ban.del', { name, type });
    }
    async serverBanExceptionList(params = {}) {
        return this.makeRequest('server_ban_exception.list', params);
    }
    async serverBanExceptionGet(name, type) {
        return this.makeRequest('server_ban_exception.get', { name, type });
    }
    async serverBanExceptionAdd(name, type, options = {}) {
        return this.makeRequest('server_ban_exception.add', { name, type, ...options });
    }
    async serverBanExceptionDel(name, type) {
        return this.makeRequest('server_ban_exception.del', { name, type });
    }
    async spamfilterList(params = {}) {
        return this.makeRequest('spamfilter.list', params);
    }
    async spamfilterGet(id) {
        return this.makeRequest('spamfilter.get', { id });
    }
    async spamfilterAdd(match, target, action, options = {}) {
        return this.makeRequest('spamfilter.add', { match, target, action, ...options });
    }
    async spamfilterDel(id) {
        return this.makeRequest('spamfilter.del', { id });
    }
    async nameBanList(params = {}) {
        return this.makeRequest('name_ban.list', params);
    }
    async nameBanGet(name) {
        return this.makeRequest('name_ban.get', { name });
    }
    async nameBanAdd(name, options = {}) {
        return this.makeRequest('name_ban.add', { name, ...options });
    }
    async nameBanDel(name) {
        return this.makeRequest('name_ban.del', { name });
    }
    async rpcSetIssuer(issuer) {
        return this.makeRequest('rpc.set_issuer', { issuer });
    }
    async rpcInfo() {
        return this.makeRequest('rpc.info', {});
    }
    async rpcAddTimer(every, id, method, params = {}) {
        return this.makeRequest('rpc.add_timer', { every, id, method, params });
    }
    async rpcDelTimer(id) {
        return this.makeRequest('rpc.del_timer', { id });
    }
    async statsGet(params = {}) {
        return this.makeRequest('stats.get', params);
    }
    async logSend(level, subsystem, event_id, msg) {
        return this.makeRequest('log.send', { level, subsystem, event_id, msg });
    }
    async logList(params = {}) {
        return this.makeRequest('log.list', params);
    }
    async logSubscribe(params = {}) {
        return this.makeRequest('log.subscribe', params);
    }
    async logUnsubscribe() {
        return this.makeRequest('log.unsubscribe', {});
    }
    async whowasGet(nick, params = {}) {
        return this.makeRequest('whowas.get', { nick, ...params });
    }
}
exports.UnrealIRCdJsonRpc = UnrealIRCdJsonRpc;
//# sourceMappingURL=UnrealIRCdJsonRpc.js.map