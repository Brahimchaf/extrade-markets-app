# ExTrade Markets

A free iOS app: live gold & forex prices, market news and daily analysis, in English and Arabic. Dark UI, no login. Built with Expo (React Native).

Data sources (all free, no API key):
- FX rates: frankfurter.app (ECB)
- Gold: gold-api.com
- News: public finance RSS feeds

## Build to the App Store without a Mac (Expo cloud)

1. Put this project in a GitHub repo.
2. Go to https://expo.dev → create a project, connect the GitHub repo.
3. In the project: **Credentials** → let Expo manage iOS credentials (sign in with your Apple ID).
4. **Builds** → New build → iOS → production. Expo compiles the .ipa on their Macs.
5. **Submit** → submit the build to App Store Connect (ascAppId is already set to 6834952874 in eas.json).

Or from a terminal with Node installed:
```
npm install -g eas-cli
npm install
eas login
eas build --platform ios --profile production
eas submit --platform ios --latest
```

## Run locally
```
npm install
npx expo start
```
