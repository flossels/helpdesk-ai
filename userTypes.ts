type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  role: 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER'
  organizationId: string
  createdAt: Date
}

// For displaying in a list, only what the UI needs
type UserListItem = Pick<User, 'id' | 'name' | 'email' | 'role'>

// For profile updates, only editable fields, all optional
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>

// Demonstrate the types
const listItem: UserListItem = {
  id: 'usr-001',
  name: 'Alice',
  email: 'alice@example.com',
  role: 'AGENT'
}

const update: UserUpdate = {
  name: 'Alice B.'
  // email is optional; we can omit it
}

console.log('List item:', listItem)
console.log('Update:', update)
