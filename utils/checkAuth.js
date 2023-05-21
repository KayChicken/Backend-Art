import  jwt  from "jsonwebtoken";


export default (req,res,next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if (token) {
        try {
            const decoded = jwt.verify(token , 'SECRET_KEY')
            req.userId = decoded.id
            next()
        }

        catch(err) {
            return res.status(400).json({"message" : "Нет Доступа"})
        }
        
    }

    else {
        return res.status(400).json({"message" : "Нет доступа"})
    }
    
   
    
}