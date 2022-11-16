const router = require('express').Router();
const Category = require('../Models/Category');
const Registration = require('../Models/Registration');
const day_string = require('../auxiliary_functions/index');
const { collection } = require('../Models/Category');


router.post('/new', async(req, res)=>{
    const {body:{full_name, email, job, company, phone, chosen_categories}} = req;

    const registration = new Registration({
        full_name,
        email,
        job,
        company,
        phone,
        chosen_categories
    })
 try {
    const reg_save = await registration.save();
    res.status(200).json(reg_save);
    console.log(reg_save)
 } catch (error) {
    res.status(500).json(error)
    console.log(error)
 }
});

router.get('/get_reg', async(req, res)=>{
    const {body:{full_name}} = req;

    try {
        const person = await Registration.find({
            "full_name":full_name
        })
        res.status(200).json(person)

        const email  = person[0].email;        
        
        let company = email.slice(email.indexOf('@')+1, email.lastIndexOf("."));
       
        const sub_categories = person[0].chosen_categories;
        
        
    


        // this is a major cluster that will update all areas that are included in the selection of a 
        // a registrants categories
        const streams = [];
        let time = Date.now()
        const sub_categories_stack = sub_categories;
        sub_categories.forEach(async (category)=>{

            // //here it is very simple we are just increasing the sub cat's entries
            const increase_sub_entries = await Category.updateOne({
                "sub_categories.name": category
            },{
                $inc:{"sub_categories.$.entries":1}
            });
            
            //here we are increasing the streams entries 
            //if there were two sub cats of the stream then the stream would/
            //get two increases = but check this
            const increase_stream_entries = await Category.updateOne({
                "sub_categories.name": category
            },{
                $inc:{"entries": 1}
            })


            //update_times_between   
            const find_individual_most_recent = await Category.findOne({
                "sub_categories.name": category
            })  
            let most_recent;
           find_individual_most_recent.sub_categories.map((sub)=>{
                if(sub.name === category){
                    most_recent = sub.time.most_recent_entry
                }
            });
            const update_recent_entries = await Category.updateOne({
                "sub_categories.name": category
            }, {
                $push:{"sub_categories.$.time.recent_entries": time - most_recent}
            })

           const update_most_recent = await Category.updateOne({
            "sub_categories.name":category
           },
           {
            $set:{"sub_categories.$.time.most_recent_entry": time}
           })
           //</end_update_times_between




            //<update company_emails
            const find_streams = await Category.findOne({
                "sub_categories.name": category
            })
            if(!streams.includes(find_streams.stream)){
                streams.push(find_streams.stream);
                const find_non_init = await Category.find({
                    "stream":find_streams.stream,
                    [`companies.tally.${company}`]: {$type:"number"}
                })
                if(find_non_init.length <1){
                    const init = await Category.updateOne({
                        "stream":find_streams.stream
                    },{
                        $set:{[`companies.tally.${company}`]: 1}
                    })
                    
                }else{
                    const increase_company_tally = await Category.updateOne({
                        "stream":find_streams.stream
                    },{
                        $inc:{[`companies.tally.${company}`]: 1}
                    })
                }

            }
            
            
         

            ///this will increase the day_dictionary tally 
            const increase_day_tally  = await Category.find({
                "sub_categories.name": category
            });
            if(increase_day_tally.length){ //we will check if we found any collections match our parameters

                //we then then locate and define our day_dictionary to use later;
                const day_dictionary = increase_day_tally[0].sub_categories[0].time.day_dictionary;         
                
                //We need these variables to find what the most common day is
                let modal_day = "";
                let modal_day_value = -Infinity;
                //^^

                //we loop through every day in the dictionary to update the day that the submission was made
                for (const day in day_dictionary){
                    if(day === day_string(new Date().getDay())){  //this will check if the day matches the day of the submission

                        const update_days = await Category.updateOne({
                            "sub_categories.name": category
                        },{
                        $inc:{[`sub_categories.$.time.day_dictionary.${day}`] : 1} //increase that particular day by one
                        //as that day has another entry
                      })                      
                      
                    }
                    //now using the same loop we will be checking if the new value of the dictionary[day] is 
                    // is higher than all the others and we will set it to that day
                    if(day_dictionary[day] > modal_day_value){
                        modal_day_value = day_dictionary[day]
                        modal_day = day;
                    }
                    
                }
                //straight after this loop we will update the modal day to the day that we have now found to be
                //the modal day with the new entry having been logged
                const update_sub_modal_day = await Category.updateOne({
                    "sub_categories.name":category
                },{
                    $set:{"sub_categories.$.time.modal_day": modal_day}
                })

                
                
            }
            //</end of increase day tally>

         

        })   
                
    } catch (error) {
        res.status(500).json(`${error}, did you input all the correct information`);
        console.log(error)
    }
})
module.exports = router;