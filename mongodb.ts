/// <reference path="mongodb.d.ts" />
/// <reference path="es6-promise.d.ts" />
/// <reference path="node_modules/rx/ts/rx" />

//import MongoDb = require("mongodb");

var MongoDb = require("mongodb");
var Rx = require("rx");

module Mongo {
	export class Db {
		static connect(ip: string, port: number, database: string): Promise<MongoDb.Db> {
			var url = `mongodb://${ip}:${port}/${database}`;
			
			return new Promise((resolve,reject) => {
				MongoDb.MongoClient.connect(url, (error, db) => {
					if (error) reject(error);
					else resolve(db);
				});
			});
		}
	}
	
	export class Collection {
		static find<T>(query: any, collection: MongoDb.Collection): Rx.Observable<T> {
			return Rx.Observable.create<T>(observer => {
				collection.find(query, (error, result) => {
					if (error) {
						observer.onError(error);
					} else {
						result.each((error, item) => {
							if (error) {
								observer.onError(error);
							} else {
								if (item) {
									observer.onNext(item);
								} else {
									observer.onCompleted();
								}
							}
						});
					}
				});
			});
		}
		
		static insert(data: any, collection: MongoDb.Collection): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				collection.insertOne(data, (error, result) => {
					if (error) reject(error);
					else resolve();
				});
			});
		}
		
		static update(query: any, set: { $set: any }, collection: MongoDb.Collection): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				collection.updateOne(query, set, (error, result) => {
					if (error) reject(error);
					else resolve();
				})
			});
		}
		
		static delete(query: any, collection: MongoDb.Collection): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				collection.deleteOne(query, (error, result) => {
					if (error) reject(error);
					else resolve();
				})
			});
		}
	}
}