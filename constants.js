exports.SLEEP_TIME = 15 // delay to enforce between API calls

exports.regions = [
	// "cn", // CN API is not implemented. Will be using static data instead
	"eu",
	"kr",
	"tw",
	"us",
]

exports.apiDomains = {
	cn: "gateway.battlenet.com.cn",
	eu: "eu.api.blizzard.com",
	kr: "kr.api.blizzard.com",
	tw: "tw.api.blizzard.com",
	us: "us.api.blizzard.com",
}

exports.authDomains = {
	cn: "www.battlenet.com.cn",
	eu: "us.battle.net",
	kr: "us.battle.net",
	tw: "us.battle.net",
	us: "us.battle.net",
}

exports.authRegions = {
	cn: "cn",
	eu: "us",
	kr: "us",
	tw: "us",
	us: "us",
},

exports.namespaces = {
	'dynamic': '',
	'dynamic-classic1x': 'classic1x',
	'dynamic-classic': 'classic',
},

exports.ruleCodes = {
	'Roleplaying': 'RP',
	'Normal': 'PvE',
	'PvP': 'PvP',
	'PvP RP': 'PvP RP',
},

exports.timezones = {
	"America/Chicago": "CST", // US Central
	"America/Denver": "MST", // US Mountain
	"America/Los_Angeles": "PST", // US Pacific
	"America/New_York": "EST", // US Eastern
	"America/Sao_Paulo": "BRT", // Brazil
	"Asia/Seoul": "", // Korea
	"Asia/Taipei": "", // Taiwan
	"Australia/Melbourne": "AEST", // Oceanic
	"Europe/Paris": "", // EU Central
}

exports.localesInGame = {
	"enGB": "enUS", // EU English servers report enUS
	"ptPT": "ptBR", // EU Portuguese servers report ptBR
}

exports.localesWithUnderscores = {
	"deDE": "de_DE",
	"enGB": "en_GB",
	"enUS": "en_US",
	"esES": "es_ES",
	"esMX": "es_MX",
	"frFR": "fr_FR",
	"itIT": "it_IT",
	"koKR": "ko_KR",
	"ptBR": "pt_BR",
	"ptPT": "pt_PT",
	"ruRU": "ru_RU",
	"zhCN": "zh_CN",
	"zhTW": "zh_TW",
}
