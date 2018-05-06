// Import third-party dependencies
require("dotenv").config()
const fetch = require("node-fetch")
const jsonfile = require("jsonfile")

// Import local dependencies 
const { regions } = require("./constants")
const getConnectionsForRegion = require("./connections")
const getRealmsForRegion = require("./realms")

// Verify API user credentials are present
const apiKey = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
if (!apiKey) return console.log("ERROR: missing CLIENT_ID in .env")
if (!clientSecret) return console.log("ERROR: missing CLIENT_SECRET in .env")

// Get a valid API access token
const getAccessToken = async () => {
	const cached = jsonfile.readFileSync("output/accessToken.json", { throws: false })
	if (cached && cached.access_token) {
		const url = "https://us.battle.net/oauth/check_token?token=" + cached.access_token
		const res = await fetch(url)
		const json = await res.json()
		if (!json.error) return cached.access_token
	}

	// tokens are region independent, so the subdomain here doesn't matter
	const url = "https://us.battle.net/oauth/token"
		+ "?grant_type=client_credentials"
		+ "&client_id=" + apiKey
		+ "&client_secret=" + clientSecret

	const res = await fetch(url)
	const json = await res.json()
	if (json.error) return console.error("ERROR: error getting access token: " + json.error)

	jsonfile.writeFileSync("output/accessToken.json", json)
	return json.access_token
}

// Get an array listing all connected realm groups from all regions
const getConnections = async (accessToken) => {
	const connections = []

	console.log(" ")
	console.log("Getting data for all connections...")

	for (let i = 0; i < regions.length; i++) {
		const region = regions[i]
		const regionConnections = await getConnectionsForRegion(accessToken, region)
		regionConnections.forEach(connection => connections.push(connection))
	}

	console.log(" ")
	console.log("Done.")

	return connections
}

// Get an array listing all realms from all regions
const getRealms = async (accessToken) => {
	const realms = []

	console.log(" ")
	console.log("Getting data for all realms...")

	for (let i = 0; i < regions.length; i++) {
		const region = regions[i]
		const regionRealms = await getRealmsForRegion(accessToken, region)
		regionRealms.forEach(realm => realms.push(realm))
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

	const accessToken = await getAccessToken()
	console.log("Access Token:", accessToken)

	const realmData = await getRealms(accessToken)
	if (!realmData) return console.log("ERROR: getRealms returned nothing")
	writeJSON("output/realmData.json", realmData)

	const connectionData = await getConnections(accessToken)
	if (!connectionData) return console.log("ERROR: getRealms returned nothing")
	writeJSON("output/connectionData.json", connectionData)

	console.log(" ")
}

main()
