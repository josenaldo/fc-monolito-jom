export interface DomainToModelMapperInterface<D, M> {
  toDomain(model: M): D
  toModel(domain: D): M
}
