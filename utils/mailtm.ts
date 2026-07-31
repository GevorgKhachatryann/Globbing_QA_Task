import { request, APIRequestContext } from '@playwright/test';
import { Agent } from 'undici';

const MAIL_TM_BASE = 'https://api.mail.tm';

let apiContext: APIRequestContext | null = null;

async function getApiContext() {
  if (!apiContext) {
    apiContext = await request.newContext({
      baseURL: MAIL_TM_BASE,
      timeout: 30000,
    });
  }

  return apiContext;
}

export interface MailTmAccount {
  id: string;
  address: string;
  password: string;
  token: string;
}

export interface MailTmMessageSummary {
  id: string;
  from: {
    address: string;
    name?: string;
  };
  subject: string;
  intro: string;
  createdAt: string;
}



/* Create mail.tm account */
export async function createMailTmAccount(
  address: string,
  password: string
): Promise<MailTmAccount> {

    const api = await getApiContext();
    const createRes = await api.post('/accounts', {
      data: {
        address,
        password,
      },
    });

    if (!createRes.ok()) {
      throw new Error(
        `Account creation failed: ${createRes.status()} ${await createRes.text()}`
      );
    }

    const created = await createRes.json();

    console.log(
      'Created:',
      created.address
    );

    const tokenRes = await api.post('/token', {
      data: {
        address: created.address,
        password,
      },
    });

    if (!tokenRes.ok()) {
      throw new Error(
        `Token failed: ${tokenRes.status()} ${await tokenRes.text()}`
      );
    }

    const tokenData = await tokenRes.json();

    return {
      id: created.id,
      address: created.address,
      password,
      token: tokenData.token,
    };
  }


  export async function getMessages(
    account: MailTmAccount
  ): Promise<MailTmMessageSummary[]> {

    const api = await getApiContext();
    const response = await api.get('/messages', {
      headers:{
        Authorization:
          `Bearer ${account.token}`
      }
    });

    if(!response.ok()){
      throw new Error(
        `Get messages failed: ${response.status()}`
      );
    }

    const data = await response.json();
    return data['hydra:member'] ?? [];

  }

  async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = 5
  ): Promise<Response> {

    for (let attempt = 1; attempt <= retries; attempt++) {

      try {
        const response = await fetch(url, {
          ...options});

        return response;

      } catch (error) {

        console.log(
          `Mail.tm request failed ${attempt}/${retries}: ${url}`
        );

        if (attempt === retries) {
          throw error;
        }
        await new Promise(resolve =>
          setTimeout(resolve, 5000)
        );
      }
    }
    throw new Error('Mail.tm request failed');
  }

  export async function getMessageBody(
    account: MailTmAccount,
    messageId:string
  ):Promise<string>{


  const api = await getApiContext();
  const response = await api.get(`/messages/${messageId}`,{
      headers:{
        Authorization:
        `Bearer ${account.token}`
      }
    });

  if(!response.ok()){
    throw new Error(
      `Get message failed: ${response.status()}`
    );
  }

  const message = await response.json();

  return `
  ${message.text ?? ''}
  ${message.html?.join('\n') ?? ''}
  `;

}






export async function waitForMessage(
  account: MailTmAccount,
  {
    timeoutMs = 90000,
    intervalMs = 5000,
  } = {}
): Promise<MailTmMessageSummary>{

  const endTime = Date.now() + timeoutMs;
  while(Date.now() < endTime){
    const messages = await getMessages(account);

    if(messages.length){

      console.log(
        'Email received:',
        messages[0].subject
      );
      return messages[0];
    }

    console.log(
      'Waiting email...'
    );

    await new Promise(resolve =>
      setTimeout(resolve, intervalMs)
    );

  }

  throw new Error(
    `No email received for ${account.address}`
  );

}


export function extractConfirmationLink(body: string): string {
  const confirmButtonRegex = /class="email_text_link"[^>]+href="([^"]+)"/;
  const match = body.match(confirmButtonRegex);

  if (!match) {
    throw new Error(
      'Confirmation button link not found'
    );
  }

  return match[1];
}