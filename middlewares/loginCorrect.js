export default function validLogin (req,res,next){
    if(typeof (req.session.logined)==='undefined'){
        req.session.logined=false;
    }

    if(req.session.logined===false||req.session.authenticated===true){
        req.session.retUrl= req.originalUrl;
        return res.redirect('/');
    }

    next();
}