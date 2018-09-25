import { gql } from 'apollo-server-express';

export default gql`
    type User {
        id: Int!
        username: String!
        email: String!
        messages: Message!
        teams: [Team!]!
    }
    
    type Query {
        getUser(id: Int!): User!
        allUsers: [User!]!
    }
    
    type RegisterResponse {
        success: Boolean!
        user: User
        errors: [Error!]
    } 
    
    type LoginResponse {
        success: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }
    
    type Mutation {
        register(username: String!, email: String!, password: String!): RegisterResponse!
        login(email: String!, password: String!): LoginResponse!
    }
`;
