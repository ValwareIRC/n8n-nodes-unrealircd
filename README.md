# n8n-nodes-unrealircd

n8n community nodes for UnrealIRCd JSON-RPC API

## Features
- Manage UnrealIRCd users, channels, bans, spamfilters, logs, stats, and more
- Connect to UnrealIRCd via JSON-RPC
- Use in n8n workflows for IRC automation

## Screenshots
<img height="300" alt="image" src="https://github.com/user-attachments/assets/ded62700-a3c3-4bdd-8f26-478430da717a" />
<img height="300" alt="image" src="https://github.com/user-attachments/assets/56e4feef-928a-419d-a8db-f9341e8e5f64" />


## Installation

Install via n8n's community nodes UI with `n8n-nodes-unrealircd`

or with npm:

```bash
npm install n8n-nodes-unrealircd
```

## Usage

After installation, UnrealIRCd nodes will appear in n8n. Configure credentials and use the nodes in your workflows.

## Node List
- UnrealIRCdUser
- UnrealIRCdChannel
- UnrealIRCdBan
- UnrealIRCdSpamfilter
- UnrealIRCdLog
- UnrealIRCdStats
- UnrealIRCdServer
- UnrealIRCdRpc
- ...and their Tool variants

## Icon
All nodes use the UnrealIRCd logo (`unrealircd.svg`).

## Development

Build the package:
```bash
npm run build
```

Publish to npm:
```bash
npm publish
```

## Repository
[GitHub](https://github.com/unrealircd/n8n-nodes-unrealircd)

## License
GPLv3 or later

## Support
For help, see:

- [UnrealIRCd Docs](https://www.unrealircd.org/docs/Main_Page)
- [UnrealIRCd Forums](https://forums.unrealircd.org/)
- Ask Valware in #unreal-support on irc.unrealircd.org
