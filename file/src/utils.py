import random
import os.path
from datetime import datetime

def get_random_str(length,pattern="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"):
    strs = ""
    for i in range(length):
        strs += pattern[random.randint(0,len(pattern)-1)]
    return strs
def get_temp_save_filename():
    date = datetime.now()
    return date.strftime('%Y%m%d_%H%M%S') + "_" + get_random_str(32)
def get_filename(ext):
    date = datetime.now()
    path = "../files/"
    dirname = date.strftime('%Y%m%d')
    if(not os.path.exists(path+dirname)):
        os.mkdir(path+dirname)
    filename = dirname+"/"+get_random_str(16)+"."+ext
    if(os.path.exists(path+filename)):
        return get_filename(ext)
    return "/"+filename
def get_resize_size(orig,max=480):
    if(orig[0] > orig[1]):
        if(orig[0] < max):
            return orig
        return max,int(orig[1]/(orig[0]/max))
    elif(orig[0] < orig[1]):
        if(orig[1] < max):
            return orig
        return max,int(orig[0]/(orig[1]/max))
    else:
        return max,max
