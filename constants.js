exports.SLEEP_TIME = 12 // delay to enforce between API calls

exports.regions = [
	//"cn", // no API for China :(
	"eu",
	"kr",
	"tw",
	"us",
]

exports.timezones = {
	"America/Chicago": "CST", // US Central
	"America/Denver": "MST", // US Mountain
	"America/Los_Angeles": "PST", // US Pacific
	"America/New_York": "EST", // US Eastern
	"America/Sao_Paolo": "BRT", // Brazil
	"Asia/Seoul": "", // Korea
	"Asia/Taipei": "", // Hong Kong
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
