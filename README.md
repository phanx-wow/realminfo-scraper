This is a tool to scrape data from the Battle.net Developer API for use in the [LibRealmInfo](https://github.com/phanx-wow/LibRealmInfo) library for World of Warcraft.

### Usage

1. Run `yarn start` or `npm start` or `node index.js`
2. See the generated `connectionData.json` and `realmData.json` files

Total running time is over 5 minutes, as a delay of 12 ms is enforced between API calls in order to comply with the "100 requests per second" limit.

### Future

- Convert the output to a format directly usable in LibResInfo

### Requirements

1. [Install Node.js](https://nodejs.org/)
2. Optionally, [install Yarn](https://yarnpkg.com/lang/en/docs/install/)
2. [Get a Battle.net API Key](https://dev.battle.net/member/register)
3. Run `yarn install` or `npm install`
4. Create a `.env` file:
   ```
	CLIENT_ID=<your Battle.net key>
	CLIENT_SECRET=<your Battle.net secret>
	```
