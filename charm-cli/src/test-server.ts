import * as http from 'node:http'
import { extname, join } from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync as fileExists } from 'node:fs';

const liveReloadingScript = 
`
    <script>
        const serverEvents = new EventSource('http://127.0.0.1:4200/subscribe-to-server-events');
        serverEvents.onmessage = function(event)
        {
            location.reload();
        }
    </script>
`

let root: string;
let browser: http.ServerResponse;

export function startServer(port: number, startDir: string)
{
    const server = http.createServer(processRequest);
    root = startDir;

    server.listen(port);
}

export function refreshBrowser()
{
    browser.write('data: refresh\n\n');
}

async function processRequest(req: http.IncomingMessage, res: http.ServerResponse)
{
    const isSubscriptionRequest: boolean = req.url == '/subscribe-to-server-events';
    if(isSubscriptionRequest)
    {
        subscribeBrowserToServerEvents(req, res);
        return;
    }

    const path: string = getPath(req);
    const contentType: string = getContentType(path);

    if(!fileExists(path))
    {
        res.writeHead(404);
        res.end('Apologies 🎩');
        return;
    }

    let file: Buffer = await fs.readFile(path);
    
    if(contentType == 'text/html')
    {
        const newFile =  Buffer.concat([file, Buffer.from(liveReloadingScript)])
        file = newFile;
    }

    res.writeHead(200, {'content-type': contentType});
    res.end(file, 'utf-8');
}

function subscribeBrowserToServerEvents(req: http.IncomingMessage, res: http.ServerResponse)
{
    const headers = 
    {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    res.write('you are subscribed\n\n');

    browser = res;
}

function getPath(req: http.IncomingMessage)
{
    let filePath: string = '.' + req.url;
    if (filePath == './')
        filePath = './index.html';

    return join(root, filePath);
}

function getContentType(path: string)
{
    let fileExtension: string = extname(path);
    let contentType: string = 'text/html';

    switch (fileExtension) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    return contentType;
}