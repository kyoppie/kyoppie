import random
import os.path
import os
import json
import subprocess
import re
import PIL.Image
from datetime import datetime
# coding: utf-8

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
def get_resize_size(orig,max=640):
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
def calc_framerate(string):
    if(re.match("^[0-9]+(\.[0-9]+)?$",string)):
        return float(string)
    if(re.match("^[0-9]+(\.[0-9]+)?/1$",string)):
        return float(string[:-2])
    return 30
def video_encode(filename):
    new_filename = get_filename("mp4")
    # 情報を取得
    output = json.loads(subprocess.check_output([
        "ffprobe",
        "-print_format","json",
        "-show_format",
        "-show_streams",
        filename
    ]).decode("utf-8"))
    video_count = 0
    audio_count = 0
    video = None
    audio = None
    for stream in output["streams"]:
        codec_type = stream["codec_type"]
        if codec_type == "video":
            video_count += 1
            video = stream
        elif codec_type == "audio":
            audio_count += 1
            audio = stream
    if(video_count > 1 or audio_count > 1 or video_count == 0):
        return
    video_re_encode_flag = False
    if(video["codec_name"] != "h264" or video["pix_fmt"] != "yuv420p"):
        video_re_encode_flag = True
    audio_re_encode_flag = False
    if(audio_count and (audio["codec_name"] != "aac" or audio["channels"] > 2 or audio["codec_tag_string"] != "mp4a")):
        audio_re_encode_flag = True
    args = [
        "ffmpeg",
        "-i",
        filename,
        "-movflags",
        "faststart"
    ]
    if(video_re_encode_flag):
        args.append("-vcodec")
        args.append("libx264")
        args.append("-b")
        args.append("1000k")
        args.append("-pix_fmt")
        args.append("yuv420p")
        args.append("-r")
        args.append("30")
    else:
        args.append("-vcodec")
        args.append("copy")
    if(audio):
        if(audio_re_encode_flag):
            args.append("-acodec")
            args.append("aac")
        else:
            args.append("-acodec")
            args.append("copy")
    args.append("../files"+new_filename)
    res = subprocess.run(args)
    if(res.returncode != 0):
        return
    thumb_size = get_resize_size((video["width"],video["height"]))
    thumb_tori = "../upload_tmp/"+get_temp_save_filename()+".png"
    args = [
        "ffmpeg",
        "-i",
        filename,
        "-ss","0",
        "-vframes","1",
        "-f","image2",
        thumb_tori
    ]
    res = subprocess.run(args)
    if(res.returncode != 0):
        return
    return new_filename,PIL.Image.open(thumb_tori)
    print(output)
    