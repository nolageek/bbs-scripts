# depends on id3reader module from 
# https://nedbatchelder.com/code/modules/id3reader.html
#
# MP3s must all have the following tags: title, performer, comment
# Spaces in filenames will likely break this.
#
# usage: mp3tofilesbbs.py [-h] [-d DIRECTORY] [-f FILENAME] [-a ARTIST]
# 
# Defaults: -d <current directory> -f <FILES.BBS> -a <from MP3 artist/performer/album tag>
#
# optional arguments:
#  -h, --help            show this help message and exit
#  -d DIRECTORY, --directory DIRECTORY
#                        Example: c:\path\to\files OR "c:\path to\files"
#  -f FILENAME, --filename FILENAME
#                        Example: FILES.BBS
#  -a ARTIST, --artist ARTIST
#                        Example: Beyonce OR "Dead Meat Podcast"
#

import id3reader
import textwrap
import os
import sys
import argparse

# -*- coding: ascii -*-

#directory = sys.path[0]

def filenamecase(string):
    filenamecase = ' '.join([s[0].upper() + s[1:] for s in string.split(' ')])
    return filenamecase
    
    
def cleanstring(string):
        cleanstring = string.replace(u'\u2013', '-').replace(u'\u201c', '"').replace(u'\u201d', '"').replace(u'\u2019', "'").replace(u'\xe9', "e").replace(u'\xe1', "'").replace(u'\xc6', "'")
        cleanstring = cleanstring.replace(' ', '"').replace(' ', '"').replace('XXX', '').replace(" ", "'")
        cleanstring = cleanstring.replace('\x00', '').replace('\u201c', '')
        return cleanstring

def cleanfilename(string):
        cleanfilename = cleanstring(string)
        cleanfilename = filenamecase(cleanfilename)
        cleanfilename = cleanfilename.replace('_','-').replace('---','-').replace('--','-').replace('--','-').replace("'",'').replace('"','')
        cleanfilename = cleanfilename.replace('...','.').replace('..','.').replace('..','.').replace('-.','.').replace('!','').replace('&','and')
        cleanfilename = cleanfilename.replace(' ','')
        return cleanfilename
        
        
def wrap(string, color):
        indent = '  '
        if color:
            indent = indent + color
            
        wrap = textwrap.fill(string, width=40,initial_indent=indent,subsequent_indent=indent)
        return wrap

def yes_or_no(question):
    while "the answer is invalid":
        reply = str(raw_input(question +'? (y/N): ')).lower().strip()
        if reply[:1] == 'y':
            return True
        else:
            quit()

parser = argparse.ArgumentParser(description = "Defaults: -d <current directory> -f <FILES.BBS> -a <from MP3 artist/performer/album tag>")
parser.add_argument("-d", "--directory", help = 'Example: c:\path\\to\\files OR "c:\path to\\files"', required = False, default = sys.path[0])
parser.add_argument("-f", "--filename", help = "Example: FILES.BBS", required = False, default = "FILES.BBS")
parser.add_argument("-a", "--artist", help = 'Example: Beyonce OR "Dead Meat Podcast" This will replace artist for ALL FILES.', required = False, default = "")
argument = parser.parse_args()
status = False

if argument.directory:
    directory = argument.directory
    status = True
if argument.filename:
    filename = argument.filename
    status = True
if argument.artist:
    artist = argument.artist
    status = True
if not status:
            print("Hmm. Something went wrong.") 

path = os.path.join(directory, filename)

yes_or_no('Continue using ' + path)


f = open(path, "w")

for file in os.listdir(directory):

        

    if file.endswith(".mp3"):
        if ' ' or '_' or "'" or '&' in file:
            filenamenew = cleanfilename(file.decode("ascii", errors="ignore").encode())
            print('Old file name: ' + file)
            os.rename(os.path.join(directory, file), os.path.join(directory, filenamenew))
            file = filenamenew
        # Construct a reader from a file or filename.
        id3r = id3reader.Reader(os.path.join(directory, file))

        # Ask the reader for ID3 values:
        
        # First, figure out what to use for artist
        if argument.artist:
            artist = argument.artist
        elif id3r.getValue('artist'):
            artist = id3r.getValue('artist')
        elif id3r.getValue('performer'):
            artist = id3r.getValue('performer')
        elif id3r.getValue('album'):
            artist = id3r.getValue('album')
        else:
            print('No artist information.')
            print('Check MP3 tags or specify artist via --artist "Artist name"')
            quit()
        
        #  title:
        title = id3r.getValue('title')
        
        #comment :
        comment = id3r.getValue('comment')
        
        # clean them up
        
        artist = wrap(cleanstring(artist),'|11')
        title = wrap(cleanstring(title),'|03')
        comment = wrap(cleanstring(comment.decode("ascii", errors="ignore").encode()),'|07')
  
        print('New file name: ' + file)
        f.write(file + '')
        print artist
        f.write(artist + '\n')
        print title
        f.write(title + '\n')
        if comment:
            print '  -desc-  '
            f.write('  |08-desc-\n')
            print comment
            f.write(comment + '\n')
        
    else:
        continue
        
f.close()        
        
