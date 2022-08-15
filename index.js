// Import third-party dependencies
require("dotenv").config()
const fetch = require("node-fetch")
const jsonfile = require("jsonfile")
const fs = require("fs")
const path = require("path")

// Import local dependencies
const { authDomains, authRegions, regions, namespaces } = require("./constants")
const getConnectionsForRegion = require("./connections")
const getRealmsForRegion = require("./realms")

// Verify API user credentials are present
const apiKey = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
if (!apiKey) return console.log("ERROR: missing CLIENT_ID in .env")
if (!clientSecret) return console.log("ERROR: missing CLIENT_SECRET in .env")

// Create output directory
const createOutputDir = async () => {
	if (!await fs.existsSync("output")) {
		await fs.mkdirSync("output")
	}
}

// Create cache directory
const createCacheDir = async () => {
	if (!await fs.existsSync("cache")) {
		await fs.mkdirSync("cache")
	}
}

// Get valid API access tokens for US and China
const checkAccessToken = async (region, token) => {
	const url = "https://" + authDomains[region] + "/oauth/check_token?token=" + token
	const res = await fetch(url)
	const json = await res.json()
	return !json.error
}

const getAccessToken = async (region) => {
	const url = "https://" + apiKey + ":" + clientSecret + "@" + authDomains[region] + "/oauth/token"

	const params = new URLSearchParams()
	params.append('grant_type', 'client_credentials')

	const res = await fetch(url, {
		method: 'POST',
		body: params
	})

	const json = await res.json()
	if (json.error) return console.error("ERROR: error getting access token: " + json.error)
	return json.access_token
}

const getAccessTokens = async () => {
	let cached
	try {
		cached = jsonfile.readFileSync("cache/accessToken.json", { throws: false })
	} catch(e) {
		// File not yet created
	}
	const tokens = {}

	const uniqueRegions = [...new Set(Object.values(authRegions))]
	for (const region of uniqueRegions) {
		if (cached && cached[region]) {
			const ok = await checkAccessToken(region, cached[region])
			if (ok) tokens[region] = cached[region]
		}
		if (!tokens[region]) {
			tokens[region] = await getAccessToken(region)
		}
	}

	jsonfile.writeFileSync("cache/accessToken.json", tokens)
	return tokens
}

// Get an array listing all connected realm groups from all regions
const getConnections = async (accessTokens, namespace) => {
	const connections = []

	console.log(" ")
	console.log("Getting data for all connections...")

	for (const region of regions) {
		const authRegion = authRegions[region]
		const accessToken = accessTokens[authRegion]
		const regionConnections = await getConnectionsForRegion(accessToken, region, namespace)
		if (regionConnections) regionConnections.forEach(connection => connections.push(connection))
	}

	console.log(" ")
	console.log("Done.")

	return connections
}

// Get an array listing all realms from all regions
const getRealms = async (accessTokens, namespace) => {
	const realms = []

	console.log(" ")
	console.log("Getting data for all realms...")

	for (const region of regions) {
		const authRegion = authRegions[region]
		const accessToken = accessTokens[authRegion]
		const regionRealms = await getRealmsForRegion(accessToken, region, namespace)
		if (regionRealms) regionRealms.forEach(realm => realms.push(realm))
	}

	console.log(" ")
	console.log("Done.")

	return realms
}

// Write an object to a file as JSON
const writeJSON = (filename, data) => {
	console.log(" ")
	console.log("Writing data to file", filename)

	jsonfile.writeFileSync(filename, data, { spaces: "\t" }, (err) => console.error(err))

	console.log("Done.")
}

// Go
async function main () {
	console.log(" ")
	console.log("API Key     :", apiKey)
	console.log("API Secret  :", clientSecret ? "OK" : "MISSING")

	await createOutputDir()
	await createCacheDir()

	try {
		const accessTokens = await getAccessTokens()
		console.log("Access Tokens:", accessTokens)

		let realmData = []
		let connectionData = []

		for (let namespace of Object.keys(namespaces)) {
			const namespaceRealmData = await getRealms(accessTokens, namespace)
			if (!namespaceRealmData) return console.log(`ERROR: getRealms returned nothing for namespace ${namespace}`)

			const namespaceConnectionData = await getConnections(accessTokens, namespace)
			if (!namespaceConnectionData) return console.log(`ERROR: getConnections returned nothing for namespace ${namespace}`)

			realmData = realmData.concat(namespaceRealmData)
			connectionData = connectionData.concat(namespaceConnectionData)
		}

		// The API for Chinese realms is not implemented: use static data instead.
		realmData = realmData.concat(require("./data/realms-cn.json"))
		connectionData = connectionData.concat(require("./data/connections-cn.json"))

		writeJSON(`output/realmData.json`, realmData)
		writeJSON(`output/connectionData.json`, connectionData)
	} catch (e) {
		console.error(e)
	}

	console.log(" ")
}

main()
