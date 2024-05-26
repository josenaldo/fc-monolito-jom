import { Id } from '@/modules/@shared/domain/value-object/id.value-object'
import { validate as validateId } from 'uuid'

describe('Id unit tests', () => {
  it('should create an valid id from a empty value', () => {
    // Arrange - Given
    // Act - When
    const id = new Id('')

    // Assert - Then
    expect(id).toBeDefined()
    expect(id.value).toBeDefined()
    expect(id.value).not.toBeNull()
    expect(validateId(id.value)).toBeTruthy()
  })

  it('should create an valid id from an undefined value', () => {
    // Arrange - Given
    // Act - When
    const id = new Id(undefined)

    // Assert - Then
    expect(id).toBeDefined()
    expect(id.value).toBeDefined()
    expect(id.value).not.toBeNull()
    expect(validateId(id.value)).toBeTruthy()
  })

  it('should create an valid id from a null value', () => {
    // Arrange - Given
    // Act - When
    const id = new Id(null)

    // Assert - Then
    expect(id).toBeDefined()
    expect(id.value).toBeDefined()
    expect(id.value).not.toBeNull()
    expect(validateId(id.value)).toBeTruthy()
  })

  it('should create an valid id from none value', () => {
    // Arrange - Given
    // Act - When
    const id = new Id()

    // Assert - Then
    expect(id).toBeDefined()
    expect(id.value).toBeDefined()
    expect(id.value).not.toBeNull()
    expect(validateId(id.value)).toBeTruthy()
  })

  it('should create an valid id from a valid value', () => {
    // Arrange - Given
    const value = '123e4567-e89b-12d3-a456-426614174000'

    // Act - When
    const id = new Id(value)

    // Assert - Then
    expect(id).toBeDefined()
    expect(id.value).toBeDefined()
    expect(id.value).not.toBeNull()
    expect(id.value).toBe(value)
    expect(validateId(id.value)).toBeTruthy()
  })

  it('should throw error if try to create an id from an invalid value', () => {
    // Arrange - Given
    const value = 'invalid-id'

    // Act - When
    const createId = () => new Id(value)

    // Assert - Then
    expect(createId).toThrow('Invalid id')
  })
})
