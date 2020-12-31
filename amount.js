
function rateCalculation (vehicle){
    switch(vehicle){
        case "Car":
            rate = 3;
            break;
        case "Moto":
            rate = 2;
            break;
        case "Bicicleta":
            rate=1;
            break;
        default:
            rate=1;   
            break;  
    }
    return rate;
}

function rateConversion(rate){
    switch(rate){
        case "3":
            conversion= 50;
            break;
        case "2":
            conversion = 30;
            break;
         case "1":
             conversion = 10;
             break;
             default:
                console.error("Not admitted rate!!");   
    }
}
function durationMinutesConversion (duration){
   durationSplited = duration.splitBy(":");
   hours = durationSplited.get[0]*60; 
   min = durationSplited.get[1];
   sec = 1;
   if(durationSplited.get[2]==0){
       sec = 0;
   }
    return hours+min+sec;
}

function amountCalculation (duration, vehicle){
    rate = rateCalculation(vehicle);
    return rateConversion(rate)*durationMinutesConversion(duration);
}

module.exports = Amount;