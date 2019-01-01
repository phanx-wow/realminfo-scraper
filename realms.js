const fetch = require("node-fetch")
const sleep = require("sleep").msleep

const { SLEEP_TIME, apiDomains, localesInGame, localesWithUnderscores, timezones } = require("./constants.js")

const getRealm = async (requestOptions, region, id) => {
	sleep(SLEEP_TIME)

	const url = "https://" + apiDomains[region] + "/data/wow/realm/" + id
	const res = await fetch(url, requestOptions)
	const realm = await res.json()
	if (!realm.name) return console.log("ERROR: response missing name:", json)

	const locale = localesInGame[realm.locale] || realm.locale

	return {
		id          : id,
		englishName : realm.name.en_US,
		locale      : locale,
		name        : realm.name[ localesWithUnderscores[locale] ],
		region      : region.toUpperCase(),
		rules       : realm.type.name.en_US,
		timezone    : timezones[realm.timezone],
	}
}

const getRealmIDsForRegion = async (requestOptions, region) => {
	const url = "https://" + apiDomains[region] + "/data/wow/realm/"

	sleep(SLEEP_TIME)

	const res = await fetch(url, requestOptions)
	const json = await res.json()
	if (!json.realms) return console.log("ERROR: response missing realms:", json)

	return json.realms.map(realm => realm.id)
}

const getRealmsForRegion = async (accessToken, region) => {
	const list = []
	const requestOptions = {
		headers: {
			"Authorization": "Bearer " + accessToken,
			"Battlenet-Namespace": "dynamic-" + region,
		}
	}

	console.log(" ")
	console.log("Getting realm IDs for region", region)

	const ids = await getRealmIDsForRegion(requestOptions, region)
	if (!ids) return

	console.log("   Realms:", ids.length)

	for (const id of ids) {
		console.log(" ")
		console.log("Getting info for realm", id)

		const item = await getRealm(requestOptions, region, id)

		console.log("   Name    :", item.name)
		console.log("   English :", item.englishName)
		console.log("   Rules   :", item.rules)
		console.log("   Locale  :", item.locale)
		console.log("   Region  :", item.region)
		console.log("   Timezone:", item.timezone)

		list.push(item)
	}

	console.log(" ")
	console.log("Got data for", list.length, "realms")

	return list
}

module.exports = getRealmsForRegion
