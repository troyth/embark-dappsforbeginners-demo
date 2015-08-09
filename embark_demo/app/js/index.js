$(document).ready(function() {


  //displays the coinbase and updates the coinbase balance
  function updateBalance(){
    var coinbase = web3.eth.coinbase;
    document.getElementById('coinbase').innerText = coinbase;
    var balance = web3.eth.getBalance(coinbase);
    document.getElementById('balance').innerText = balance;
  };

  //show on pageload
  updateBalance();

  //listens to the blockchain and fires callback when new block mined
  web3.eth.filter('latest', function(error, latestBlockHash){
    if (!error){
      console.log('=======watch(latest) triggered=======');

      //display latest block information
      var blockNumber = web3.eth.blockNumber; //get block number
      var block = web3.eth.getBlock(blockNumber); //get latest block as object
      document.getElementById('latestBlock').innerText = blockNumber;
      document.getElementById('latestBlockHash').innerText = block.hash;
      document.getElementById('latestBlockTimestamp').innerText = Date(block.timeStamp);

      /*
      var contractString = JSON.stringify(web3.eth.storageAt(contractAddress))
      document.getElementById('contractString').innerText = contractString;
      */

      //update coinbase balance
      updateBalance();
    }
  });

  //watch 'pending'
  web3.eth.filter('pending', function(error, result){
    if (!error){
      console.log('watch(pending):');
      console.log(result);

    }
  });



  //contract source code

  //contract abi object

  //function for a simple transaction to transfer ether
  $("#sendEther").click(function() {
    var recipient = document.querySelector('#recipient').value;
    var val = document.querySelector('#value').value;
    console.log("+++++++");
    console.log("sending " + val + " to " + recipient);
    console.log("=======");
    web3.eth.sendTransaction({to: recipient ,value: val });
  });

  //function to create a new contract from our source code
  var metaCoinSource = "contract metaCoin {\n"+
    " mapping (address => uint) balances;\n" +
    " function metaCoin() {\n" +
      " balances[msg.sender] = 10000;\n" +
    " }\n" +
    " function sendCoin(address receiver, uint amount) returns(bool successful) {\n" +
      " if (balances[msg.sender] < amount) return false;\n" +
      " balances[msg.sender] -= amount;\n" +
      " balances[receiver] += amount;\n" +
      " return true;\n" +
    " }\n" +
  "}\n";

  //contract ABI so we can use the instantiated object to call contract functions
  /*
  var contract_abi = [{
    name: "sendCoin",
    type: "function",
    inputs: [
      {
        name: "to",
        type: "address"
      },
      {
        name: "value",
        type: "uint256"
      }
    ]
  }];
  */

  //globals
  var contract;
  var contract_address;
  var bytecode;
  var abi;

  function createSolidityContract() {
    console.log("createSolidityContract()=======");
    web3.eth.compile.solidity(metaCoinSource, function(err, compiled){

      console.log('compiled:');
      console.dir(compiled);

      bytecode = compiled.metaCoin.code;
      abi = compiled.metaCoin.info.abiDefinition;

      console.log('abi:');
      console.dir(abi);

      //wait til contract_instance is created to bind dataTransaction
      $("button#dataTransaction").click(function() {
        console.log("dataTransaction clicked");
        dataTransaction();
      });

    });
    //console.log("bytecode: " + bytecode.metaCoin.code);
    //console.dir(bytecode);



  };

  $("button#createSolidityContract").click(function() {
    console.log("createSolidityContract clicked");
    createSolidityContract();
  });


  //function to send transaction using attributes from the HTML input boxes
  function dataTransaction() {
    console.log("dataTransaction()");

    //collect input values
    var receiverAddress = document.querySelector('#receiverAddress').value;
    var amount = document.querySelector('#amount').value;

    web3.eth.sendTransaction({data: bytecode}, function(err, address){
        if(!err){
          contract_address = address;

          //wait til contract_instance is created to bind dataTransaction

          contract = web3.eth.contract(abi);
          console.log("contract");
          console.dir(contract);

          console.log("contract_address: " + contract_address);
          var contract_instance = contract.at(contract_address);

          console.log('contract_instance.sendCoin( ' + receiverAddress + ", " + amount + " );");
          contract_instance.sendCoin(receiverAddress, amount);

        }else{
          console.log('error sending transaction: ' + err);
        }
    });//end sendTransaction

  };//end dataTransaction



  /*

  $("button.set").click(function() {
    var value = parseInt($("input.text").val(), 10);
    SimpleStorage.set(value);
    addToLog("SimpleStorage.set("+value+")");
  });

  document.getElementsByClassName("get")[0].addEventListener('click', function() {
    var value = SimpleStorage.get().toNumber();
    $(".value").html(value);
    addToLog("SimpleStorage.get()");
  });

  var addToLog = function(txt) {
    $(".logs").append("<br>" + txt);
  }
  */

});
