import { handleKeapLockWebhook } from '../webhook';

export async function POST(request: Request) {
  return handleKeapLockWebhook(request, 'unlock');
}
