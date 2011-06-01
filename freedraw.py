#!/usr/bin/env python

import http_server as server
import sys
import time

if 'tracing' in sys.argv[1:]:
    server.tracing = True

#server.serve(port=8000, poll=lambda: monitor.poll(100))
server.serve(port=8000, poll=lambda: time.sleep(.1))

print 'bye main.'
