# Example: the SEC Innovation Exemption (1:53)

A news explainer made with this skill on 26 Sep 2026: what the SEC's 17 Sep 2026 order allows, what it means for blockchains, and what it means for DeFi protocols.

## The brief given to the skill

These were the inputs at the interview step. Giving the same brief to the skill will produce a similar video, not an identical one, because the script is written fresh each time. To reproduce this exact video, render the files in this folder.

- **Topic:** a focus on the SEC Innovation Exemption: its main features; what it means for Ethereum and other chains, including permissioned ones like Tempo; what it means for DeFi protocols, in particular Uniswap v4 and Aave v4.
- **Audience:** mixed, at a talk on tokenized equity and bonds: finance people and crypto builders.
- **Length and format:** about 2 minutes, 16:9, English, captions on.
- **Voice:** macOS Matilda (Premium) at rate 190.
- **Research:** facts checked against the SEC order itself and law-firm memos, dated late September 2026.

## Reproduce it

```bash
S=../../scripts
python3 $S/make_audio.py .      # needs the macOS voice "Matilda (Premium)"; otherwise edit voice.json
node $S/render.js . sheet       # every scene on one image: previews/sheet.png
node $S/render.js . full        # out/sec-innovation-exemption.mp4
```

With a different voice the timing changes, and the drawings follow it automatically because every stroke is timed against the spoken lines.

## Facts and sources

- **Order:** SEC Release 34-106402, 17 Sep 2026 (press release 2026-90). Venues ("Tokenized Securities Venues") may trade tokenized NMS stocks through AMM pools without registering as an exchange; liquidity providers are exempt from the dealer definition. Five years, to 17 Sep 2031. Checked against Sullivan & Cromwell, Sidley and Cooley memos.
- **Rules:** same rights as the underlying share (dividends, votes); synthetic and derivative tokens excluded; issuers get 30 days' notice and can block third-party tokens; Tier 1 up to 75 symbols at 0.25% of prior-month volume, Tier 2 up to 250 symbols at 2.5%; halts with the listing exchange; trades reported within 10 minutes; venues cannot borrow, hypothecate or extend credit. Order pp. 25-33; Cooley, 22 Sep 2026.
- **Retail:** participants may include "retail investors (i.e., natural persons)", access limited to verified participants. Order p. 16.
- **Chains:** smart contracts must be "auditable, public, and deployed on a public, permissionless distributed ledger", defined as one anyone can read or write to without authorization. The order does not mention L2s or sequencers; staff can be asked whether a chain qualifies. Order p. 18 and fn 54-55; Sidley.
- **Tempo:** mainnet since 18 Mar 2026, permissioned validators (Stripe, Visa and others), anyone can deploy contracts (tempo.xyz FAQ). Whether it qualifies is not addressed by the order or by any commentary found; the video calls it a grey zone.
- **Private ledgers:** fail the "anyone can read or write" test on its face. This is an inference from the order text, stated as such in the research.
- **Uniswap v4:** Permissioned Pools launched 23 Jul 2026, with an issuer-managed allowlist checked on every swap and liquidity action; partners Superstate, Securitize, Dowgo (Uniswap blog; The Defiant; crypto.news). UNI rose about 30% after the order (CoinMarketCap 18 Sep; Cointelegraph 23 Sep; some outlets report 20-21%). The order names no platform and requires a US operator (MoFo).
- **Aave v4:** live on Ethereum since 30 Mar 2026; Equities Hub on Base opened 25 Sep 2026 with seven Coinbase tokenized stocks as collateral for USDC loans, non-US users only (The Block; crypto.news; Cryptotimes). Lending is outside the exemption, which bars venues from extending credit.
- **Not used:** the Hayden Adams quote (single source) and ETH/BTC price moves (sources conflict).
