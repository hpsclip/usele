import { webcrypto } from 'node:crypto';
import { ReadableStream } from 'node:stream/web';

global.crypto = webcrypto;
global.ReadableStream = ReadableStream;

import('./index.js');