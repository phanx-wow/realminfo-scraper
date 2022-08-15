This is a tool to scrape World of Warcraft realm and realm-connection data from the Blizzard Developer API, primarily for use in the [LibRealmInfo](https://github.com/phanx-wow/LibRealmInfo) library.

## Usage

1. Run `yarn start` or `npm start` or `node index.js`.
2. See the generated `connectionData.json` and `realmData.json` files in the `output` directory.

Total running time is over 8 minutes, as a delay of 250 ms is enforced between API calls in order to comply with the "100 requests per second" limit for free accounts.

In case of failure (ie due to a timeout error), the script will stop. However, the already fetched data is stored in the `cache` folder so you should be able to relaunch it and resume the process.

### For use in LibRealmInfo

1. Run `yarn convert` or `npm convert` or `node convert.js`.
2. See the generated `data.lua` file in the `output` directory.

## Requirements

1. [Install Node.js](https://nodejs.org/)
2. Optionally, [install Yarn](https://yarnpkg.com/lang/en/docs/install/)
2. [Get a Blizzard API Key](https://develop.battle.net/documentation/guides/getting-started)
3. Run `yarn install` or `npm install`
4. Create a `.env` file:
   ```
	CLIENT_ID=<your Blizzard API key>
	CLIENT_SECRET=<your Blizzard API secret>
	```

## Known issues

The realms API doesn't seem to be implemented for China since it only returns HTTP 403 Forbidden errors. Chinese server information was set manually under the `data` folder and probably needs to be updated.

## License

Zlib license. See the `LICENSE` file for the full text.
