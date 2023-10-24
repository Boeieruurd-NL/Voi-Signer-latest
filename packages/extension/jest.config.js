module.exports = {
  verbose: true,
  moduleNameMapper: {
    "^@voisigner/common(.*)$": "<rootDir>/../common/src$1",
    "^@voisigner/crypto(.*)$": "<rootDir>/../crypto/$1",
    "^@voisigner/storage(.*)$": "<rootDir>/../storage/$1",
    "^@algosdk$": "<rootDir>/node_modules/algosdk"
  },
  setupFiles: [
    "jest-webextension-mock"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}