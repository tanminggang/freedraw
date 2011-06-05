import SocketServer
import SimpleHTTPServer
import urllib
import urlparse
import threading
import time
import json
from select import select
import sys
import struct
import hashlib
from cStringIO import StringIO

import os

html_file_path = os.getcwd()+'/html/freedraw.html'
paintscript_file_path = os.getcwd()+'/html/paintscript.html'

tracing = False

class ReuseTCPServer(SocketServer.ThreadingTCPServer):
    allow_reuse_address = True

class MapperHTTPServer(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        command = self.path
        args = []
        try:
            parsed = urlparse.urlparse(self.path)
            command = parsed.path
            args = dict(urlparse.parse_qsl(parsed.query))
        except Exception, e:
            print e

        contenttype = { 'html': 'Content-Type: text/html; charset=UTF-8',
                        'js': 'Content-Type: text/javascript',
                        'css': 'Content-Type: text/css',
                        'json': 'Content-Type: text/javascript' }
        def found(type=''):
            print >>self.wfile, "HTTP/1.0 200 OK"
            try:
                print >>self.wfile, contenttype[type]
            except KeyError:
                pass
            finally:
                print >>self.wfile

        def notfound(type=''):
            print >>self.wfile, "HTTP/1.0 404 Not Found"
            try:
                print >>self.wfile, contenttype[type]
            finally:
                print >>self.wfile

        try:
            found(handlers[command][1])
            handlers[command][0](self.wfile, args)
        except KeyError:
            try:
                f = open(self.path[1:])
                found(self.path.rsplit('.',1)[-1])
                self.copyfile(f, self.wfile)
            except IOError:
                notfound('html')
                print >>self.wfile, "404 Not Found:", self.path

def handler_page(out, args):
    html_file = open(html_file_path,'r')
    print >>out, html_file.read() 
    html_file.close()

def handler_micro_page(out, args):
    html_file = open(paintscript_file_path,'r')
    print >>out, html_file.read() 
    html_file.close()

def handler_wait_command(out, args):
    pass

def handler_send_command(out, args):
    pass

handlers = {'/': [handler_page, 'html'],
            '/micro': [handler_micro_page, 'html'],
            '/wait_cmd': [handler_wait_command, 'json'],
            '/send_cmd': [handler_send_command, 'json']}

cmd_handlers = {}

def add_command_handler(cmd, handler):
    cmd_handlers[cmd] = handler

def serve(port=8000, poll=lambda: time.sleep(10)):
    httpd = ReuseTCPServer(('', port), MapperHTTPServer)

    http_thread = threading.Thread(target=httpd.serve_forever)
    http_thread.daemon=True
    http_thread.start()

    print "serving at port", port
    try:
        while 1:
            time.sleep(1)
            poll()
    except KeyboardInterrupt:
        pass

    print "shutting down..."
    httpd.shutdown()
    http_thread.join()
    print 'bye server.'
