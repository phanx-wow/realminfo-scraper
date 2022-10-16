const fetch = require("node-fetch")
const jsonfile = require("jsonfile")
const fs = require("fs")

const { SLEEP_TIME, apiDomains, localesInGame, localesWithUnderscores } = require("./constants.js")

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const getRealm = async (requestOptions, region, id) => {
	const filename = `cache/realm-${region}-${id}.json`

	// Get JSON file from cache
	if (fs.existsSync(filename)) {
		return jsonfile.readFileSync(filename)
	}

	// Fetch new realm data
	await sleep(SLEEP_TIME)

	const url = "https://" + apiDomains[region] + "/data/wow/realm/" + id
	const res = await fetch(url, requestOptions)
	const realm = await res.json()
	if (!realm.name) return console.log("ERROR: response missing name:", json)

	const locale = localesInGame[realm.locale] || realm.locale

	const realmData = {
		id          : id,
		englishName : realm.name.en_US,
		locale      : locale,
		name        : realm.name[ localesWithUnderscores[locale] ],
		region      : region.toUpperCase(),
		rules       : realm.type.name.en_US,
		timezone    : realm.timezone,
	}

	jsonfile.writeFileSync(filename, realmData, { spaces: "\t" }, (err) => console.error(err))

	return realmData
}

const getRealmIDsForRegion = async (requestOptions, region) => {
	const url = "https://" + apiDomains[region] + "/data/wow/realm/index"

	await sleep(SLEEP_TIME)

	const res = await fetch(url, requestOptions)
	const json = await res.json()
	if (!json.realms) return console.log("ERROR: response missing realms:", json, res.code)

	return json.realms.map(realm => realm.id)
}

const getRealmsForRegion = async (accessToken, region, namespace) => {
	const list = []
	const requestOptions = {
		headers: {
			"Authorization": "Bearer " + accessToken,
			"Battlenet-Namespace": namespace + "-" + region,
		}
	}

	console.log(" ")
	console.log("Getting realm IDs for region", region, namespace)

	const ids = await getRealmIDsForRegion(requestOptions, region)
	if (!ids) return

	console.log("   Realms:", ids.length)

	for (const id of ids) {
		console.log(" ")
		console.log("Getting info for realm", id)

		let item = null;
		for (let tries = 1; tries <= 3; tries++) {
			try {
				item = await getRealm(requestOptions, region, id)
				break
			} catch (e) {
				console.warn("Failed to get realm info. Retrying.")
			}
		}

		if (item) {
			console.log("   Name    :", item.name)
			console.log("   English :", item.englishName)
			console.log("   Rules   :", item.rules)
			console.log("   Locale  :", item.locale)
			console.log("   Region  :", item.region)
			console.log("   Timezone:", item.timezone)

			list.push(item)
		} else {
			console.error("Failed to get realm info. Giving up.")
		}
	}

	console.log(" ")
	console.log("Got data for", list.length, "realms")

	return list
}

module.exports = getRealmsForRegion
