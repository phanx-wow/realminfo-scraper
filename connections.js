const fetch = require("node-fetch")
const sleep = require("sleep").msleep

const { SLEEP_TIME, apiDomains } = require("./constants.js")

const getConnection = async (requestOptions, region, id) => {
	sleep(SLEEP_TIME)

	const url = "https://" + apiDomains[region] + "/data/wow/connected-realm/" + id
	const res = await fetch(url, requestOptions)
	const json = await res.json()
	if (!json.realms) return console.log("ERROR: response missing realms:", json)

	return {
		id    : id,
		region: region.toUpperCase(),
		realms: json.realms.map(realm => realm.id),
	}
}

const getConnectionIDsForRegion = async (requestOptions, region) => {
	sleep(SLEEP_TIME)

	const url = "https://" + apiDomains[region] + "/data/wow/connected-realm/"
	const res = await fetch(url, requestOptions)
	const json = await res.json()
	if (!json.connected_realms) return console.log("ERROR: response missing connected_realms:", json)

	return json.connected_realms.map(connection => {
		const id = connection.href.replace(/.+\/connected-realm\/(\d+).*/, "$1")
		return parseInt(id, 10)
	})
}

const getConnectionsForRegion = async (accessToken, region) => {
	const list = []
	const requestOptions = {
		headers: {
			"Authorization": "Bearer " + accessToken,
			"Battlenet-Namespace": "dynamic-" + region,
		}
	}

	console.log(" ")
	console.log("Getting connection IDs for region", region)

	const ids = await getConnectionIDsForRegion(requestOptions, region)
	if (!ids) return

	console.log("   Found   :", ids.length)

	for (const id of ids) {
		console.log(" ")
		console.log("Getting info for connection", id)

		const item = await getConnection(requestOptions, region, id)

		console.log("   Count :", item.realms.length)
		console.log("   Realms:", item.realms.join(", "))

		list.push(item)
	}

	console.log(" ")
	console.log("Got data for", list.length, "connections")

	return list
}

module.exports = getConnectionsForRegion
