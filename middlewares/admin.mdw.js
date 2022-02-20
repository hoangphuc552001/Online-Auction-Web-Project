export default function validAdmin(req,res,next){
    if(req.session.admin===false){

        if(req.session.authenticated===true){
            return res.redirect('/');
        }
        req.session.retUrl= req.originalUrl;
        return res.redirect('/login');
    }
    next();
}