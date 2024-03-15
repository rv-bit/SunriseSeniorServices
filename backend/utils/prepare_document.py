import copy
from backend.config.schema import *


def prepare_document(collection_name, variables):
    if collection_name == 'users':
        schema = USER_TABLE
    elif collection_name == 'chats':
        schema = CHAT_TABLE
    elif collection_name == 'messages':
        schema = MESSAGE_TABLE
    elif collection_name == 'jobListings':
        schema = JOB_TABLE
    else:
        raise ValueError(f"Unknown collection name: {collection_name}")

    document = copy.deepcopy(schema())

    # Check if all required keys are present
    for key, value in document.items():
        if value.get("required", False) and key not in variables:
            raise ValueError(f"Missing required key: {key}")

    # Update the document with the variables
    for key in variables:
        if key in document:
            if not isinstance(variables[key], document[key]["type"]):
                raise TypeError(
                    f"Expected type {document[key]['type']} for {key}, got {type(variables[key])}")

            document[key]["default_value"] = variables[key]

    data = {k: v["default_value"] for k, v in document.items()}

    return data
