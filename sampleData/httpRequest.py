import requests, json
from collections import OrderedDict

headers = {
'Content-Type': 'application/json;charset=UTF-8',
'kf-api-key': 'd3815407d04f447afbf30e82e9a91f0c82a1e1b9' #Use Parent account API Key if applicable
}

def path_helper(n):
    path1 = "https://app.klipfolio.com/api/1/datasources/"+n
    path2 = path1 + "/properties"
    return [path1,path2]


def getDetails(ids):
    DS_details = OrderedDict()
    for i, id in enumerate(ids, start=1):
        while True:
            try:
                urls = path_helper(id)
                url1, url2 = urls[0], urls[1]
                temp = OrderedDict()
                r1,r2 = requests.get(url1, headers=headers), requests.get(url2, headers=headers)
                response1, response2 = json.loads(r1.text), json.loads(r2.text)
                temp.update({"service":response1["data"]["connector"]})
                # temp.update({"type":"simple_rest"})
                temp.update({"type":response1["data"]["connector"]})
                temp.update({"name":response1["data"]["name"]})
                temp.update({"libraryAlias":temp["name"].replace(" ", "")})
                temp.update({"description":"  "})
                temp.update({"format":response1["data"]["format"]})
                temp.update({"refreshInterval":14400})
                temp["props"] = OrderedDict()
                temp["props"].update({"endpoint_url":response2["data"]["properties"]["endpoint_url"]})
                # temp["props"].update({"parameters":response["data"]["properties"]["parameters"]})
                # temp["props"].update({"advancedQuery":response2["data"]["properties"]["advancedQuery"]})
                # temp["props"].update({"mode":response2["data"]["properties"]["mode"]})
                # temp["props"].update({"profile":response2["data"]["properties"]["profile"]})
                temp = {response1["data"]["connector"]+"-"+str(i): temp}
                DS_details.update(temp)
                print (temp,'\n')
            except KeyError:
                print ('Failed to retrieve data. retrying..')
                continue
            break
    return DS_details

# replace DS_ids with list of datasource IDs from Klip source code
DS_ids = ["002d7ac9baca90d2b902ccfecee0af87","66b40b23f51450efa4bc0227e2915013","bad3aa3e2c9a81776b0e5718ad5ed46a","3c6340c51d17d0bca7a4d552228f9be3","7cbd205b2c4cb56c12a3b6580f6e9fcc","fb1aab94dc7a68521384e0f9ec466cab","1576ba37c2bd9d4332783a7927ac9a9a","26509aed38a57014674471603be716e2","c35d606386e9a65856f82354441e9874","42bfdd2e6476b84baace21ebbcc48ddf","8532a0bf4b9caf7f72e53f15b421f546","d0cc45bb8eb389d05a081fb8855b8168","ceee6ad493fb407d6a8a84647b967962","66bcbfd9e0efda44134f89a1d728ff14"]

All = getDetails(DS_ids)

with open('dump.json','w') as f:
    json.dump(All, f)


