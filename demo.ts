/// <reference path="mongodb.ts" />

Mongo.Db.connect("10.0.0.2", 27017, "test").then(db => {
	Mongo.Collection
		.find({}, db.collection("test")).forEach(
			console.log,
			console.log,
			() => db.close());
}).catch(console.log);