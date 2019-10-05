
import users from './schemas/users';


 users.find({ 'id': 1 }, function (err, found) {
    if (err) console.log("Error in users: ",err);
    if (found.length == 0){
        let newUser = {
          id: 1,
          account_type: "Admin",
          // change your name here - David -------
          first_name: "Naresh",  
          last_name: "Akkarapaka",
        };
        users.create( newUser, function (err, user) {
          if (err) console.log("Error:", err);
          else console.log("I am the new user",user);
        });
    }
    else console.log("Found results:",found);
  });