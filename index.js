const express = require('express')
const app = express();

const port = 4000;
const date = new Date().toJSON().slice(0, 10);

app.use(express.json())

let users = [
	{
		email: "mcdelossantos@email.com",
		username: "dalagangFilipina",
		password: "mcfilipina",
		isAdmin: false
	},
	{
		email: "crisostomo.ibarra@email.com",
		username: "matanglawin",
		password: "agila123",
		isAdmin: false
	},
	{
		email: "jivanplata@email.com",
		username: "jivanplata",
		password: "admin",
		isAdmin: true
	}
	];

let items = [
	{
	name: "OPPO Reno5 Z",
    description: "Smartphone from OPPO",
    price: 80000,
    isActive: true,
    createdOn: "6/23/23, 4:06:30 PM"
	},

	{
	name: "Mikasa v200w Volleyball",
    description: "Official volleyball for FIVB competitions",
    price: 4000,
    isActive: true,
    createdOn: "6/23/23, 4:011:30 PM"
	},

	{
	name: "Asics Volleyball Kneepads",
    description: "Knee protection for sports",
    price: 300,
    isActive: true,
    createdOn: "6/23/23, 4:17:30 PM"
	},

	];

let orders = [
	{
		userId: 1,
		product: items[0],
		totalAmount: 10000,
		purchasedOn: `${date}`
	},

	{
		userId: 2,
		product: items[1],
		totalAmount: 10298,
		purchasedOn: `${date}`
	},

	{
		userId: 3,
		product: items[2],
		totalAmount: 6700,
		purchasedOn: `${date}`
	},
	];


let loggedUser;

app.post('/users', (req, res) => {

	console.log(req.body);
	let newUser = {
		email: req.body.email,
		username:req.body.username,
		password: req.body.password,
		isAdmin: req.body.isAdmin
	};
	users.push(newUser);
	console.log(users);

	res.send('Registered Successfully.')
});

app.post('/users/login', (req,res) => {
	console.log(req.body);

	let foundUser = users.find((user) => {
		return user.username === req.body.username && user.password === req.body.password;
	});

	if (foundUser !== undefined){
		let foundUserIndex = users.findIndex((user) => {
			return user.username === foundUser.username
		});
		foundUser.index = foundUserIndex;
		loggedUser = foundUser
		console.log(loggedUser);

		res.send('Thank you for logging in.')
	} else {
		loggedUser = foundUser;
		res.send('Login failed. Wrong credentials')
	}
});

app.post('/create/products', (req, res) => {
	console.log(loggedUser);
	console.log(req.body);

	if (loggedUser.isAdmin === true){
		let newItem = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			isActive: req.body.isActive,
			createdOn:req.body.createdOn
		};

		items.push(newItem);
		console.log(items);

		res.send('New products have been added!');
	} else {
		res.send('Unauthorized! You are not the admin.')
	}
});

app.get('/products', (req, res) => {
	console.log(loggedUser);

	if (loggedUser.isAdmin === true) {
		res.send(items);
	} else {
		res.send('Unauthorized! You are not the admin.');
	}
})

app.get('/products/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let index = parseInt(req.params.productId);
	let item = items [index];
	res.send(item);
})

app.get('/products/active', (req,res) => {
	console.log(loggedUser);
	let activeProducts = items.filter((item) => item.isActive === true);

	if (loggedUser.isAdmin === true){
		res.send(activeProducts);
	} else {
		res.status(401).send('Unauthorized. Action Forbidden');
	}

});

app.get('/users/orders', (req,res) => {
	console.log(loggedUser);

	if (loggedUser.isAdmin === true){
		res.send(orders);
	} else {
		res.send ('Error 401: Orders can only be viewed by admins!')
	}
})

app.put('/products/archive/:index', (req,res) => {
	console.log(req.params);
	console.log(req.params.index);
	let itemIndex = parseInt(req.params.index);
	if(loggedUser.isAdmin === true) {
		items[itemIndex].isActive = false;
		console.log(items[itemIndex]);
		res.send('Item Archived')
	} else {
		res.send('Unauthorized. Action Forbidden.');
	}

})

app.put('/products/activate/:index', (req,res) => {
	console.log(req.params);
	console.log(req.params.index);
	let itemIndex = parseInt(req.params.index);
	if(loggedUser.isAdmin === true) {
		items[itemIndex].isActive = true;
		console.log(items[itemIndex]);
		res.send('Item Activated')
	} else {
		res.send('Unauthorized. Action Forbidden.');
	}
})

app.put('/products/update/:productId', (req,res) => {
	console.log(req.params);
	console.log(req.params.productId)
	let productId = parseInt(req.params.productId)
	let product = items [productId]
	if (productId < items.length){
		let newProd = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			isActive: req.body.isActive,
			createdOn: req.body.createdOn
		}

		items[productId] = newProd;
		res.status(203).send('Item has been updated.')
	} else {
		res.status(404).send("Product does not exist")
	}
});

app.put('/users/admin_promotion/:index', (req,res) => {
	console.log(req.params);
	console.log(req.params.index);
	let userIndex = parseInt(req.params.index);
	if(loggedUser.isAdmin === true){
		users[userIndex].isAdmin = true;
		res.send(`User ${users[userIndex].username} is now an admin.`)
	} else {
		res.send('401 - Unauthorized');
	}
	
});

app.delete('/orders/:userId', (req,res) => {
	console.log(loggedUser);
	console.log(req.params);
	console.log(req.params.userId)


	let index = parseInt(req.params.userId)
	if (loggedUser.isAdmin === true){
		delete orders[index]
		res.send('Order has been deleted.');
	} else {
		res.send ('Error 401: Orders can only be deleted by admins!')
	}
})


app.listen(port, () => console.log (`Server is running at port ${port}`));
