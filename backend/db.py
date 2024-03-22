import os

from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.environ.get("MONGO_URI")


class DB:
    def __init__(self):
        self.client = MongoClient(mongo_uri)

        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")

            self.main_db = self.client.get_database('CareersForHelp')
        except Exception as e:
            print(e)

    def Get(self, collection_name):
        return self.main_db.get_collection(collection_name)

    def Insert(self, collection_name, data):
        collection = self.Get(collection_name)
        return collection.insert_one(data)

    def FindAll(self, collection_name, query, sort=None, limit=None):
        collection = self.Get(collection_name)
        result = collection.find(query)
        if sort:
            result = result.sort(sort)
        if limit is not None:
            result = result.limit(limit)
        return list(result) if result else []

    def Find(self, collection_name, query):
        collection = self.Get(collection_name)
        return collection.find_one(query)

    def Update(self, collection_name, query, data):
        collection = self.Get(collection_name)
        return collection.update_one(query, data)

    def Delete(self, collection_name, query):
        collection = self.Get(collection_name)
        return collection.delete_one(query)
