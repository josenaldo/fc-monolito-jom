export interface AddClientFacadeInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipcode: string
  }
}

export interface AddClientFacadeOutputDto {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  email: string
  document: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipcode: string
  }
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
  document: string
  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipcode: string
  }
}

export interface ClientAdmFacadeInterface {
  addClient(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>

  findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto>
}
