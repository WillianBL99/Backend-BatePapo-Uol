const participants = {
    post: (req, res, db) => {
        const {name} = req.body;
    
        if(!name || typeof(name) !== 'string'){
            res.sendStatus(422);
    
        } else {
            db.collection("users").insertOne({
                name
            })
            res.send(name);
        }
    },
    get: (req, res, db) => {
        db.collection("users").find().toArray().then(users => {
            res.send(users);
        });
    }
}

export default participants;