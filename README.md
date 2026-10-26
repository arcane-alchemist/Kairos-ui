# POAP — A little proof of life

A frontend-only, unofficial POAP concept. Awwwards inspired art direction with a real Three.js medal, original SVG collectible artwork, and an Anatomy-kit isometric memory press.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` generates the deployable `dist/` folder and a self-contained `poap.html` you can open directly in a browser. `npm test` checks artwork and press geometry.

Includes responsive layouts, working category filters, collectible details, favorites saved in localStorage, an event badge preview, drag/keyboard medal controls, animation pause, and reduced-motion support. The medal gracefully falls back to SVG if WebGL is unavailable.

## Four frontend areas

- About: Proof of Protocol and illustrative Case Studies.
- Issuer: a complete “How POAP works” organizer guide.
- Collector: searchable Gallery, Collectors directory, and Collection with attended/organized views, event images, and badge artwork.
- Builders: a customized SBT POAP designer, event image upload, local draft listing, metadata download, and organizer/integration Documentation.

**This project is only for Sepolia testnet: chain ID `11155111` (`0xaa36a7`).** No mainnet, other EVM network, or Solana workflow is included. Phantom means its Ethereum account.

This remains frontend-only: there is no backend, contract, blockchain SDK, deployment, minting, real authentication, or live event inventory. The default MetaMask/Phantom flow is a clearly marked preview: choose role → preview connection → preview signature → example collection. It never calls a wallet provider. Example addresses are placeholders, not real sign-ins. All six initial events and three profiles are fictional fixtures.

Drafts, preview sessions, and uploaded images stay in page memory and disappear on refresh. A draft is not a published event or minted SBT. Only saved artwork favorites use localStorage. Google Fonts needs an internet connection; the site has local font fallbacks.

## Integrate into your existing VS Code project

Copy `src/`, `public/`, `vendor/anatomy/`, and the relevant markup from `index.html` into your existing frontend. The implementation uses plain JavaScript, CSS, and Three.js; it does not require React or a backend framework. `src/platform.js` contains the four areas, `src/platform.css` their styles, and `src/platform-data.js` the sample data and draft helpers. Keep your existing contracts, RPC configuration, wallet SDK, authentication, and event APIs.

The call at the end of `src/main.js` accepts `window.poapFrontendConfig`. Alternatively, import `mountPlatform` and pass your existing project functions directly:

```js
import { mountPlatform } from './platform.js';

const frontend = mountPlatform({
  // Implement these using your project's existing wallet/authentication code.
  connectWallet: async ({ wallet, role, chainId }) => {
    const session = await yourExistingWalletSignIn({ wallet, role, chainId });
    return {
      address: session.address,
      chainId: session.chainId, // Must be 11155111.
      signed: session.signatureVerified === true
    };
  },
  disconnectWallet: async () => yourExistingSignOut(),
  events: yourEventRecords,
  people: yourPublicCollectorProfiles
});

// Call this on account/network change, session expiry, or auth failure.
frontend.clearSession();

document.addEventListener('poap:draft-created', ({ detail: draft }) => {
  // Show your existing publish/confirmation flow using this draft.
  // This event itself does not publish, issue, or send a transaction.
  console.log(draft);
});
```

The functions beginning with `yourExisting` and the supplied record variables are placeholders for your existing project, not functions provided by this frontend. Mount the platform only once. If using the existing `src/main.js`, set `window.poapFrontendConfig` before that module executes instead of calling `mountPlatform` a second time.

The adapter result must contain a valid Ethereum address, Sepolia chain ID, and `signed: true`. UI checks are not security boundaries. Your existing backend must issue and verify one-time sign-in challenges, enforce permissions, and expire/revoke sessions; your contract must enforce SBT non-transferability and attendance/issuance rules. Role selection does not prove organizer authority. Never request seed phrases, HD-wallet secrets, or private keys.

Event view model:

```js
{
  id: 'your-event-id', title: 'Your event', description: 'The event story',
  date: '2026-11-03', location: 'Your venue',
  organizer: '0x…', // The verified organizer address.
  event: 'YOUR ORGANIZER OR SERIES', category: 'community',
  kind: 'flower', // flower | planet | sun | eye | music | heart
  color: 'lavender', // lavender | peach | lime | pink | blue | butter
  image: 'https://your-cdn.example/event.jpg', // Optional event cover.
  chainId: 11155111
}
```

Public profile view model: `{ name, handle, address, initials, color, bio, events: ['event-id'] }`. These `events` IDs provide the attended-event view; `event.organizer` provides the organized-event view. Populate both from verified backend records. Do not pass private attendee details into the public directory.

The UI retains sample-data notices until you adapt the copy to your integrated data source. It does not infer real token ownership or manufacture contract/transaction links. Draft metadata contains the event name, description, image, date, location, Sepolia chain ID, and intended soulbound policy. Those fields do not enforce onchain behavior.

## Checks

`npm test` covers navigation, search, event details, both wallet preview steps, organizer drafts, input/image safety, wallet integration rejection states, and the original artwork/collection flows. `npm run build` produces `dist/` and the directly openable `poap.html`. Browser visual verification is environment-dependent; DOM tests do not verify layout or real wallet behavior.

`vendor/anatomy/` contains the MIT-licensed Anatomy geometry toolkit from the installed anatomy skill. The original toolkit is preserved. The press uses its solid geometry, four-tone shading, face typography, knurling, and projection rather than a flat imitation.
