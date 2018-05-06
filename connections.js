const fetch = require("node-fetch")
const sleep = require("sleep").msleep

const { SLEEP_TIME } = require("./constants.js")

const getConnection = async (accessToken, region, id) => {
	const url = "https://" + region + ".api.battle.net/data/wow/connected-realm/"
		+ id
		+ "?namespace=dynamic-" + region
		+ "&access_token=" + accessToken

	sleep(SLEEP_TIME)

	const res = await fetch(url)
	const json = await res.json()
	if (!json.realms) return console.log("ERROR: response missing realms")

	return {
		id    : id,
		region: region.toUpperCase(),
		realms: json.realms.map(realm => realm.id),
	}
}

const getConnectionIDsForRegion = async (accessToken, region) => {
	const url = "https://" + region + ".api.battle.net/data/wow/connected-realm/"
		+ "?namespace=dynamic-" + region
		+ "&access_token=" + accessToken

	sleep(SLEEP_TIME)

	const res = await fetch(url)
	const json = await res.json()
	if (!json.connected_realms) return console.log("ERROR: response missing connected_realms")

	return json.connected_realms.map(connection => {
		const id = connection.href.replace(/.+\/connected-realm\/(\d+).*/, "$1")
		return parseInt(id, 10)
	})
}

const getConnectionsForRegion = async (accessToken, region) => {
	const list = []

	console.log(" ")
	console.log("Getting connection IDs for region", region)

	const ids = await getConnectionIDsForRegion(accessToken, region)

	console.log("   Found   :", ids.length)

	for (let j = 0; j < ids.length; j++) {
		const id = ids[j]

		console.log(" ")
		console.log("Getting info for connection", id)

		const item = await getConnection(accessToken, region, id)

		console.log("   Count :", item.realms.length)
		console.log("   Realms:", item.realms.join(", "))

		list.push(item)
	}

	console.log(" ")
	console.log("Got data for", list.length, "connections")

	return list
}

module.exports = getConnectionsForRegion
