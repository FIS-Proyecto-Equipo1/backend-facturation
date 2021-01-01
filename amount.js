
function rateCalculation (vehicle){
    var rate;
    switch(vehicle){
        case "Coche":
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
    var conversion;
    switch(rate){
        case 3:
            conversion= 50;
            break;
        case 2:
            conversion = 30;
            break;
         case 1:
            conversion = 10;
            break;
        default:
            console.error("Not admitted rate!!"); 
            break;

    }
    return conversion
}

function durationMinutesConversion (duration){
    let durationSplited = duration.split(":");
    var hours = durationSplited[0]*60;
    var min = parseInt(durationSplited[1], 10);
    var sec = 1;
    if(parseInt(durationSplited[2], 10) === 0){
        sec = 0;
    }
    return hours+min+sec;
}

function amountCalculation (duration, vehicle){
    var rate = rateCalculation(vehicle);
    return rateConversion(rate)*durationMinutesConversion(duration);
}

module.exports = Amount;
