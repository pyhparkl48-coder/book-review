import {env} from 'cloudflare:workers';
import {handleCoach} from '../../lib/server-coach';
export async function POST(request:Request){return handleCoach(request,env as unknown as Record<string,string|undefined>)}
