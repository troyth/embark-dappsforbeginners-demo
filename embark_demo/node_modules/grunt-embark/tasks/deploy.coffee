module.exports = (grunt) ->

  grunt.registerTask "deploy_contracts", "deploy code", (env_)  =>
    env = env_ || "development"
    contractFiles = grunt.file.expand(grunt.config.get("deploy.contracts"));
    destFile = grunt.config.get("deploy.dest");

    Embark = require('embark-framework')
    Embark.init()
    Embark.blockchainConfig.loadConfigFile('config/blockchain.yml')
    Embark.contractsConfig.loadConfigFile('config/contracts.yml')
    #abi = Embark.deployContracts(env, contractFiles, destFile)

    chainFile = './chains.json'
    abi = Embark.deployContracts(env, contractFiles, destFile, chainFile)
    grunt.file.write(destFile, abi);

