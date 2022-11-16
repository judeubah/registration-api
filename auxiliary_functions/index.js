 const day_string = (day_number)=>{
    switch(day_number){
        case 0:
            return "sunday";
            break
        
        case 1:
            return "monday";
            break
        
        case 2:
            return "tuesday";
            break
        
        case 3:
            return "wednesday";
            break
        
        case 4:
            return "thursday";
            break
        
        case 5:
            return "friday";
            break
        
        case 6:
            return "saturday";
            break
        
    }
}

module.exports = day_string;