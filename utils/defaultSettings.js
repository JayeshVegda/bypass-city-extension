// Default settings and known ad domains
// Based on bypass.city userscript supported sites

const KNOWN_AD_DOMAINS = [
  // Linkvertise and variants
  "linkvertise.com", "linkvertise.net", "link-to.net",
  // Sub services
  "sub2get.com", "sub1s.com", "subtolink.com", "subfinal.com",
  "sub2unlock.com", "sub2unlock.net", "unlocknow.net",
  // Loot link variants
  "lootlinks.com", "loot-links.com", "loot-link.com",
  "lootdest.com", "links-loot.com", "linksloot.com", "lootlink.com",
  // Ad focus services
  "adfoc.us", "adshnk.com", "adshrink.it",
  // Boost services
  "boost.ink", "bst.gg", "bst.wtf", "booo.st",
  "boostfusedgt.com", "boost.fusedgt.com",
  "leasurepartment.xyz", "letsboost.net", "mboost.me",
  // URL shorteners
  "rekonise.com", "rkns.link",
  "shorte.st", "sh.st", "gestyy.com", "destyy.com",
  "v.gd", "is.gd", "empebau.eu",
  "tinyurl.com", "bit.ly", "rebrand.ly",
  "google-url.com", "justpaste.it",
  // Social unlock
  "socialwolvez.com", "social-unlock.com",
  // Other services
  "thedragonslayer2.github.io",
  // Paste sites
  "pastebin.com", "pastelink.net", "pastesite.com",
  "rentry.co", "controlc.com", "paste.work.ink",
  "privatebin.net", "paster.so", "hastebin.com",
  "bstlar.com", "pastedrop.com", "leakutopia.com",
  "leakslinks.com", "goldpaster.com", "pastes.io",
  "linkdirect.com", "n0paste.com", "pasteflash.com",
  "leaked.tools"
];

const DEFAULT_SETTINGS = {
  smartBypass: true,
  customEndpoint: "https://bypass.city/bypass?bypass={link}",
  knownDomains: KNOWN_AD_DOMAINS,
  lastBypassedDomain: null
};

module.exports = {
  KNOWN_AD_DOMAINS,
  DEFAULT_SETTINGS
};

