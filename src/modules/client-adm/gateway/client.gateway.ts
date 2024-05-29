import { Client } from '@/modules/client-adm/domain/client.entity'

export interface ClientGateway {
  add(client: Client): Promise<void>
  find(id: string): Promise<Client>
}
