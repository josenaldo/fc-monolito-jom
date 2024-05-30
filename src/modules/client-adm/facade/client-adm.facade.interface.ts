export interface AddClientFacadeInputDto {
  id?: string
  name: string
  email: string
  address: string
}

export interface AddClientFacadeOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  address: string
}

export interface FindClientFacadeInputDto {
  id: string
}

export interface FindClientFacadeOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  address: string
}

export interface ClientAdmFacadeInterface {
  addClient(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>

  findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto>
}
