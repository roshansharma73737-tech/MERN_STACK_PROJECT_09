

//  create the   the constroll the payment according   seat booking   and seats 

const  createpayment =  async (re,res) => {
    try {
        const  {
            type,
            title,
            showDate,
            showTime,
            seats,
            ticketsPrice,
        } = req.body;

        if (
            !type ||
            !title ||
            !showDate ||
            !showTime ||
            !seats ||
            !ticketsPrice 
        ) {
            return  res.status(400).json({message : " payment information is completed !",});
        }

        if (type !== "movie" && type !== "event"){
            return res.status(400).json({message : "please  select at least one seats!"});
        }

        // calculate the amount on the server --->
        const paymentId = "pay-"+ Date.now()+"-"+Math.floor(Math.random()*1000);
        return res.status(200).json({message : " payments sucessfull !",
            payment :{
                paymentId,
                status : "Sucsess",
                type,
                title,
                showDate,
                showTime,
                seats,
                amount,
            },
        });
    }catch (error){
        console.error("payment error:",error);

        res.status(500).json({message :" payment failed. ! ",
        });
    }
};


module.exports = { createpayment, };