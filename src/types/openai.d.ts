// declare module "openai" {
//   export class Configuration {
//     constructor(options: { apiKey: string });
//   }

//   export interface Message {
//     role: string;
//     content: string;
//   }

//   export interface Choice {
//     index: number;
//     message: Message;
//     finish_reason: string;
//   }

//   export interface CreateChatCompletionResponse {
//     id: string;
//     object: string;
//     created: number;
//     choices: Choice[];
//     usage: {
//       prompt_tokens: number;
//       completion_tokens: number;
//       total_tokens: number;
//     };
//   }

//   export class OpenAIApi {
//     constructor(configuration: Configuration);
//     createChatCompletion(params: {
//       model: string;
//       messages: Message[];
//       max_tokens?: number;
//     }): Promise<CreateChatCompletionResponse>;
//   }
// }
