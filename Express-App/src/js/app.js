

App = {
  web3: null,
  contracts: {},
  address: "0xd284D1BA411bc1A9663494DAe9C0F0706064585A",
  handler: null,

  init: function () {
    App.populateAddress().then((r) => (App.handler = r[0]));
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.enable();

    return App.initContract();
  },

  initContract: function () {
    App.contracts.Counter = new App.web3.eth.Contract(App.abi, App.address, {});

    console.log(App.contracts.Counter);

    return App.bindEvents();
  },

  bindEvents: async function () {
    $(document).on("click", "#createDoctor", function () {

      App.createDoctor(jQuery("#doctorName").val(), jQuery("#doctorID").val(),jQuery("#doctorSpecialty").val());
    
    });
    $(document).on("click", "#getDoctorDetails", function () {
    
      App.getDoctorDetails(jQuery("#doctorIdGet").val());
    
    });
    $(document).on("click", "#add_patient_details", function () {
    
      App.createPatient(jQuery("#patientName").val(), jQuery("#patientID").val(),jQuery("#prescription").val(),jQuery("#healthScore").val());
    
    });
    $(document).on("click", "#getPatientDetails", function () {
    
      App.getPatientDetails(jQuery("#patientIDGet").val());
    
    });
    $(document).on("click", "#enableAccess", function () {
    
      App.enableAccess(jQuery("#accessId").val());
    
    });
    $(document).on("click", "#getPatientPremium", function () {
    
      App.getPatientInsurance(jQuery("#patientIdInsurance").val());
    
    });
  },

  populateAddress: async function () {
   
     return await ethereum.request({ method: "eth_requestAccounts" });
  },

  createDoctor: async function (doctorName, doctorId,doctorSpecialty) {
    var option = { from: App.handler };
    console.log(option);
  try
  {  
    await App.contracts.Counter.methods
      .createDoctor(doctorId, doctorName,doctorSpecialty)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          alert("Doctor has been created  \n Name "+doctorName+
                "\n Id "+doctorId);
        }

      });
    }
    catch
    {
      alert("Incorrect Id or not permitted to create doctor");
    }
  },

  getDoctorDetails: async function (doctorId) {
   
    
    var option = { from: App.handler};
  //  console.log(App.web3.givenProvider.selectedAddress);   
   console.log(option);
  try{
    await App.contracts.Counter.methods
      .getDoctorDetails(doctorId)
      .call(option).then((r)=>{
        console.log(r);
        if(r._isDoctor == true)
        {
          jQuery("<h4> The doctor name is "+r._name+"</h4>").appendTo("#getDoctor");
          jQuery("<h4> Specialty is "+r._specialty+"</h4>").appendTo("#getDoctor");
        }
        else
        {
          alert("Incorrect id or you not have the access "+doctorId);
        }
      });
    }
  catch(err)
      {
        alert("Incorrect id or you not have the access ");
      }
    },

  createPatient: async function (patientName, patientId,prescription,healthScore) {
    var option = { from: App.handler };
    console.log(option);
    
    try{
      await App.contracts.Counter.methods
      .enterPatientPrescription(patientId, patientName,prescription,healthScore)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          alert("Patient Details Submitted Successfully");
        }
      });
    }
    catch
    {
        alert("Incorrect ID or You do not have the permission to create patient data");

    }
   
  },

  getPatientDetails: async function (patientId) {
   
    
    var option = { from: App.handler};
  //  console.log(App.web3.givenProvider.selectedAddress);   
  //  console.log(option);
  try{
   await  App.contracts.Counter.methods
    .getPatientDetails(patientId)
    .call(option).then((r)=>{
      console.log(r)
       

      jQuery("<h4> The Petient name is "+r._name+"</h4>").appendTo("#getPatient");
      jQuery("<h4> The Petient history is below : </h4>").appendTo("#getPatient");
      length = r._prescriptions.length;

      for(i =0 ; i < length; i++)
      {
        number = i+1;
        jQuery("<h6>"+number+" "+r._prescriptions[i]+"</h6>").appendTo("#getPatient");
      }
      
      
    })
  }
  catch(err)
  {
   /* message = JSON.parse(err);
   console.log(err)
   const startIndex = err.message.search('{')
   const endIndex = err.message.search('}')
   mess = err.message.substring(startIndex,endIndex)+'}\n}';
   console.log(err)
   parsedJson = JSON.parse(mess);
   jQuery('#pname').text(parsedJson.originalError.message); */
   alert("Incorrect id or you do not have the access ");

  }
  

  },
  enableAccess: async function (acessId) {
   
    
    var option = { from: App.handler};
  try
  {
   await App.contracts.Counter.methods
      .enableAccess(acessId)
      .send(option)
      .on("receipt", (receipt) => {
        if (receipt.status) {
          alert("Access Granted");
        }
      });
    }
    catch
    {
      alert("Please enter the correct ID");
    }
  },
  // This is the ABI of HealthCareium

  getPatientInsurance: async function (patientId) {
   
    
    var option = { from: App.handler};
  //  console.log(App.web3.givenProvider.selectedAddress);   
  //  console.log(option);
  try{
   await  App.contracts.Counter.methods
    .getPatientDetails(patientId)
    .call(option).then((r)=>{
      console.log(r)
       
       length = r._healthScore.length
       score = 0 ;

       for(i=0; i < length;i++)
       {
        temp = r._healthScore[i]
        score += Number(temp);
       }
       avgScore = score/length;

       jQuery("<h4> Health Score of "+r._name+" is "+avgScore+"</h4>").appendTo("#getInsurance");

       if(avgScore < 5)
       {
        jQuery("<h4> The Insurance Premium for patient is $1500</h4>").appendTo("#getInsurance");
       }
       else if( avgScore < 8)
       {
        jQuery("<h4> The Insurance Premium for patient is $1200</h4>").appendTo("#getInsurance");
       }
       else
       {
        jQuery("<h4> The Insurance Premium for patient is $900</h4>").appendTo("#getInsurance");
       }




      
    })
  }
  catch(err)
  {
   alert("Incorrect Id or Permission denied to access patient data");
  }
},

  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_specialty",
          "type": "string"
        }
      ],
      "name": "createDoctor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        }
      ],
      "name": "enableAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_prescription",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_healthScore",
          "type": "uint256"
        }
      ],
      "name": "enterPatientPrescription",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        }
      ],
      "name": "onlyPermissibleChecked",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        }
      ],
      "name": "getDoctorDetails",
      "outputs": [
        {
          "internalType": "bool",
          "name": "_isDoctor",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_specialty",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_id",
          "type": "address"
        }
      ],
      "name": "getPatientDetails",
      "outputs": [
        {
          "internalType": "bool",
          "name": "_isPatient",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_prescriptions",
          "type": "string[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_healthScore",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  // This is the end of HealthCareium ABI
};

$(function () {
  $(window).load(function () {
    console.log("Welcome to jquery");
    App.init();
  });
});
