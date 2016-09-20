import requests
import config
import hashlib

def login(userName,password):
    r = requests.post(config.web["api"]+"/auth/get_sigkey",data={"appKey":config.api["appKey"]}).json()
    sigKey = r["response"]["sigKey"]
    appSecretHash = hashlib.sha256((config.api["appSecret"]+r["response"]["sigHash"]).encode("utf-8")).hexdigest()
    r = requests.post(config.web["api"]+"/auth/get_request_token",data={"appKey":config.api["appKey"],"appSecret":appSecretHash,"sigKey":sigKey}).json()
    requestToken = r["response"]["token"]
    r = requests.post(config.web["api"]+"/auth/login",data={"requestToken":requestToken,"screenName":userName,"password":password}).json()
    if(r["result"] == False):
        return r
    pinCode = r["response"]["code"]
    r = requests.post(config.web["api"]+"/auth/get_sigkey",data={"appKey":config.api["appKey"]}).json()
    sigKey = r["response"]["sigKey"]
    appSecretHash = hashlib.sha256((config.api["appSecret"]+r["response"]["sigHash"]).encode("utf-8")).hexdigest()
    r = requests.post(config.web["api"]+"/auth/get_access_token",data={"appKey":config.api["appKey"],"appSecret":appSecretHash,"sigKey":sigKey,"pinCode":pinCode,"requestToken":requestToken}).json()
    if(r.get("response")):
        r["response"]["token"] = hashlib.sha256((config.api["appKey"]+r["response"]["token"]+config.api["appSecret"]).encode("utf-8")).hexdigest()
    return r
def get(endpoint,params={},token=None):
    header={}
    if(token):
        header["X-Kyoppie-Access-Token"]=token
    return requests.get(
        config.web["api"]+"/"+endpoint,
        params=params,
        headers=header
    ).json()
def post(endpoint,params={},token=None):
    header={}
    if(token):
        header["X-Kyoppie-Access-Token"]=token
    return requests.get(
        config.web["api"]+"/"+endpoint,
        params=params,
        headers=header
    ).json()
