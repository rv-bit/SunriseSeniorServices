from pymongo import MongoClient


class DB:
    def __init__(self, mongo_uri):
        self.client = MongoClient(mongo_uri)
        self.main_db = self.client.get_database('CareersForHelp')

    def Get(self, collection_name):
        return self.main_db.get_collection(collection_name)

    def Insert(self, collection_name, data):
        collection = self.Get(collection_name)
        return collection.insert_one(data)

    def FindAll(self, collection_name, query):
        collection = self.Get(collection_name)
        return collection.find(query)

    def Find(self, collection_name, query):
        collection = self.Get(collection_name)
        return collection.find_one(query)

    def Update(self, collection_name, query, data):
        collection = self.Get(collection_name)
        return collection.update_one(query, data)

    def Delete(self, collection_name, query):
        collection = self.Get(collection_name)
        return collection.delete_one(query)
