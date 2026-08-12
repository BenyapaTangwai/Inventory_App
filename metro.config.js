const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'web' to platforms so Metro correctly resolves
// platform-specific files like *.web.js inside node_modules
// (fixes react-native-svg "Unable to resolve ./web/WebShape" on web)
config.resolver.platforms = [...(config.resolver.platforms ?? []), 'web'];

module.exports = config;
