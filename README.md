# n8n-nodes-unrealircd

n8n community nodes for UnrealIRCd JSON-RPC API

## Features
- Manage UnrealIRCd users, channels, bans, spamfilters, logs, stats, and more
- Connect to UnrealIRCd via JSON-RPC
- Use in n8n workflows for IRC automation

## Installation

Install via n8n's community nodes UI or with npm:

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
MIT

## Support
For help, visit [UnrealIRCd Community](https://www.unrealircd.org/) or email support@unrealircd.org.
