const fetch = require("node-fetch")
const sleep = require("sleep").msleep

const { SLEEP_TIME, localesInGame, localesWithUnderscores, timezones } = require("./constants.js")

const getRealm = async (accessToken, region, id) => {
	const url = "https://" + region + ".api.battle.net/data/wow/realm/"
		+ id
		+ "?namespace=dynamic-" + region
		+ "&access_token=" + accessToken

	sleep(SLEEP_TIME)

	const res = await fetch(url)
	const realm = await res.json()
	if (!realm.name) return console.log("ERROR: response missing name")

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

const getRealmIDsForRegion = async (accessToken, region) => {
	const url = "https://" + region + ".api.battle.net/data/wow/realm/"
		+ "?namespace=dynamic-" + region
		+ "&access_token=" + accessToken

	sleep(SLEEP_TIME)

	const res = await fetch(url)
	const json = await res.json()
	if (!json.realms) return console.log("ERROR: response missing realms")

	return json.realms.map(realm => realm.id)
}

const getRealmsForRegion = async (accessToken, region) => {
	const list = []

	console.log(" ")
	console.log("Getting realm IDs for region", region)

	const ids = await getRealmIDsForRegion(accessToken, region)

	console.log("   Realms:", ids.length)

	for (let j = 0; j < ids.length; j++) {
		const id = ids[j]

		console.log(" ")
		console.log("Getting info for realm", id)

		const item = await getRealm(accessToken, region, id)

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
