// crea the middleware like  verification  function  this ( reuasable ) function in any  other file

const  jwt =  require("jsonwebtoken");  // import the jwt--->

const authmiddleware = (req,res, next ) =>{
    try {
        const authen_header =  req.headers.autorization;

        if(!authen_header){
            return res.status(401).json({
                message :"Authentication required"
            });
        }
        const parts =  authen_header.split(' ');
        if( parts.length !==2 || parts[0]  !== "bearer"){
            return res.status(401).json({message : " Invalid token !"});
        }

        const token = parts[1];

        // the  verify the token by the  jwt verification function ---->

        const  decoded = jwt.verify(token, process.env.JWT_SECRETkey);

        req.user =decoded;

        next();
    } catch (error) {
        console.error("Authentication  error:", error);
        return res.status(401).json({message : " Invalid  or Expire Token !"});
    }
};

module.exports = authmiddleware;