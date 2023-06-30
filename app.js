const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const users = [];


app.get("/users", async(req,res)=>{
    res.json(users);
});


app.post("/signup", async(req,res)=>{
    try{
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Salt value is random generated value that we add to the hash so it make it difficult for hackers to decrypt the password.
        // This value represents the number of rounds of the key derivation function that will be used to generate the salt.
        // At 10 rounds few hashes/s. 20 takes more times to make single hash but more secure.

        // console.log(salt);
        // console.log(hashedPassword);

        const user = {name:req.body.name, password:hashedPassword};
        users.push(user);

        res.status(201).send("Successfully created a user");
    }
    catch(err){
        console.log(err);
    }
    
});


app.post("/login", async(req,res) => {
    const user = users.find(user => req.body.name == user.name);
    if(user == null){
        return res.status(400).send("User not found");
    }

    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Successfully user login");
        }
        else{
            res.send("Not Allowed: Wrong Credentials");
        }
    }
    catch(err){
        console.log(err);
    }
});


app.listen(3000, ()=> {
    console.log("Server running at port 3000");
});


// Salt: If 2 users have same passwords and we don't use salt with hash it genrates same hash for both of these passwords.
// Salt value is random generated value that we add to the hash so it make it difficult for hackers to decrypt the password. So if hacker get 1 hash value he din't get hash of other same password