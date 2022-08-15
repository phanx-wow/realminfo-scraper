const fs = require("fs")
const realmData = require("./output/realmData.json")
const connectionData = require("./output/connectionData.json")
const { timezones, ruleCodes } = require("./constants.js")

const sortById = (a, b) => a.id < b.id ? -1 : 1

const output = [
	"realmData = {",
]

console.log("Converting realm data...")

realmData.sort(sortById).forEach(realm => {
	let { id, englishName, locale, name, region, rules, timezone } = realm
	rules = ruleCodes[rules] || rules
	if (region === "US") {
		// [id] = "name,rules,locale,region,timezone"
		timezone = timezones[timezone] || timezone
		output.push(`[${id}]="${name},${rules},${locale},${region},${timezone}",`)
	} else if (englishName && englishName !== name) {
		// [id] = "name,rules,locale,region,englishName"
		output.push(`[${id}]="${name},${rules},${locale},${region},${englishName}",`)
	} else {
		// [id] = "name,rules,locale,region"
		output.push(`[${id}]="${name},${rules},${locale},${region}",`)
	}
})

console.log("Done.")

output.push("}")
output.push("")
output.push("connectionData = {")

console.log("Converting connection data...")

connectionData.sort(sortById).forEach(connection => {
	let { id, region, realms } = connection
	realms.sort((a, b) => a - b)
	realms = [...realms.filter(realmId => realmId === id), ...realms.filter(realmId => realmId !== id)]
	if (realms.length > 0) {
		output.push(`"${id},${region},${realms.join(",")}",`)
	}
})

output.push("}")

console.log("Done.")
console.log("Writing Lua file...")

fs.writeFileSync("output/data.lua", output.join("\n"))

console.log("Done.")
